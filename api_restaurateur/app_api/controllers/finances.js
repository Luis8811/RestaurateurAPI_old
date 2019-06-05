var mongoose = require('mongoose');
var Fact_finance  = mongoose.model('Fact_finance');
var utils = require('./utils'); 
var Product = mongoose.model('Product');
var processes = require('./processes');

var sendJSONresponse = function(res, status, content) {
    console.log(content);
    res.status(status).json(content); 
  };

// Update finances
module.exports.updateFinancesAtCloseRequest = async function(arrayOfProductsIds, date, requestId, res){
   await Product.find({_id: {$in: arrayOfProductsIds}})
  .exec(function(err, products){
    if (err){
      throw new Error('An error occurred at getSumOfPricesOfSelectedProducts');
    }else {
      let sum = 0;
      let costs = 0;
      for (let i = 0; i < products.length; i++){
        console.log('Product: ' + products[i]._id + ' Price: ' + products[i].price + ' Cost: ' + products[i].cost);
        sum += products[i].price;
        costs += products[i].cost;
      }
      console.log('Sum of prices: ' + sum);
      console.log('Sum of Costs:' + costs);   
      Fact_finance
  .find({date: date})
  .exec(function(err, factFinancesFounded){
    if (err) {
      throw new Error('An error occurred at updateFinances with date:' + date + ' -> income: ' + income + ' -> cost: ' + cost);
    } else {
      if (factFinancesFounded.length > 1) {
        throw new Error('More than 1 row was founded at date given in updateFinances');
      } else {
        if (factFinancesFounded.length == 0) {
         createFactFinance(date, sum, costs, res, requestId);
        } else {
          let currentIncome = factFinancesFounded[0].income;
          let currentCost = factFinancesFounded[0].cost;
          currentIncome += sum;
          currentCost += costs;
          let newBalance = currentIncome - currentCost;
          factFinancesFounded[0].income = currentIncome;
          factFinancesFounded[0].cost = currentCost;
          factFinancesFounded[0].balance = newBalance;
          factFinancesFounded[0].save();
          processes.updateStateToCloseInFactRequest(requestId, res);
        }
      }
    }
  });

    }
  });
}




// FIXME Function to get the sum of prices of the specified products
module.exports.sumOfPricesAndCostsOfProductsAndCreateNewFactFinance =  async function(arrayOfProductsIds){
  console.log('Method getSumOfPricesOfProducts ->')
  let sum = 0;
  let i = 0; 
  for (i = 0; i < arrayOfProductsIds.length; i++) {
   await Product
  .findById(arrayOfProductsIds[i])
  .exec(function(err, productFound){
    if (err){
     throw new Error('An error occurred at getSumOfPricesOfProducts');
    }else {
      console.log('Product price ' +' : ' + productFound.price);
     sum += productFound.price;
    }
  });
   
  }
  const result =  sum;
  console.log('Sum of prices of products: ' + result);
  return result; 
}

// Function to get the sum of costs of the specified products
module.exports.getSumOfCostsOfProducts = async function(arrayOfProductsIds){
  let sum = 0;
  let i = 0; 
  for (i = 0; i < arrayOfProductsIds.length; i++) {
    await Product
  .findById(arrayOfProductsIds[i])
  .exec(function(err, productFound){
    if (err){
     throw new Error('An error occurred at getSumOfCostsOfProducts');
    }else {
     sum += productFound.cost;
    }
  });
  }
  return sum; 
}

  // Function to update the finances in a date
module.exports.updateFinances = async function(date, products, requestId, res) {
  console.log('Method updateFinances -> Param date: ' + date + ' Param products: ' + products);
  await this.updateFinancesAtCloseRequest(products, date, requestId, res);
}

// Function to create a new Fact of finance
var createFactFinance =  function(date, income, cost, res, requestId){
  console.log('Method createFactFinance -> param date: ' + date + ' param income: ' + income + ' param cost: ' + cost);
  Fact_finance.create({
    date: date,
    income: income, 
    cost: cost,
    balance: (income - cost)
  }, function(err, factFinanceCreated){
    if (err){
      // throw new Error('An error occurred at creation of new fact of finance in createFactFinance with date: ' + date + ' -> income: ' + income + ' -> cost: ' + cost);
      sendJSONresponse(res, 500, err);
    }else {
      console.log('A new fact of finance was created');
      console.log( factFinanceCreated);
      // sendJSONresponse(res, 201, factFinanceCreated);
      processes.updateStateToCloseInFactRequest(requestId, res);
    }
  });

}

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

