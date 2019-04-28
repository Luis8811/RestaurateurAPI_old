var mongoose = require('mongoose');
var Client = mongoose.model('Client');
var Fact_Registered_Clients = mongoose.model('Fact_registered_client');
var Request = mongoose.model('Request');
var Fact_Request = mongoose.model('Fact_request');
var utils = require('./utils'); 
// Function to send the response in an JSON object
var sendJSONresponse = function(res, status, content) {
    console.log(content);
    res.status(status).json(content); 
  };

// Function to read all the clients
module.exports.readClients = async function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
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

// Function to read the number of registered clients in a period
module.exports.readNumberOfRegisteredClientsInAPeriod = function(req, res){
  Fact_Registered_Clients //Mongoose model
   .find({})
   .exec(function (err, facts){
     if(err){
       sendJSONresponse(res, 404, 'Check the format of the URL. No clients were registered in the date provided.');
     }else{
       var beginDate = req.body.beginDate;
       var endDate = req.body.endDate;
       var currentDate = "";
       var countOfRegisteredClientsInPeriod = 0;
       var index = 0;
       for(index = 0; index < facts.length; index++){
        currentDate = facts[index].date; 
        if(utils.isDateInRange(beginDate, endDate, currentDate)){
           countOfRegisteredClientsInPeriod += parseInt(facts[index].count);
         }
       }
       sendJSONresponse(res, 201, countOfRegisteredClientsInPeriod);
     }
   });
};

// Function to read all the requests of a client
//FIXME Devuelve los pedidos de un cliente, debo ver cómo hago con algún patrón o algo para poner los nombres de los productos pedidos, la fecha del pedido, etc.
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

// Function to create a new client
module.exports.createClient = async function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods','GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH');
  Client
  .find({name: req.body.name, sex: req.body.sex, email: req.body.email})
  .exec(function(err, clientsFounded){
    if(err){
      sendJSONresponse(res, 404, 'An error happened.'); 
    }else{
      if(clientsFounded.length > 0){
       sendJSONresponse(res,409,'Client already exists');
      }else{
        Client.create({
          name: req.body.name,
          sex: req.body.sex,
          birthdate: req.body.birthdate,
          telephone: req.body.telephone,
          email: req.body.email,
          registration_date: req.body.registration_date
        }, function(errClient, clientCreated) {
          if (errClient) {
            console.log("API Message: An error ocurred at client registration process.");
            sendJSONresponse(res, 400, errClient);
          } else {
            Fact_Registered_Clients
            .find({date: req.body.registration_date})
            .exec(function(errFactRegisteredClient, facts){
              if(errFactRegisteredClient){
                console.log("API Message: An error ocurred at client registration process. Problem at accessing to facts.");
                sendJSONresponse(res, 500, errFactRegisteredClient);
              }else{
                if(facts.length>0){
                  // Actualizando el hecho para modificar la cantidad de clientes registrados ese día. Asumo que solamente hay un hecho con esa fecha
                   facts[0].count +=1;
                   facts[0].registeredClients.push(clientCreated._id);
                   facts[0].save(function(errUpdatingFact, factUpdated){
                     if(errUpdatingFact){
                      console.log("API Message: An error occurred at updating facts.");
                      sendJSONresponse(res, 500, errUpdatingFact);
                     }else{
                      console.log("API Message: A new client was inserted.");
                      sendJSONresponse(res, 201, clientCreated);
                     }
                   });
                }else{
                  // Creando un nuevo hecho para registrar que he creado un nuevo cliente
                  Fact_Registered_Clients.create({
                    date: req.body.registration_date,
                    count: 1,
                    registeredClients: [clientCreated._id]
                  },function(errCreatingFact, factCreated){
                    if(errCreatingFact){
                      console.log("API Message: An error occurred at recording fact.");
                      sendJSONresponse(res, 500, errCreatingFact);
                    }else{
                      console.log("API Message: A new client was inserted.");
                      sendJSONresponse(res, 201, clientCreated);
                    }
                  });
                }
              }
            });
          }
        });
      }
    }
  });
}

// Returns the clients with the specified email
module.exports.findClientByEmail = async function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods','GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH');
  Client
  .find({email: req.body.email})
  .exec(function(err, clientsFounded){
    if(err){
      sendJSONresponse(res, 404, 'An error happened.'); 
    }else{
       sendJSONresponse(res,200, clientsFounded);
    }
  });
}
