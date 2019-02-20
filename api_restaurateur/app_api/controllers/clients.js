var mongoose = require('mongoose');
var Client = mongoose.model('Client');
var Fact_Registered_Clients = mongoose.model('Fact_registered_client');
var Request = mongoose.model('Request');
var Fact_Request = mongoose.model('Fact_request');
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

// Function to read all the facts of the collection fact_registered_clients
module.exports.readAllFactsOfRegisteredClients = async function(req, res){
  Fact_Registered_Clients
  .find({})
  .exec(function (err, facts){
    if(!facts){
      sendJSONresponse(res, 404, {"message" : "Facts not found"});
    }else if(err){
      sendJSONresponse(res, 404, err);
    }else{
      sendJSONresponse(res, 200, facts);
    }
   });
};

// Function to read an specific fact from the collection fact_registered_clients
module.exports.readAFactOfRegisteredClients =  function(req, res){
  Fact_Registered_Clients
  .find({date: req.params.date})
  .exec(function (err, fact){
    if(!fact){
      sendJSONresponse(res, 404, 'Check the format of the URL. No clients were registered in the date provided.');
    }else if(err){
      sendJSONresponse(res, 500, 'An error have ocurred. Please try connect again later');
    }else{
      sendJSONresponse(res, 200, fact);
    }
   });
};


// Function to read the number of registered clients on a day
module.exports.readNumberOfRegisteredClientsOnADay = function(req, res){
  Fact_Registered_Clients //Mongoose model
   .find({date: req.params.date}, {_id:0, date:0, registeredClients:0})
   .exec(function (err, count){
     if(err){
       sendJSONresponse(res, 404, 'Check the format of the URL. No clients were registered in the date provided.');
     }else{
       sendJSONresponse(res, 200, count);
       console.log("Date: " + req.params.date);
     }
   });
};

// Function to read the number of registered clients on a day
//FIXME Arreglar para que devuelva la cantidad de clientes registrados en un período
module.exports.readNumberOfRegisteredClientsInAPeriod = function(req, res){
  Fact_Registered_Clients //Mongoose model
   .find({date: req.params.date}, {_id:0, date:0, registeredClients:0})
   .exec(function (err, count){
     if(err){
       sendJSONresponse(res, 404, 'Check the format of the URL. No clients were registered in the date provided.');
     }else{
       sendJSONresponse(res, 200, count);
       console.log("Date: " + req.params.date);
     }
   });
};

// Function to read all the requests of a client
//FIXME Devuelve los pedidos de un cliente, debo ver cómo hago con algún patrón o algo para poner los nombres de los productos
module.exports.readRequestsOfClient = async function(req, res){
  var myObject = new mongoose.Types.ObjectId(req.body.client_id);
  Fact_Request //Mongoose model
   .find({client_id: myObject}, {_id:0, date:0, time:0, client_id:0})
   .exec(function (err, requests){
     if(err){
       sendJSONresponse(res, 404, 'An error happened.');
       Console.log("client_id: " + req.body.client_id);
     }else{
       var arrayOfObjectId = new Array();
       var index = 0;
       for(index = 0; index < requests.length; index++){
         arrayOfObjectId[index] = requests[index].request_id;
         console.log("item: " + arrayOfObjectId[index]);
       }
       Request
       .find({_id: {$in: arrayOfObjectId}})
       .exec(function (err2, r2){
         if(err2){
          sendJSONresponse(res, 404, 'An error happened when trying access to requests.');
         }else{
           sendJSONresponse(res, 201, r2);
         }
       });
       //sendJSONresponse(res, 201, requests);
     }
   });
};


