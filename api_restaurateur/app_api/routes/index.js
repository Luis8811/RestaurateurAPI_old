//API routes: Alojará las rutas de la API
var express = require('express');
var router = express.Router();
// var ctrlProducts = require('../controllers/products');
var ctrlStaff = require('../controllers/staff');
var ctrlClients = require('../controllers/clients');
var ctrlProcesses = require('../controllers/processes');
var ctrlFinances = require('../controllers/finances');


// Finances
router.get('/finances', ctrlFinances.readFinances); // read all the finances
router.post('/financesInDateRange',ctrlFinances.readFinancesInDateRange); // get finances in a period of time
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
router.post('/count_complaintsAndClaimsInADateRange',ctrlStaff.countOfComplaintsAndClaimsInAPeriod); // returns the count of complaints and claims in a period
router.post('/complaintsAndClaimsOfAWorker',ctrlStaff.complaintsAndClaimsOfAWorker); // read all the facts of complaints and claims of a worker
router.post('/countOfComplaintsAndClaimsOfAWorkerInADateRange',ctrlStaff.countOfComplaintsAndClaimsInAPeriodToAWorker); // returns the count of complaints and claims in a period to a worker

// Clients



  /*
  app.get('/clients', function(req, res, next) {
    // Handle the get for this route
  });*/

router.get('/clients', ctrlClients.readClients); // read all the clients
router.get('/numberOfRegisteredClientsOnADay/:date', ctrlClients.readNumberOfRegisteredClientsOnADay); // read the number of the registered clients in a date
router.get('/factsRegisteredClients',ctrlClients.readAllFactsOfRegisteredClients); // read all the facts of the registered clients
router.get('/factsRegisteredClients/:date',ctrlClients.readAFactOfRegisteredClients); // read an specific fact from the collection fact_registered_clients
router.post('/numberOfRegisteredClientsInAPeriod', ctrlClients.readNumberOfRegisteredClientsInAPeriod); // read the number of the clients registered in a period
router.post('/createClient', ctrlClients.createClient); // Create a new client
router.post('/findClientByEmail', ctrlClients.findClientByEmail); // Finds a client


//FIXME Me falta poner los nombres de los productos y la fecha de los pedidos pero el resto de los datos están OK
router.post('/requestsOfClient/',ctrlClients.readRequestsOfClient); // read all the requests of a client

// Processes
router.get('/products', ctrlProcesses.readProducts); // read all the products
router.post('/products', ctrlProcesses.createProduct); // create a product
router.get('/countOfProducts', ctrlProcesses.countOfProducts); // read the count of products 
router.get('/requests', ctrlProcesses.readAllRequests); // read all the requests
router.get('/requests/:requestId', ctrlProcesses.readARequest); // read an specific request
router.get('/facts_requests', ctrlProcesses.readAllFactsOfRequests); // read all facts of the requests
router.get('/facts_requests/:requestId', ctrlProcesses.readAFactRequest); // read an specific fact of request
router.get('/facts_sold_products',ctrlProcesses.readFactsOfSoldProducts); // read all the facts of sold products
router.get('/facts_sold_products/:factId',ctrlProcesses.readAFactOfSoldProducts); // read an specific fact of sold products
router.post('/requests_in_date_range', ctrlProcesses.readAllFactsOfRequestsInADateRange); // read all the facts of requests in a date range
router.post('/count_requests_in_date_range',ctrlProcesses.readCountOfFactsOfRequestsInADateRange); // counts the number of the facts of requests in a date range
router.post('/countServedClientsInDateRange',ctrlProcesses.countServedClientsInAperiod); // count the number of served clients in a period
router.post('/moreSoldProductsInDateRange',ctrlProcesses.moreSoldProducts); // obtiene los productos más vendidos en un período
router.post('/lessSoldProductsInDateRange', ctrlProcesses.lessSoldProducts); // obtiene los prouctos menos vendidos en un período
router.post('/newRequest', ctrlProcesses.createRequest); // creates a new request
module.exports = router;
