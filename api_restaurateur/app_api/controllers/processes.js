var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Request = mongoose.model('Request');
var Fact_Request = mongoose.model('Fact_request');
var Fact_Sold_Product = mongoose.model('Fact_sold_product');
var utils = require('./utils'); 

// Function to send the response in an JSON object
var sendJSONresponse = function(res, status, content) {
    console.log(content);
    res.status(status).json(content); 
  };

// Function to determine is currentDate is inside the range between bieginDate and endDate
// The date format is YYYY-MM-DD
var isDateInRange = function(beginDate, endDate, currentDate){
  var objBeginDate = new Date(parseInt(beginDate.substr(0,4)), parseInt(beginDate.substr(5,2)), parseInt(beginDate.substr(8)));
  var objEndDate = new Date(parseInt(endDate.substr(0,4)), parseInt(endDate.substr(5,2)), parseInt(endDate.substr(8)));
  var objCurrentDate = new Date(parseInt(currentDate.substr(0,4)), parseInt(currentDate.substr(5,2)), parseInt(currentDate.substr(8)));
  return ((objCurrentDate >= objBeginDate) && (objCurrentDate <= objEndDate)) ? true : false;
}

// Function to read all the products
module.exports.readProducts = async function(req, res){
    Product //Mongoose model
     .find({})
     .exec(function (err, products){
      if(!products){
        sendJSONresponse(res, 404, {"message" : "products not found"});
      }else if(err){
        sendJSONresponse(res, 404, err);
      }else{
        sendJSONresponse(res, 200, products);
      }
     });
  
  };

  //Function to read the count of products
  module.exports.countOfProducts =  function(req, res){
     Product
      .count({name: {$exists: true}, price: {$exists: true}, description: {$exists: true}})
      .exec(function (err, count){
        if(err){
          sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
        }else{
          sendJSONresponse(res, 200, count);
        }
      });
  };

  //Function to read all the requests
  module.exports.readAllRequests =  function(req, res){
    Request
     .find({})
     .exec(function (err, requests){
       if(err){
         sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
       }else{
         sendJSONresponse(res, 200, requests);
       }
     });
 };

 //Function to read an specific request
 module.exports.readARequest = async function(req, res){
  Request
   .findById(req.params.requestId)
   .exec(function (err, request){
     if(err){
       sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
     }else{
       sendJSONresponse(res, 200, request);
     }
   });
};

 //Function to read all the facts of requests
 module.exports.readAllFactsOfRequests =  function(req, res){
  Fact_Request
   .find({})
   .exec(function (err, requests){
     if(err){
       sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
     }else{
       sendJSONresponse(res, 200, requests);
     }
   });
};

//Function to read an specific fact of request
module.exports.readAFactRequest = async function(req, res){
  Fact_Request
   .findById(req.params.requestId)
   .exec(function (err, request){
     if(err){
       sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
     }else{
       sendJSONresponse(res, 200, request);
     }
   });
};

// Function to read all the facts of sold products
module.exports.readFactsOfSoldProducts = async function(req, res){
  Fact_Sold_Product //Mongoose model
   .find({})
   .exec(function (err, products){
    if(!products){
      sendJSONresponse(res, 404, {"message" : "products not found"});
    }else if(err){
      sendJSONresponse(res, 404, err);
    }else{
      sendJSONresponse(res, 200, products);
    }
   });
};

//Function to read an specific fact of sold product
module.exports.readAFactOfSoldProducts = async function(req, res){
  Fact_Sold_Product
   .findById(req.params.factId)
   .exec(function (err, fact){
     if(err){
       sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
     }else{
       sendJSONresponse(res, 200, fact);
     }
   });
};

