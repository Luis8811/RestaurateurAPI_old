//controlador de los clientes
module.exports.clients = function(req, res){
 res.render('clients', {cantidad: '50'});
};

module.exports.addClient = function(req, res){
 res.render('addClient', {cliente: 'Luis Manuel Suárez González'});
};