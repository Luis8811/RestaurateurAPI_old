var mongoose = require('mongoose');
var Client = mongoose.model('Client');

// Function to send the response in an JSON object
var sendJSONresponse = function(res, status, content) {
    console.log(content);
    res.status(status).json(content); 
  };

// Function to read all the clients
module.exports.readClients = async function(req, res){
    Client //Mongoose model
     .find({})
     .exec(function (err, clients){
      if(!clients){
        sendJSONresponse(res, 404, {"message" : "clients not found"});
      }else if(err){
        sendJSONresponse(res, 404, err);
      }else{
        sendJSONresponse(res, 200, clients);
      }
     });
  
  };