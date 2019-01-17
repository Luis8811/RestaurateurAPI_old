var mongoose = require( 'mongoose' );
// Definiendo los esquemas de Mongoose
var locationSchema = new mongoose.Schema({
    description: {type: String},
    price: {type: Number},
    flavors: [String]  
}); //esquema del producto

mongoose.model('Dulcelandia', locationSchema); // Para construir (compilar) el esquema locationSchema