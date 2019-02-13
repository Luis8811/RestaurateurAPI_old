//API routes: Alojará las rutas de la API
var express = require('express');
var router = express.Router();
// var ctrlProducts = require('../controllers/products');
var ctrlStaff = require('../controllers/staff');
var ctrlClients = require('../controllers/clients');
var ctrlProcesses = require('../controllers/processes');


// Products
//router.get('/products/:productid', ctrlProducts.readOneProduct);  // leer un producto
//router.get('/products', ctrlProducts.readProducts);  // leer todos los productos
//router.post('/products', ctrlProducts.createProduct); // crear un producto
//router.put('/products/:productid', ctrlProducts.updateProduct); // Actualiza un producto
//router.delete('/products/:productid', ctrlProducts.deleteProduct); // eliminar un producto


// Staff
router.get('/workers', ctrlStaff.readStaff); // leer todos los trabajadores


// Clients
router.get('/clients', ctrlClients.readClients); // read all the clients
router.get('/numberOfRegisteredClientsOnADay/:date', ctrlClients.readNumberOfRegisteredClientsOnADay); // read the number of the registered clients in a date
router.get('/factsRegisteredClients',ctrlClients.readAllFactsOfRegisteredClients); // read all the facts of the registered clients
router.get('/factsRegisteredClients/:date',ctrlClients.readAFactOfRegisteredClients); // read an specific fact from the collection fact_registered_clients

// Processes
router.get('/products', ctrlProcesses.readProducts); // read all the products
router.get('/countOfProducts', ctrlProcesses.countOfProducts); // read the count of products 

module.exports = router;
