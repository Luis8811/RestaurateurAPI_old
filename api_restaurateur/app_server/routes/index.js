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
module.exports = router;
