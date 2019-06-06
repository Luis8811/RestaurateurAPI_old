var mongoose = require('mongoose');
var User = mongoose.model('User');

// Function to send the response in an JSON object
var sendJSONresponse = function(res, status, content) {
    res.set('Access-Control-Allow-Origin', '*');  
    console.log(content);
    res.status(status).json(content); 
    };

// Function to read all the products
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