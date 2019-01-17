// // Controlador de productos de la API
// var mongoose = require('mongoose');
// var Loc = mongoose.model('Dulcelandia'); //el modelo de la BD compilado en locations.js

// var sendJSONresponse = function(res, status, content) {
//   console.log(content);
//   res.status(status).json(content); // envía respuesta de contenido en objeto JSON
// };



// /* POST a new review, providing a locationid */
// /* /api/locations/:locationid/reviews */
// module.exports.reviewsCreate = function(req, res) {
//   if (req.params.locationid) {
//     Loc
//       .findById(req.params.locationid)
//       .select('reviews')
//       .exec(
//         function(err, location) {
//           if (err) {
//             sendJSONresponse(res, 400, err);
//           } else {
//             doAddReview(req, res, location);
//           }
//         }
//     );
//   } else {
//     sendJSONresponse(res, 404, {
//       "message": "Not found, locationid required"
//     });
//   }
// };


// var doAddReview = function(req, res, location) {
//   if (!location) {
//     sendJSONresponse(res, 404, "locationid not found");
//   } else {
//     location.reviews.push({
//       author: req.body.author,
//       rating: req.body.rating,
//       reviewText: req.body.reviewText
//     });
//     location.save(function(err, location) {
//       var thisReview;
//       if (err) {
//         sendJSONresponse(res, 400, err);
//       } else {
//         updateAverageRating(location._id);
//         thisReview = location.reviews[location.reviews.length - 1];
//         sendJSONresponse(res, 201, thisReview);
//       }
//     });
//   }
// };

// var updateAverageRating = function(locationid) {
//   console.log("Update rating average for", locationid);
//   Loc
//     .findById(locationid)
//     .select('reviews')
//     .exec(
//       function(err, location) {
//         if (!err) {
//           doSetAverageRating(location);
//         }
//       });
// };

// var doSetAverageRating = function(location) {
//   var i, reviewCount, ratingAverage, ratingTotal;
//   if (location.reviews && location.reviews.length > 0) {
//     reviewCount = location.reviews.length;
//     ratingTotal = 0;
//     for (i = 0; i < reviewCount; i++) {
//       ratingTotal = ratingTotal + location.reviews[i].rating;
//     }
//     ratingAverage = parseInt(ratingTotal / reviewCount, 10);
//     location.rating = ratingAverage;
//     location.save(function(err) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Average rating updated to", ratingAverage);
//       }
//     });
//   }
// };

// module.exports.reviewsUpdateOne = function(req, res) {
//   if (!req.params.locationid || !req.params.reviewid) {
//     sendJSONresponse(res, 404, {
//       "message": "Not found, locationid and reviewid are both required"
//     });
//     return;
//   }
//   Loc
//     .findById(req.params.locationid)
//     .select('reviews')
//     .exec(
//       function(err, location) {
//         var thisReview;
//         if (!location) {
//           sendJSONresponse(res, 404, {
//             "message": "locationid not found"
//           });
//           return;
//         } else if (err) {
//           sendJSONresponse(res, 400, err);
//           return;
//         }
//         if (location.reviews && location.reviews.length > 0) {
//           thisReview = location.reviews.id(req.params.reviewid);
//           if (!thisReview) {
//             sendJSONresponse(res, 404, {
//               "message": "reviewid not found"
//             });
//           } else {
//             thisReview.author = req.body.author;
//             thisReview.rating = req.body.rating;
//             thisReview.reviewText = req.body.reviewText;
//             location.save(function(err, location) {
//               if (err) {
//                 sendJSONresponse(res, 404, err);
//               } else {
//                 updateAverageRating(location._id);
//                 sendJSONresponse(res, 200, thisReview);
//               }
//             });
//           }
//         } else {
//           sendJSONresponse(res, 404, {
//             "message": "No review to update"
//           });
//         }
//       }
//   );
// };

// module.exports.reviewsReadOne = function(req, res) {
//   console.log("Getting single review");
//   if (req.params && req.params.locationid && req.params.reviewid) {
//     Loc
//       .findById(req.params.locationid)
//       .select('name reviews')
//       .exec(
//         function(err, location) {
//           console.log(location);
//           var response, review;
//           if (!location) {
//             sendJSONresponse(res, 404, {
//               "message": "locationid not found"
//             });
//             return;
//           } else if (err) {
//             sendJSONresponse(res, 400, err);
//             return;
//           }
//           if (location.reviews && location.reviews.length > 0) {
//             review = location.reviews.id(req.params.reviewid);
//             if (!review) {
//               sendJSONresponse(res, 404, {
//                 "message": "reviewid not found"
//               });
//             } else {
//               response = {
//                 location: {
//                   name: location.name,
//                   id: req.params.locationid
//                 },
//                 review: review
//               };
//               sendJSONresponse(res, 200, response);
//             }
//           } else {
//             sendJSONresponse(res, 404, {
//               "message": "No reviews found"
//             });
//           }
//         }
//     );
//   } else {
//     sendJSONresponse(res, 404, {
//       "message": "Not found, locationid and reviewid are both required"
//     });
//   }
// };

