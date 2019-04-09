//controlador principal de la app
var utils = require('../controllers/utils');
module.exports.load = function(req, res){
    res.render('index', {title: 'Resumen de estadísticas', welcome_message: 'El CMI con las estadísticas'});
   };

module.exports.contactUs = function(req, res){
    res.render('contact_us', {title: 'Dulcelandia', subtitle: 'Contáctenos',email: 'lsuarezg8811@gmail.com', telephone: '039-289-189', address: 'calle Isla de Fuerteventura, Albergue Inturjoven. Almería.'});
};

module.exports.administration = function(req, res){
    res.render('administration', {});
};

module.exports.addProduct = function(req, res){
    res.render('add_product', {});
};

// Processes stats
module.exports.processesStats = function(req, res){
    res.render('processes_stats', {title_of_perspective: 'Perspectiva de procesos', cant_pedidos:'Cantidad de pedidos: 50', productos_menos_vendidos:'Productos menos vendidos: Sopa de pollo, Milanesa'});
}

// Finances stats
module.exports.financesStats = function(req, res){
    utils.createBarChart();
    res.render('finances_stats', {title_of_perspective: 'Perspectiva de finanzas', costos:'Costos: 900', ingresos:'Ingresos: 1000', saldo:'Saldo: 100'});
}

// Staff stats
module.exports.staffStats = function(req, res){
    res.render('staff_stats', {title_of_perspective: 'Perspectiva de personal', cant_trabajadores:'Cantidad de trabajadores: 5', cant_quejas_reclamaciones:'Cantidad de quejas y reclamaciones: 3'});
}

// Clients stats
module.exports.clientsStats = function(req, res){
    res.render('clients_stats', {title_of_perspective: 'Perspectiva de clientes', cant_clientes:'Cantidad de clientes: 150'});
}