//Function to read all the facts of requests between two dates
module.exports.readAllFactsOfRequestsInADateRange =  function(req, res){
  Fact_Request
   .find({})
   .exec(function (err, requests){
     if(err){
       sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
     }else{
       var beginDate = req.body.beginDate;
       var endDate = req.body.endDate;
       var arrayOfFactsOfRequestsInDateRange = new Array();
       var indexOfRequest = 0;
       var indexOfArrayOfFactsOfRequestsInDateRange = 0;
       var currentDate = "";
       for(indexOfRequest = 0; indexOfRequest < requests.length; indexOfRequest++){
         currentDate = requests[indexOfRequest].date;
         if(isDateInRange(beginDate, endDate, currentDate)){
           arrayOfFactsOfRequestsInDateRange[indexOfArrayOfFactsOfRequestsInDateRange] = requests[indexOfRequest];
           indexOfArrayOfFactsOfRequestsInDateRange++;
         }
       }
       sendJSONresponse(res, 201, arrayOfFactsOfRequestsInDateRange);
     }
   });
};
// Function to count the facts of requests between two dates
module.exports.readCountOfFactsOfRequestsInADateRange =  function(req, res){
  Fact_Request
   .find({})
   .exec(function (err, requests){
     if(err){
       sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
     }else{
       var beginDate = req.body.beginDate;
       var endDate = req.body.endDate;
       var indexOfRequest = 0;
       var count = 0;
       var currentDate = "";
       for(indexOfRequest = 0; indexOfRequest < requests.length; indexOfRequest++){
         currentDate = requests[indexOfRequest].date;
         if(isDateInRange(beginDate, endDate, currentDate)){
           count++;
         }
       }
       sendJSONresponse(res, 201, count);
     }
   });
};

//Function to count the number of served clients in a period
module.exports.countServedClientsInAperiod = async function(req, res){
  Fact_Request
   .find({})
   .exec(function (err, requests){
     if(err){
       sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
     }else{
       var beginDate = req.body.beginDate;
       var endDate = req.body.endDate;
       var currentDate = "";
       var servedClients = new Array();
       var countOfServedClients = 0;
       var indexOfRequests = 0;
       var currentClientID = "";
       for(indexOfRequests = 0; indexOfRequests < requests.length; indexOfRequests++){
         currentDate = requests[indexOfRequests].date;
         if(utils.isDateInRange(beginDate, endDate, currentDate)){
           currentClientID = requests[indexOfRequests].client_id.toString();
           if(servedClients.indexOf(currentClientID)==-1){
             servedClients.push(currentClientID);
             countOfServedClients++;
           }
         }
       }
       sendJSONresponse(res, 201, countOfServedClients);
     }
   });
};

//Function to get the more sold products in a date range
module.exports.moreSoldProducts = async function(req, res){
  Fact_Sold_Product
   .find()
   .exec(function (err, fact){
     if(err){
       sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
     }else{
       var beginDate = req.body.beginDate;
       var endDate = req.body.endDate;
       var arrayOfSoldProducts = new Array();
       var arrayOfCountsOfSoldsProducts = new Array();
       var arrayOfResult = new Array();
       var indexOfFact = 0;
       var currentProductId = "";
       var currentDate = "";
       var indexOfSearch = -1;
       for(indexOfFact = 0; indexOfFact < fact.length; indexOfFact++){
         currentDate = fact[indexOfFact].date;
         if(utils.isDateInRange(beginDate, endDate, currentDate)){
           currentProductId = fact[indexOfFact].product_id.toString();
           indexOfSearch = arrayOfSoldProducts.indexOf(currentProductId);
           if(indexOfSearch==-1){
             arrayOfSoldProducts.push(currentProductId);
             arrayOfCountsOfSoldsProducts.push(parseInt(fact[indexOfFact].count));
           }else{
             arrayOfCountsOfSoldsProducts[indexOfSearch]+= parseInt(fact[indexOfFact].count);
           }
         }
       }
       var max = utils.maxValueOfTheArrayOfInt(arrayOfCountsOfSoldsProducts);
       var j = 0;
       for(j = 0; j < arrayOfCountsOfSoldsProducts.length; j++){
         if(arrayOfCountsOfSoldsProducts[j] == max){
           arrayOfResult.push(arrayOfSoldProducts[j]);
         }
       }
       sendJSONresponse(res, 201, arrayOfResult);
     }
   });
};