// // función para leer un producto
// module.exports.readOneProduct = async function(req, res){
//   if(req.params && req.params.productid){
//    Loc //modelo Mongoose
//    .findById(req.params.productid) //método de modelo Mongoose para hacer consulta a la BD por un ID específico
//    .exec(function(err, product) {
//     if (!product) {
//       sendJSONresponse(res, 404, {
//         "message": "productid not found"
//       });
//       return;
//     } else if (err) {
//       console.log(err);
//       sendJSONresponse(res, 404, err);
//       return;
//     }
//     console.log(product);
//     sendJSONresponse(res, 200, product);
//   });
//   }else{
//     console.log('No productid specified');
//     sendJSONresponse(res, 404, {
//       "message": "No productid in request"
//     });
//   }
// };


// // función para leer todos los productos
// module.exports.readProducts = async function(req, res){
//   Loc //modelo Mongoose
//    .find({})
//    .exec(function (err, products){
//     if(!products){
//       sendJSONresponse(res, 404, {"message" : "products not found"});
//     }else if(err){
//       sendJSONresponse(res, 404, err);
//     }else{
//       sendJSONresponse(res, 200, products);
//     }
//    });

// };

// // función para crear un producto
// module.exports.createProduct = async function(req, res){
//   Loc.create({
//     description: req.body.description,
//     price: req.body.price,
//     flavors: req.body.flavors
//   }, function(err, product) {
//     if (err) {
//       console.log(err);
//       sendJSONresponse(res, 400, err);
//     } else {
//       console.log(product);
//       sendJSONresponse(res, 201, product);
//     }
//   });
// };

// //función para eliminar un producto
// module.exports.deleteProduct = function(req, res) {
//   var productid = req.params.productid;
//   if (productid) {
//     Loc
//       .findByIdAndRemove(productid)
//       .exec(
//         function(err, product) {
//           if (err) {
//             console.log(err);
//             sendJSONresponse(res, 404, err);
//             return;
//           }
//           console.log("Product id " + productid + " deleted");
//           sendJSONresponse(res, 204, null);
//         }
//     );
//   } else {
//     sendJSONresponse(res, 404, {
//       "message": "No productid"
//     });
//   }
// };


// //función para actualizar un producto
// module.exports.updateProduct = function(req, res) {
//   if (!req.params.productid) {
//     sendJSONresponse(res, 404, {
//       "message": "Not found, productid is required"
//     });
//     return;
//   }
//   Loc
//     .findById(req.params.productid)
//     .select('-description')
//     .exec(
//       function(err, product) {
//         if (!product) {
//           sendJSONresponse(res, 404, {
//             "message": "productid not found"
//           });
//           return;
//         } else if (err) {
//           sendJSONresponse(res, 400, err);
//           return;
//         }
//         product.price = req.body.price;
//         product.flavors = req.body.flavors;
//         product.save(function(err, product) {
//           if (err) {
//             sendJSONresponse(res, 404, err);
//           } else {
//             sendJSONresponse(res, 200, product);
//           }
//         });
//       }
//   );
// };


// // app.delete('/api/locations/:locationid/reviews/:reviewid'
// module.exports.reviewsDeleteOne = function(req, res) {
//   if (!req.params.locationid || !req.params.reviewid) {
//     sendJSONresponse(res, 404, {
//       "message": "Not found, locationid and reviewid are both required"
//     });
//     return;
//   }
//   Loc
//     .findById(req.params.locationid)
//     .select('reviews')
//     .exec(
//       function(err, location) {
//         if (!location) {
//           sendJSONresponse(res, 404, {
//             "message": "locationid not found"
//           });
//           return;
//         } else if (err) {
//           sendJSONresponse(res, 400, err);
//           return;
//         }
//         if (location.reviews && location.reviews.length > 0) {
//           if (!location.reviews.id(req.params.reviewid)) {
//             sendJSONresponse(res, 404, {
//               "message": "reviewid not found"
//             });
//           } else {
//             location.reviews.id(req.params.reviewid).remove();
//             location.save(function(err) {
//               if (err) {
//                 sendJSONresponse(res, 404, err);
//               } else {
//                 updateAverageRating(location._id);
//                 sendJSONresponse(res, 204, null);
//               }
//             });
//           }
//         } else {
//           sendJSONresponse(res, 404, {
//             "message": "No review to delete"
//           });
//         }
//       }
//   );
// };
