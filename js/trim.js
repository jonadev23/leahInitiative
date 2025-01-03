export function trimString(text){
  const replacedStr = text.replace(/\//g,"");
  const cleanedStr = replacedStr.replace(/<p>/g,"");
  const replaced = cleanedStr.replace(cleanedStr.substring(100),"...");
  const result =  cleanedStr.length > 100 ? replaced : cleanedStr;
  //console.log(result);
  
  return result;
}

//console.log(trimString("<p>Remove the paragraph</p>"));


export  function mapMonth(date) {
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
  const dateY = new Date(date)
  const getMonth = dateY.getMonth()
  return month[getMonth]
 }

 
//  put async later
 export  function mapDate(date) {

const dateY = new Date(date)
 const getToday = dateY.getDate()
  return getToday;
 }


 export  function mapYear(date) {

  const dateY = new Date(date)
   const getThatYear = dateY.getFullYear()
    return getThatYear;
   }
 
   console.log(mapYear("2024-12-09T07:34:55"));
   