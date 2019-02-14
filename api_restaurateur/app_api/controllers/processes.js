var mongoose = require('mongoose');
var Product = mongoose.model('Product');

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
  //FIXME Arreglar para que devuelva todas las solicitudes o pedidos
  module.exports.readAllRequests =  function(req, res){
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

 //Function to read an specific request
 //FIXME Arreglar para que devuelva una solicitud o pedido específica
 module.exports.readARequest =  function(req, res){
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