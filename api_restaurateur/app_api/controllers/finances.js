var mongoose = require('mongoose');
var Fact_finance  = mongoose.model('Fact_finance');
var utils = require('./utils'); 

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

  // Function to get all the finances in a period
module.exports.readFinancesInDateRange = async function(req, res){
  Fact_finance //Mongoose model
   .find({})
   .exec(function (err, finances){
    if(!finances){
      sendJSONresponse(res, 404, {"message" : "finances not found"});
    }else if(err){
      sendJSONresponse(res, 404, err);
    }else{
      var beginDate = req.body.beginDate;
      var endDate = req.body.endDate;
      var currentDate = "";
      var sumOfBalances = 0;
      var sumOfIncomes = 0;
      var sumOfCosts = 0;
      var index = 0;
      for(index = 0; index < finances.length; index++){
        currentDate = finances[index].date;
        if(utils.isDateInRange(beginDate, endDate,currentDate)){
          sumOfBalances += finances[index].balance;
          sumOfCosts += finances[index].cost;
          sumOfIncomes += finances[index].income;
        }
      }
      // Creating an object result
      var financesInPeriod = new Object();
      financesInPeriod.balance = sumOfBalances;
      financesInPeriod.cost = sumOfCosts;
      financesInPeriod.income = sumOfIncomes;
      sendJSONresponse(res, 201, financesInPeriod);
    }
   });
};

