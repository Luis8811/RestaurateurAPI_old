// controlador de los productos ofertados

var request = require('request'); // uso del request para poder hacer llamadas a la API

// definiendo el servidor local para entorno de pruebas
var apiOptions = {
    server : "http://localhost:3000"
  };

  // Mostrar los productos
module.exports.products = function(req, res){
   var requestOption, path;
   path = '/api/products' ;
   requestOption = {
         url : apiOptions.server + path,
         method : 'GET',
         json : {},
     };

   request(requestOption, function(err,response,body){
     var data;
     data = body;
     renderProductsPage(req, res, data);
   });
 
};

// Función para agregar un producto
module.exports.createProduct = function(req, res){
  var requestOption, path, postData;
  path = '/api/products' ;
  postData ={
    description: req.body.description,
    price: parseFloat(req.body.price),
    flavors: req.body.flavors.split(" ")
  };
  console.log(req.params.description);
  requestOption = {
        url : apiOptions.server + path,
        method:'POST',
        json: postData
    };

  request(requestOption, function(err,response,body){
    var data;
    data = body;
    if(response.statusCode === 201){
      res.redirect('/products');
    }else{
       Console.log("An error has occured");
    }
  });

};



// Eliminar un producto
module.exports.deleteProduct = function(req, res){
  var requestOption, path;
  path = '/api/products' ;
  var productid ='/' + req.params.productid;
  var myproductid = req.params.productid
  requestOption = {
        url : apiOptions.server + path + productid,
        method : 'DELETE',
        json : {},
        qs:{ myproductid }
    };

  request(requestOption, function(err,response,body){
    var data;
    data = body;
    if(response.statusCode === 204){
      res.redirect('/products');
    }else{
       Console.log("An error has occured");
    }
  });

};

module.exports.product_detail = function(req, res){
    res.render('product_detail',{description:'', price:'', flavors:[]});
};

// función para renderizar la página con de los productos con los valores devueltos por la API
var renderProductsPage = function(req, res, responseBody){
    var message;
    
    if (!(responseBody instanceof Array)) {
      message = "API lookup error";
      responseBody = [];
    } else {
      if (!responseBody.length) {
        message = "No products found";
      }
    }
    res.render('products', {
      products: responseBody
    });
  };