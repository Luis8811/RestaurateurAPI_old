
// Function to determine is currentDate is inside the range between bieginDate and endDate
// The date format is YYYY-MM-DD
module.exports.isDateInRange = function(beginDate, endDate, currentDate){
    var objBeginDate = new Date(parseInt(beginDate.substr(0,4)), parseInt(beginDate.substr(5,2)), parseInt(beginDate.substr(8)));
    var objEndDate = new Date(parseInt(endDate.substr(0,4)), parseInt(endDate.substr(5,2)), parseInt(endDate.substr(8)));
    var objCurrentDate = new Date(parseInt(currentDate.substr(0,4)), parseInt(currentDate.substr(5,2)), parseInt(currentDate.substr(8)));
    return ((objCurrentDate >= objBeginDate) && (objCurrentDate <= objEndDate)) ? true : false;
  }

  // Devuelve el item máximo de un array, asume que el array tendrá números desde el cero en adelante, es decir naturales, si no hay máximo devuelve -1
  module.exports.maxValueOfTheArrayOfInt = function(myArrayOfInt){
     var max = -1;
     var currentValue = -1;
     var i = 0;
     for(i = 0; i< myArrayOfInt.length; i++){
      if(myArrayOfInt[i] > currentValue){
        currentValue = myArrayOfInt[i];
      }
     }
     return currentValue;
  }

   // Devuelve el item mínimo de un array, asume que el array tendrá números desde el cero en adelante, es decir naturales, si no hay mínimo devuelve -1
   module.exports.minValueOfTheArrayOfInt = function(myArrayOfInt){
    var currentValue = -1;
    if(myArrayOfInt.length > 0){
      currentValue = myArrayOfInt[0];
    }
    var i = 0;
    for(i = 1; i< myArrayOfInt.length; i++){
     if(myArrayOfInt[i] < currentValue){
       currentValue = myArrayOfInt[i];
     }
    }
    return currentValue;
 }

 // Función para mostrar en consola todas las cabeceras de una solicitud
 module.exports.showHeadersFromResponse = function(res){
   //
 }