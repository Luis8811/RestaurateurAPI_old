var mongoose = require('mongoose');
var Fact_finance  = mongoose.model('Fact_finance');

var sendJSONresponse = function(res, status, content) {
    console.log(content);
    res.status(status).json(content); 
  };

// Function to read all the finances
module.exports.readFinances = async function(req, res){
    Fact_finance //Mongoose model
     .find({})
     .exec(function (err, finances){
      if(!finances){
        sendJSONresponse(res, 404, {"message" : "finances not found"});
      }else if(err){
        sendJSONresponse(res, 404, err);
      }else{
        sendJSONresponse(res, 200, finances);
      }
     });
  
  };