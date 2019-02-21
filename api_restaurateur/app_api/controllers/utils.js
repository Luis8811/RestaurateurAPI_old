
// Function to determine is currentDate is inside the range between bieginDate and endDate
// The date format is YYYY-MM-DD
module.exports.isDateInRange = function(beginDate, endDate, currentDate){
    var objBeginDate = new Date(parseInt(beginDate.substr(0,4)), parseInt(beginDate.substr(5,2)), parseInt(beginDate.substr(8)));
    var objEndDate = new Date(parseInt(endDate.substr(0,4)), parseInt(endDate.substr(5,2)), parseInt(endDate.substr(8)));
    var objCurrentDate = new Date(parseInt(currentDate.substr(0,4)), parseInt(currentDate.substr(5,2)), parseInt(currentDate.substr(8)));
    return ((objCurrentDate >= objBeginDate) && (objCurrentDate <= objEndDate)) ? true : false;
  }