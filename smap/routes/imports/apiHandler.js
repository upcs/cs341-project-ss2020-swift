/* 
* This file contains functions for processing  and handling API requests
* Data involved in these requests is obtained via database queries
*/

"use strict";

var mysql = require("mysql");
var dbms = require("../dbms");
var consts = require("./constants");

const rawQuery = consts.rawQuery;
const states = consts.states;
const catsQuery = consts.cats;
const metadata = consts.metadata;

/*
  Finds all valid categories (statistics) for which data can be fetched from the database.
  Args: 
    callback - a callback function that specifies how to handle the results obtained from the db query in this function
  Return:
    The function returns in the event of a failed database query
*/
function getCats(callback){
  console.log("getting cats....");
  let query = catsQuery;
  console.log("query: " + query);
  dbms.dbquery(query, function(error, results){
    if(error){
      console.log("You are a failure and you will never succeed");
      callback(undefined);
      //telling the function to not carry oooooonnnn
      return;
    }

    // console.log("<apiHandler.js> results[0][stat_id]: " + results[0]["stat_id"]);
    // console.log("<apiHandler.js> results[0][stat_name_short]: " + results[0]["stat_name_short"]);

    callback(results);
  });
}


/*
  Queries the database for metadata on all available categories
  Args: 
    callback - a callback function that specifies how to handle the results obtained from the db query in this function
  Return:
    The function returns in the event of a failed database query
*/
function getMeta(callback){
  console.log("meta...");
  let query = metadata;
  console.log("query: " + query);
  dbms.dbquery(query, function(error, results){
    if(error){
      console.log("You are a failure and you will never succeed");
      callback(undefined);
      //telling the function to not carry oooooonnnn
      return;
    }

    //for future reference: text in BLOBs will look like ASCII values
    //unless it is referenced as results[x].note
    callback(results);
  });
}

/*
  Parses the request query for the /api/data endpoint
  Args: 
    query - the requested query object
  Return:
    cat - an array of the stat_ids corresponding to categories requested, or undefined if none provided
*/
function parseDataURL(query) {

  //remember, queries will be the stat_id, aka a number
  let cat = query.cat;

  if (cat === undefined){
    return undefined;
  }

  //If only one category supplied, then the categories are not forced into an Array
  //This code takes care of that so we are always dealing with the same type
  if (!Array.isArray(cat)){
    cat = [cat];
  }

  for(let i = 0; i < cat.length; i++){
    cat[i] = parseInt(cat[i], 10);
    if(!cat[i] || !isFinite(cat[i])){
      return undefined;
    }
  }
  return cat;
}

/*
  Gets the data for the /api/data endpoint via a database query. At this point, the data is NOT normalized.
  Args: 
    cats - an array of the stat_ids corresponding to categories requested, or undefined if none provided
    callback - a callback function that specifies how to handle the results obtained from the db query in this function
  Return:
    An array with objects of the form {category: Data}, or undefined if the database query was unsuccessful. Note that passing in a nonexistant 
    category is acceptable; it will be ignored, but will not create an error. If the query contains good and bad categories, only 
    the good ones will be part of the returned object.
*/
function getData(cats, callback){
  let query = mysql.format(rawQuery, [states, cats]);
  dbms.dbquery(query, function(error, results){
    if(error){
      console.log("You are a failure and you will never succeed");
      callback(undefined);
      return;
    }

    callback(results);
  });
}

module.exports = {
  getCats: getCats,
  parseDataURL: parseDataURL,
  getData: getData,
  getMeta: getMeta
}
