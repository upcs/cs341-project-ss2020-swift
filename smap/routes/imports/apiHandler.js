//This file contains functions for processing  and handling API requests
//This will eventually contain code for querying the database

"use strict";

var mysql = require("mysql");
var dbms = require("../dbms");
var consts = require("./constants");

//Dummy return data - will be replaced with DB connection in the future
var dummyData = {crime_rate: {NV: 1, OR: 2}, salary: {NV: 5, OR: 7}, gdp: {NV: 8, OR: 25}};
var dummyCats = [{stat_id:2, stat_name_short:"DUMMY CAT-- GDP"}, {stat_id:3, stat_name_short:"DUMMY CAT-- Education Expenditure"}];
var dummyCats2 = [{id:2, stat_name_short:"GDP"}];

const rawQuery = consts.rawQuery;
const states = consts.states;
const catsQuery = consts.cats;
const metadata = consts.metadata;

//Finds all valid categories for which data can be fetched
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

//Finds metadata for all available categories
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

//Parses the request query for the /api/data endpoint
//  query - the request query object
//Returns: A list of categories requested, or undefined if no categories provided
function parseDataURL(query) {

  //remember, queries will be the stat_id, aka a number
  let cat = query.cat;

  // console.log("apiHandler.js[parseDataURL]: query:" + query);
  // console.log("apiHandler.js[parseDataURL]: query as a string:" + JSON.stringify(query));
  // console.log("apiHandler.js[parseDataURL]: query.cat:" + query.cat);
  // console.log("apiHandler.js[parseDataURL]: query.stat_id:" + query.stat_id);

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
    if(!cat[i]){
      return undefined;
    }
  }
  return cat;
}


//refer to comments at line 46
//Gets the data for the /api/data endpoint
//  cats - an array of categories to get data for
//Returns: an object of the form {category: Data}, or undefined if any category does not exist
//Note that at this point, the data is NOT normalized
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
