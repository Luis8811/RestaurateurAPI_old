//controlador principal de la app
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

module.exports.processesStats = function(req, res){
    res.render('processes_stats', {title_of_perspective: 'Perspectiva de procesos', cant_pedidos:'Cantidad de pedidos: 50', productos_menos_vendidos:'Productos menos vendidos: Sopa de pollo, Milanesa'});
}

