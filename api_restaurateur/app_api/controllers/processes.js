var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Request = mongoose.model('Request');
var Fact_Request = mongoose.model('Fact_request');
var Fact_Sold_Product = mongoose.model('Fact_sold_product');

// Function to send the response in an JSON object
var sendJSONresponse = function(res, status, content) {
    console.log(content);
    res.status(status).json(content); 
  };

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