var mongoose = require('mongoose');
var Worker = mongoose.model('Worker'); //el modelo de la BD compilado en locations.js
var ComplaintsAndClaims = mongoose.model('ComplaintsAndClaims');
var FactComplaintsAndClaims = mongoose.model('Fact_complaints_and_claims');
var utils = require('./utils'); 

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

  // Function to read all the facts of complaints and claims
  module.exports.readAllFactsOfComplaintsAndClaims = async function(req, res){
    FactComplaintsAndClaims //Mongoose model
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

  
  // Function to read the number of the facts of complaints and claims in a period
  module.exports.countOfComplaintsAndClaimsInAPeriod = async function(req, res){
    FactComplaintsAndClaims //Mongoose model
     .find({})
     .exec(function (err, complaintsAndClaims){
      if(!complaintsAndClaims){
        sendJSONresponse(res, 404, {"message" : "Complaints neither claims was found"});
      }else if(err){
        sendJSONresponse(res, 404, err);
      }else{
       var beginDate = req.body.beginDate;
       var endDate = req.body.endDate;
       var indexOfComplaintsAndClaims = 0;
       var count = 0;
       var currentDate = "";
       for(indexOfComplaintsAndClaims = 0; indexOfComplaintsAndClaims < complaintsAndClaims.length; indexOfComplaintsAndClaims++){
         currentDate = complaintsAndClaims[indexOfComplaintsAndClaims].date;
         if(utils.isDateInRange(beginDate, endDate, currentDate)){
           count++;
         }
       }
       sendJSONresponse(res, 201, count);
      }
     });
  };

   // Function to read the number of the facts of complaints and claims in a period to a worker
  module.exports.countOfComplaintsAndClaimsInAPeriodToAWorker = async function(req, res){
    var objWorkerId = new mongoose.Types.ObjectId(req.body.workerid);
    FactComplaintsAndClaims //Mongoose model
     .find({worker_id: objWorkerId})
     .exec(function (err, complaintsAndClaims){
      if(!complaintsAndClaims){
        sendJSONresponse(res, 404, {"message" : "Complaints neither claims was found"});
      }else if(err){
        sendJSONresponse(res, 404, err);
      }else{
        var beginDate = req.body.beginDate;
        var endDate = req.body.endDate;
        var count = 0;
        var indexOfComplaintsAndClaimsOfWorker = 0;
        var currentDate = "";
        for(indexOfComplaintsAndClaimsOfWorker = 0; indexOfComplaintsAndClaimsOfWorker < complaintsAndClaims.length; indexOfComplaintsAndClaimsOfWorker++){
          currentDate = complaintsAndClaims[indexOfComplaintsAndClaimsOfWorker].date;
          if(utils.isDateInRange(beginDate, endDate, currentDate)){
            count++;
          }
        }
        sendJSONresponse(res, 201, count);
      }
     });
  };

   // Function to read the facts of complaints and claims of a worker
  module.exports.complaintsAndClaimsOfAWorker = async function(req, res){
    console.log(req.body.workerid);
    var objWorkerId = new mongoose.Types.ObjectId(req.body.workerid);
    FactComplaintsAndClaims //Mongoose model
     .find({worker_id: objWorkerId})
     .exec(function (err, complaintsAndClaims){
      if(!complaintsAndClaims){
        sendJSONresponse(res, 404, {"message" : "Complaints neither claims was found"});
       // console.log(objWorkerId);
      }else if(err){
        sendJSONresponse(res, 404, err);
        //console.log(objWorkerId);
      }else{
        sendJSONresponse(res, 201, complaintsAndClaims);
      }
     }); 
  };