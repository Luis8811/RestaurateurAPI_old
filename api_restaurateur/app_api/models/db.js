var mongoose = require( 'mongoose' );
var dbURI = 'mongodb://localhost/restaurateur'; // Mongoose connection
mongoose.connect(dbURI);

//Monitorización de la conexión a la BD con eventos Mongoose
mongoose.connection.on('connected', function(){
 console.log('Mongoose connected to ' + dbURI); // Monitorizar una conexión exitosa
});

mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error: ' + err); // Chequea un error de conexión
});

mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected'); // Chequea un evento de desconexión
});

var readLine = require ("readline");
if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });
    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });
}

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

//Para recuperar los modelos 
require('./locations');

