var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Request = mongoose.model('Request');
var Fact_Request = mongoose.model('Fact_request');
var Fact_Sold_Product = mongoose.model('Fact_sold_product');
var utils = require('./utils'); 
// import moment from 'moment';
var moment = require('moment');

// Function to send the response in an JSON object
var sendJSONresponse = function(res, status, content) {
  res.set('Access-Control-Allow-Origin', '*');  
  console.log(content);
  res.status(status).json(content); 
   // res.header('Access-Control-Allow-Origin', '*');
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
  res.header('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
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
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
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

//Function to get less sold products in a date range
module.exports.lessSoldProducts = async function(req, res){
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
       var min = utils.minValueOfTheArrayOfInt(arrayOfCountsOfSoldsProducts);
       var j = 0;
       for(j = 0; j < arrayOfCountsOfSoldsProducts.length; j++){
         if(arrayOfCountsOfSoldsProducts[j] == min){
           arrayOfResult.push(arrayOfSoldProducts[j]);
         }
       }
       sendJSONresponse(res, 201, arrayOfResult);
     }
   });
};

//Function to create a new product
module.exports.createProduct = async function(req, res){
res.header('Access-Control-Allow-Origin', '*');
res.set('Access-Control-Allow-Origin', 'http://localhost:8100');
res.set('MyHeader', 'Luis'); // Una prueba
res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
res.header('Access-Control-Allow-Headers', 'Content-Type');
//next();
  Product.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  }, function(err, product) {
    //res.header('Access-Control-Allow-Origin', '*');
    if (err) {
      console.log("API Message: An error ocurred.");
      sendJSONresponse(res, 400, err);
    } else {
      console.log("API Message: A product was inserted.");
      sendJSONresponse(res, 201, product);
    }
  });

};

// Function to create a new request
module.exports.createRequest = async function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods','GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH');
  Request.create({
    products: req.body.products,
    description: req.body.description
  }, function(errRequest, requestCreated) {
    if (errRequest){
      console.log('An error had occurred at creation of request');
      sendJSONresponse(res, 404, errRequest);
    }else {
      let currentDateTime = moment();
      let dateOfRequest = currentDateTime.format('YYYY-MM-DD');
      let timeOfRequest = currentDateTime.format('HH:mm:ss');
      Fact_Request.create({
        date: dateOfRequest,
        time: timeOfRequest,
        client_id: req.body.client_id,
        request_id: requestCreated._id
      }, function(errFactRequest, factRequestCreated){
        if (errFactRequest){
          console.log('An error had occurred at creation of fact request');
          sendJSONresponse(res, 404, errFactRequest);
        }else {
          console.log('A new request was created');
          sendJSONresponse(res, 201, factRequestCreated);
        }
      });
    }

  });

}

// Function to read all the facts of requests opened
module.exports.readAllFactsOfRequestsOpened =  function(req, res){
  Fact_Request
   .find({state:"open"})
   .exec(function (err, requests){
     if(err){
       sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
     }else{
       sendJSONresponse(res, 200, requests);
     }
   });
};

// Function to read all the requests opened
module.exports.readAllDataOfRequestsOpened =  function(req, res){
  Request
   .find({state:"open"})
   .exec(function (err, requests){
     if(err){
       sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
     }else{
       sendJSONresponse(res, 200, requests);
     }
   });
};

// Function to read all the data of fact requests including clients and requests
module.exports.readAllDataOfFactRequests = function(req, res){
 Fact_Request
 .find({})
 .populate('client_id')
 .populate('request_id')
 .exec(function(err, fact_requests){
   if (err) {
    sendJSONresponse(res, 500, 'An connection error had occurred. Try connect to the database later.');
   } else {
     sendJSONresponse(res, 200, fact_requests);
   }
 });
}; 

//  Function to close a request
module.exports.closeRequest = function(req, res){
  Fact_Request
  .findById(req.body.idOfFactRequest)
  .exec(function(err, request){
    console.log("El id pasado es: " + req.body.idOfFactRequest);
    if (err) {
      sendJSONresponse(res, 404, err);
    }else{
      request.state ='closed';
      request.save(function(err, request){
        if (err) {
          sendJSONresponse(res, 404, err);
        } else {
          sendJSONresponse(res, 200, request);
        }
      });
    }
  });
}

// Function to cancel a request
module.exports.cancelRequest = function(req, res){
  Fact_Request
  .findById(req.body.idOfFactRequest)
  .exec(function(err, request){
    console.log("El id pasado es: " + req.body.idOfFactRequest);
    if (err) {
      sendJSONresponse(res, 404, err);
    }else{
      request.state ='canceled';
      request.save(function(err, request){
        if (err) {
          sendJSONresponse(res, 404, err);
        } else {
          sendJSONresponse(res, 200, request);
        }
      });
    }
  });
}
