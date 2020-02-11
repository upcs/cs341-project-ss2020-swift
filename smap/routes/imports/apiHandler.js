//This file contains functions for processing  and handling API requests
//This will eventually contain code for querying the database


//Dummy return data - will be replaced with DB connection in the future
var dummyData = {crime_rate: {NV: 1, OR: 2}, salary: {NV: 5, OR: 7}, gdp: {NV: 8, OR: 25}};
var dummyCats = ['crime_rate', 'salary', 'gdp'];

//Finds all valid categories for which data can be fetched
function getCats(){
  return dummyCats;
}

//Parses the request query for the /api/data endpoint
//  query - the request query object
//Returns: A list of categories requested, or undefined if no categories provided
function parseDataURL(query) {
  let cat = query.cat;

  if (cat === undefined){
    return undefined;
  }

  //If only one category supplied, then the categories are not forced into an Array
  //This code takes care of that so we are always dealing with the same type
  if (!Array.isArray(cat){
    cat = [cat];
  }

  return cat;
}

//Gets the data for the /api/data endpoint
//  cats - an array of categories to get data for
//Returns: an object of the form {category: Data}, or undefined if any category does not exist
function getData(cats){
  let contents = {};

  for (let category of cats){
    if (dummyData[category] === undefined){
      return undefined;
    }
    contents[category] = dummyData[category];
  }

  return contents;
}

module.exports = {
  getCats: getCats,
  parseDataURL: parseDataURL,
  getData: getData
}
