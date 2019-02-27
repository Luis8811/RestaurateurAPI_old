var express = require('express');
var router = express.Router();

var productsController = require('../controllers/products');
var mainController = require('../controllers/main');

router.get('/', mainController.load);
router.get('/products', productsController.products);
router.get('/administration',mainController.administration);
router.get('/contact_us', mainController.contactUs); 
router.get('/add_product', mainController.addProduct);
router.get('/deleteProduct/:productid', productsController.deleteProduct);
router.post('/add_product/', productsController.createProduct);

// Stats from perspectives
router.get('/processes_stats', mainController.processesStats);
router.get('/finances_stats', mainController.financesStats);
router.get('/staff_stats', mainController.staffStats);
router.get('/clients_stats', mainController.clientsStats);
module.exports = router;
