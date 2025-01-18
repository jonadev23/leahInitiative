export function trimString(text) {
  const replacedStr = text.replace(/\//g, "");
  const cleanedStr = replacedStr.replace(/<p>/g, "");
  const replaced = cleanedStr.replace(cleanedStr.substring(100), "...");
  const result = cleanedStr.length > 100 ? replaced : cleanedStr;
  //console.log(result);

  return result;
}

export function trimStringLong(text) {
  const replacedStr = text.replace(/\//g, "");
  const cleanedStr = replacedStr.replace(/<p>/g, "");
  const replaced = cleanedStr.replace(cleanedStr.substring(100), "...");
  const result = cleanedStr.length > 1000 ? replaced : cleanedStr;
  //console.log(result);

  return result;
}

export function cleanString(text) {
  return text.replace(/<\/?p>/g, "");
}

//console.log(trimString("<p>Remove the paragraph</p>"));

//  put async later
export async function mapDate(date) {
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateY = new Date(date);
  const getToday = dateY.getDate();
  const getThatYear = dateY.getFullYear();
  const indexOfMonth = dateY.getMonth();
  const getMonth = month[indexOfMonth];
  return { getToday, getThatYear, getMonth };
}

// console.log(mapYear("2024-12-09T07:34:55"));
//console.log(mapDate("2024-12-09T07:34:55"));
