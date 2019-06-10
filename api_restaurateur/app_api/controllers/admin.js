var mongoose = require('mongoose');
var User = mongoose.model('User');
var Worker = mongoose.model('Worker');
const bcrypt = require('bcrypt');

// Function to send the response in an JSON object
var sendJSONresponse = function(res, status, content) {
    res.set('Access-Control-Allow-Origin', '*');  
    console.log(content);
    res.status(status).json(content); 
    };

// Function to read all the users
module.exports.readAllUsers = async function(req, res){
    res.header('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
      User
       .find({})
       .exec(function (err, users){
        if(!users){
          sendJSONresponse(res, 404, {"message" : "products not found"});
        }else if(err){
          sendJSONresponse(res, 404, err);
        }else{
          sendJSONresponse(res, 200, users);
        }
       });
    };

// Function to create a new user
module.exports.createUser = async function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods','GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH');
  User
  .find({user: req.body.user})
  .exec(function(err, matches){
    if (err){
      sendJSONresponse(res, 500, 'An error happened at connect to the database.'); 
    } else {
      if (matches.length > 0){
        sendJSONresponse(res, 404, 'User already exists!');
      } else {
        Worker
        .find({identification: req.body.identification})
        .exec(function(errWithWorker, matchesOfWorkers){
          if (errWithWorker) {
            sendJSONresponse(res, 500, 'An error happened at connect to the database.');
          } else {
            if (matchesOfWorkers.length > 0) {
              sendJSONresponse(res, 404, 'Identification provided already exists!');
            } else {
              Worker
              .create({
                name: req.body.name,
                sex: req.body.sex,
                identification: req.body.identification,
                job_title: req.body.job_title
              }, function(errCreationOfWorker, workerCreated){
                if (errCreationOfWorker) {
                  sendJSONresponse(res, 500, 'An error happened at connect to the database for creating a new user.');
                } else {
                  bcrypt.hash(req.body.password, 10, function(errBcrypt, hash) {
                    if (errBcrypt) {
                      sendJSONresponse(res, 500, 'An error happened at trying to encrypt the password');
                    }else {
                      User.create({
                        user: req.body.user,
                        password: hash, 
                        worker_id: workerCreated._id
                      }, function(errCreatingUser, userCreated){
                        if (errCreatingUser){
                          sendJSONresponse(res, 500, 'An error happened at connect to the database for creating a new user.');
                        } else {
                          sendJSONresponse(res, 201, userCreated);
                        }
                      });
                    }
                  });   
                }
              });
            }
          }
        });
      }
    }
  });
}

// Function to login a user
module.exports.login = async function(req, res){
  User
  .find({user: req.body.user})
  .exec(function(errFindUser, users){
    if (errFindUser){
      console.log('An error occurred at login');
      sendJSONresponse(res, 500, errFindUser);
    } else {
      if (users.length == 0){
        sendJSONresponse(res, 400, 'Check username!');
      } else {
        const hashedPassword = users[0].password;
        bcrypt.compare(req.body.password, hashedPassword, function(errComparePasswords, resultOfComparePasswords){
          if (errComparePasswords){
            console.log('An error occurred at login at comparing password from the database and the password introduced by the user.');
            sendJSONresponse(res, 500, errComparePasswords);
          } else {
            if (resultOfComparePasswords == true){
              sendJSONresponse(res, 200, 'Login successfull');
            } else {
              sendJSONresponse(res, 400, 'Check your password!');
            }
          }
        });
      }
    }
  });

}