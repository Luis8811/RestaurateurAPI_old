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
router.get('/complaints_and_claims', ctrlStaff.readAllComplaintsAndClaims); // read all complaints and claims
router.get('/facts_complaints_and_claims', ctrlStaff.readAllFactsOfComplaintsAndClaims); // read all facts of complaints and claims
//FIXME Arreglar para que devuelva la cantidad de quejas y reclamaciones en un período. Creo que debo usar parámetros de fecha de inicio y fin
router.get('/sss',ctrlStaff.countOfComplaintsAndClaimsInAPeriod); // returns the count of complaints and claims in a period
//FIXME Arreglar para que devuelva la cantidad de quejas y reclamaciones en un período a un trabajador. Creo que debo usar parámetros de fecha de inicio y fin y trabajador
router.get('/ssaaass',ctrlStaff.countOfComplaintsAndClaimsInAPeriodToAWorker); // returns the count of complaints and claims in a period to a worker

// Clients
router.get('/clients', ctrlClients.readClients); // read all the clients
router.get('/numberOfRegisteredClientsOnADay/:date', ctrlClients.readNumberOfRegisteredClientsOnADay); // read the number of the registered clients in a date
router.get('/factsRegisteredClients',ctrlClients.readAllFactsOfRegisteredClients); // read all the facts of the registered clients
router.get('/factsRegisteredClients/:date',ctrlClients.readAFactOfRegisteredClients); // read an specific fact from the collection fact_registered_clients

//FIXME Arreglar, creo que en esta ruta debo usar parámetros, debo de devolver todos los clientes registrados en un rango de fechas
router.get('/numberOfRegisteredClientsInAPeriod', ctrlClients.readNumberOfRegisteredClientsInAPeriod); // read the number of the clients registered in a period

//FIXME Me falta poner los nombres de los productos y la fecha de los pedidos pero el resto de los datos están OK
router.post('/requestsOfClient/',ctrlClients.readRequestsOfClient); // read all the requests of a client

// Processes
router.get('/products', ctrlProcesses.readProducts); // read all the products
router.get('/countOfProducts', ctrlProcesses.countOfProducts); // read the count of products 
router.get('/requests', ctrlProcesses.readAllRequests); // read all the requests
router.get('/requests/:requestId', ctrlProcesses.readARequest); // read an specific request
router.get('/facts_requests', ctrlProcesses.readAllFactsOfRequests); // read all facts of the requests
router.get('/facts_requests/:requestId', ctrlProcesses.readAFactRequest); // read an specific fact of request
router.get('/facts_sold_products',ctrlProcesses.readFactsOfSoldProducts); // read all the facts of sold products
router.get('/facts_sold_products/:factId',ctrlProcesses.readAFactOfSoldProducts); // read an specific fact of sold products
router.post('/requests_in_date_range', ctrlProcesses.readAllFactsOfRequestsInADateRange); // read all the facts of requests in a date range
router.post('/count_requests_in_date_range',ctrlProcesses.readCountOfFactsOfRequestsInADateRange); // counts the number of the facts of requests in a date range
module.exports = router;
