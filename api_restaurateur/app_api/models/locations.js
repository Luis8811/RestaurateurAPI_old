var mongoose = require( 'mongoose' );
/* // Definiendo los esquemas de Mongoose
var locationSchema = new mongoose.Schema({
    description: {type: String},
    price: {type: Number},
    flavors: [String]  
}); //esquema del producto

mongoose.model('Dulcelandia', locationSchema); // Para construir (compilar) el esquema locationSchema */
// Schema of the collection of clients
var clientSchema = new mongoose.Schema({
    name: {type: String, required: true, maxlength: 30},
    sex: {type: String, required: true, maxlength: 1}, 
    birthdate: {type: Date, required: true},
    registration_date: {type: Date, required: true}
});

//Schema of the collection of products
var productSchema = new mongoose.Schema({
    name: {type: String, required: true, maxlength: 30},
    price: {type: Number, required: true, default:0}, 
    description: {type: String, required: true, maxlength: 50}
});

//Schema of the collection of workers
var workerSchema = new mongoose.Schema({
    name: {type: String, required: true, maxlength: 30},
    sex: {type: String, required: true, maxlength: 1}, 
    identification: {type: String, required: true, maxlength: 20}
});

//Schemas of the collections of facts 
var factNewClientsSchema = new mongoose.Schema({
    date: {type: Date, required: true, unique: true},
    count: {type: Number, required: true, min: 0, default: 0}
});



mongoose.model('Client', clientSchema);  //To compile schema clientSchema 
mongoose.model('Worker', workerSchema);
mongoose.model('Product', productSchema);
mongoose.model('Fact_new_client', factNewClientsSchema);