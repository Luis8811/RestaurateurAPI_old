var mongoose = require( 'mongoose' );
// Definiendo los esquemas de Mongoose
var locationSchema = new mongoose.Schema({
    description: {type: String, required: true},
    price: {type: Number, "default": 10, min: 10},
    flavors: [String]  
}); //esquema del producto

mongoose.model('Location', locationSchema); // Para construir (compilar) el esquema locationSchema