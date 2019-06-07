var mongoose = require('mongoose');
var User = mongoose.model('User');
var Worker = mongoose.model('Worker');

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

//FIXME To include bcrypt for password encryption
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
                  User.create({
                    user: req.body.user,
                    password: req.body.password, //TODO To include password encryption with bcrypt
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
          }
        });
      }
    }

  });
}