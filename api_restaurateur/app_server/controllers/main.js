//controlador principal de la app
module.exports.load = function(req, res){
    res.render('index', {title: 'Dulcelandia', welcome_message: 'Ordenar los mejores dulces nunca había sido tan sencillo!'});
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

