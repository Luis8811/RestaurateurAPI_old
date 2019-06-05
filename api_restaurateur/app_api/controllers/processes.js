var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Request = mongoose.model('Request');
var Fact_Request = mongoose.model('Fact_request');
var Fact_Sold_Product = mongoose.model('Fact_sold_product');
var Fact_ComplaintsAndClaims = mongoose.model('Fact_complaints_and_claims');
var ComplaintsAndClaims = mongoose.model('ComplaintsAndClaims');
var utils = require('./utils'); 
// import moment from 'moment';
var moment = require('moment');
var finances = require('./finances');

// Function to send the response in an JSON object
var sendJSONresponse = function(res, status, content) {
  res.set('Access-Control-Allow-Origin', '*');  
  console.log(content);
  res.status(status).json(content); 
  };

// Function to update all the products from a closed request
var updateProductsFromClosedRequest = async function(requestId, res) {
  console.log('Measuring time of updateProductsFromClosedRequest ->:');
  console.time('Time of updateProductsFromClosedRequest: ');
   await Request
   .findById(requestId)
   .exec(function (err, requestFounded) {
    if (err) 
    {
      console.log('An error occurred at updateProductsFromClosedRequest.');
     //  throw new Error('An error occurred at updateProductsFromClosedRequest');
     sendJSONresponse(res, 500, err);
    } else {
      console.log('Array of products related to requestId: ' + requestId);
      console.log(requestFounded.products);
      // Get the date
       Fact_Request
      .find({request_id: requestId})
      .exec(function(err, factRequestFounded){
        if (err) {
          // throw new Error('An error occurred at getting the date of the request!');
          console.log('An error occurred at getting the date of the request!');
          sendJSONresponse(res, 500, err);
        } else {
          if (factRequestFounded.length != 1) {
           // throw new Error('Zero or more than one request_id related to FactRequest. Error at getting the date of the request.');
           console.log('Zero or more than one request_id related to FactRequest. Error at getting the date of the request.');
           sendJSONresponse(res, 500, 'Zero or more than one request_id related to FactRequest. Error at getting the date of the request.');
          } else {
            const date = factRequestFounded[0].date;
            const products = requestFounded.products;
            let i = 0;
            for (i = 0; i < products.length; i++){
              addSoldProduct(date, products[i]);
            }
            finances.updateFinances(date, products, requestId, res);
          }
        }
      });
      
      
    }
  });
  
  console.timeEnd('Time of updateProductsFromClosedRequest: ');
} 





/*
// Function to get the date when a request was maked
var getDateOfRequest = async function(requestId) {
  let result = '';
  console.time('Time of method getDateOfRequest ->: ');
  await Fact_Request
  .find({request_id: requestId})
  .exec(function(err, factRequestFounded){
    if (err) {
      throw new Error('An error occurred at getDateOfRequest');
    } else {
      if (factRequestFounded.length != 1) {
       throw new Error('Zero or more than one request_id related to FactRequest. Error at getDateOfRequest');
      } else {
        result = factRequestFounded[0].date;
      }
    }
  });
  console.timeEnd('Time of method getDateOfRequest ->: ');
  return result;
} */

// Function to set the state to close in the request specified
var updateStateToCloseInRequest = async function(requestId, res) {
  Request
  .findById(requestId)
  .exec(function(err, requestFounded){
    if (err){
      // throw new Error('An error occurred at updateStateToCloseInRequest');
      sendJSONresponse(res, 500, err);
    } else {
      requestFounded.state='closed';
      requestFounded.save();
      sendJSONresponse(res, 200, requestFounded);
    }
  });
}

// Function to set the state to close in the FactRequest with request_id specified 
 module.exports.updateStateToCloseInFactRequest = async function(requestId, res) {
   console.log('Method: updateStateToCloseInFactRequest --> param requestId: ' + requestId);
  Fact_Request
  .find({request_id: requestId})
  .exec(function(err, factsFounded){
    if (err){
      // throw new Error('An error occurred at updateStateToCloseInFactRequest');
      sendJSONresponse(res, 500, err);
    } else {
      if (factsFounded.length != 1){
       // throw new Error('Zero or more than one facts associated to the same request_id in updateStateToCloseInFactRequest');
       sendJSONresponse(res, 500, 'Zero or more than one facts associated to the same request_id in updateStateToCloseInFactRequest');
      } else {
        factsFounded[0].state = 'closed';
        factsFounded[0].save();
        // this.updateStateToCloseInRequest(requestId);
       updateStateToCloseInRequest(requestId, res);
        console.log('End of method: updateStateToCloseInFactRequest-->');
      }
    }
  });
}

