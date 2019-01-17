//API routes: Alojará las rutas de la API
var express = require('express');
var router = express.Router();
var ctrlProducts = require('../controllers/products');

// Products
router.get('/products/:productid', ctrlProducts.readOneProduct);  // leer un producto
router.get('/products', ctrlProducts.readProducts);  // leer todos los productos
router.post('/products', ctrlProducts.createProduct); // crear un producto
router.put('/products/:productid', ctrlProducts.updateProduct); // Actualiza un producto
router.delete('/products/:productid', ctrlProducts.deleteProduct); // eliminar un producto

module.exports = router;
