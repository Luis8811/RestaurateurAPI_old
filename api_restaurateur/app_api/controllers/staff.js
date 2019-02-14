var mongoose = require('mongoose');
var Worker = mongoose.model('Worker'); //el modelo de la BD compilado en locations.js
var ComplaintsAndClaims = mongoose.model('ComplaintsAndClaims');

// Function to send the response in an JSON object
var sendJSONresponse = function(res, status, content) {
    console.log(content);
    res.status(status).json(content); 
  };

// Function to read all the workers
module.exports.readStaff = async function(req, res){
    Worker //Mongoose model
     .find({})
     .exec(function (err, workers){
      if(!workers){
        sendJSONresponse(res, 404, {"message" : "workers not found"});
      }else if(err){
        sendJSONresponse(res, 404, err);
      }else{
        sendJSONresponse(res, 200, workers);
      }
     });
  
  };

  // Function to read all the complaints and claims
  module.exports.readAllComplaintsAndClaims = async function(req, res){
    ComplaintsAndClaims //Mongoose model
     .find({})
     .exec(function (err, complaintsAndClaims){
      if(!complaintsAndClaims){
        sendJSONresponse(res, 404, {"message" : "Complaints neither claims was found"});
      }else if(err){
        sendJSONresponse(res, 404, err);
      }else{
        sendJSONresponse(res, 200, complaintsAndClaims);
      }
     });
  };