// Function to add a sold product
var addSoldProduct = async function(date, productId) {
  Fact_Sold_Product
  .find({date: date, product_id: productId })
  .exec(function(err, factSoldProductFounded){
    if (err) {
      throw new Error('An error occurred at addSoldProduct');
    } else {
      if (factSoldProductFounded.length > 1) {
        throw new Error('More than one product_id and date pair founded. Error at addSoldProduct');
      } else {
        if (factSoldProductFounded.length == 0) {
          createFactSoldProduct(date, productId);
        }else{
          factSoldProductFounded[0].count += 1;
          factSoldProductFounded[0].save();
        }
      }
    }
  });
}

// Function to create a new fact of sold product
var createFactSoldProduct = async function(dateP, productId){
  console.log('Method createFactSoldProduct -> Param date: ' + dateP + ' Param productId: ' + productId);
  Fact_Sold_Product.create({
    date: dateP,
    product_id: productId,
    count: 1
  }, function(err, factCreated){
    if (err){
      throw new Error('An error occurred at createFactSoldProduct');
    } else {
      console.log('A new fact of sold product was created.');
      console.log(factCreated);
    }
  });
}



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
    description: req.body.description,
    state: 'open'
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
        request_id: requestCreated._id,
        state: 'open'
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

// Function to read all the data of fact requests including clients and requests
module.exports.readAllDataOfOpenedFactRequests =  function(req, res){
  Fact_Request
  .find({state:"open"})
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

 // FIXME Arreglar para que sea consistente
//  Function to close a request
module.exports.closeRequest = async function(req, res){
 updateProductsFromClosedRequest(req.body.request_id, res);
  // await updateStateToCloseInRequest(req.body.request_id);
 // await updateStateToCloseInFactRequest(req.body.request_id);
  
  /*
  Request
   .findById(req.body.request_id)
   .exec(function(err, request) {
      if (err) {
        sendJSONresponse(res, 500, err);
      } else {
        sendJSONresponse(res, 200, request);
      }
   }); 
   */
}

// Function to cancel a request
module.exports.cancelRequest = function(req, res){
  Fact_Request
  .find({request_id:req.body.request_id})
  .exec(function(err, request){
    console.log("El id pasado es: " + req.body.request_id);
    if (err) {
      sendJSONresponse(res, 404, err);
    }else{
      request[0].state ='canceled';
      request[0].save(function(err, request){
        if (err) {
          sendJSONresponse(res, 404, err);
        } else {
          sendJSONresponse(res, 200, request);
        }
      });
    }
  });
}

//  Function to add a new type of complaints to a request
module.exports.addNewTypeOfComplaintsToRequest = function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods','GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH');
  let currentDateTime = moment();
  let dateOfRequest = currentDateTime.format('YYYY-MM-DD');
  let timeOfRequest = currentDateTime.format('HH:mm:ss');
  let objectOfResponse = null;
  ComplaintsAndClaims.create({
    category: req.body.category,
    type: req.body.type,
    text: req.body.text
  },
    function(err, complaintsAndClaimsCreated){
      if (err) {
        console.log('An error occurred at creation of a new type of complaints/claims');
        sendJSONresponse(res, 500, err);
      } else {
        Fact_ComplaintsAndClaims.create({
          date: dateOfRequest,
          time: timeOfRequest,
          worker_id: req.body.worker_id,
          complaints_and_claims_id: complaintsAndClaimsCreated._id,
          request_id: req.body.request_id
        }, function(errFact, factCreated){
          if (errFact) {
            console.log('An error occurred at creation of a new type of complaints/claims');
            sendJSONresponse(res, 500, errFact);
          } else { 
            console.log('A new fact about complaints/claims was created');
            objectOfResponse = factCreated;
            sendJSONresponse(res, 201, objectOfResponse);
          }
        });
      }
  });
 
}

// Function to add a complaint/claim to a request
module.exports.addComplaintToRequest = function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods','GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH');
  let currentDateTime = moment();
  let dateOfRequest = currentDateTime.format('YYYY-MM-DD');
  let timeOfRequest = currentDateTime.format('HH:mm:ss');
  Fact_ComplaintsAndClaims.create({
    date: dateOfRequest,
    time: timeOfRequest,
    worker_id: req.body.worker_id, /* // FIXME eliminar el campo worker_id del modelo de la colección Fact_Complaints_and_Claims, estoy inyectando uno por defecto */
    complaints_and_claims_id: req.body.complaints_and_claims_id,
    request_id: req.body.request_id   
  }, function( err, complaintsAndClaimsCreated){
    if (err) {
      console.log('An error had occurred at creation of fact request');
      sendJSONresponse(res, 404, err);
    } else { 
      console.log('A new fact of complaints/claims was created');
      sendJSONresponse(res, 201, complaintsAndClaimsCreated);
    }
  });
}
