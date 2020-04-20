//The file routes all API requests

var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var handler = require('./imports/apiHandler');
var dbms = require('../routes/dbms');

/*
  Handles requests to the root of the api url, which contains nothing.
*/
router.get('/', function(req, res, next) {
  next(createError(404));
});

/*
  Handles requests to requests for whatever categories are available from the database
  Return:
    results - an array of objects (dictionaries) containing the key/value pairs for stat_name_short and stat_id equested categories,
    where the keys are the column names requested from the database, and the values are the values that 
    correspond to the columns
*/
router.get('/cats', function(req, res, next) {
  let contents = handler.getCats(function(results){
    if(!results){
      next(createError(404));
      return;
    }

    // console.log("results[0][stat_id]: " + results[0]["stat_id"]);
    // console.log("results[0][stat_name_short]: " + results[0]["stat_name_short"]);

    // return results, a object (dictionary) containing the key/value pairs of all available categories
    res.json(results);
  });
});

/*
  Response to request for data for specific categories, as specified by URL encoding
  Return:
    If either if the queries is unsuccessful, we throw an error and return to escape this function. Otherwise...

    results - an array of objects (dictionaries) containing the key/value pairs of requested categories,
    where the keys are the column names requested from the database, and the values are the values that 
    correspond to the columns; this will be a huge list because it includes all 50 states, 
    stat_id, invert_flag, and stat_name_short
*/
router.get('/data', function(req, res, next){
  //Get category list, or error if not provided
  let cats = handler.parseDataURL(req.query);
  if (!cats){
    next(createError(400));
    return;
  }

  //Gets data associated with those categories, or throws 404 if any category does not exist
  let contents = handler.getData(cats, function(results){
    if(!results || results.length === 0){
      next(createError(404));
      return;
    }
    
    // return results, a object (dictionary) containing the key/value pairs of requested categories
    res.json(results);
  });
});

/*
  Response to request for metadata for all of the available categories
  Return:
    results - an array of objects (dictionaries) containing the key/value pairs of all available categories,
    where the keys are the column names requested from the database (stat_id, stat_name_short, source, conducted_by,
    survey_period, region, type_of_survey, number_of_respondents, age_group, special_characteristics, note), and 
    the values are the values that correspond to the columns
*/
router.get('/meta', function(req, res, next){
  let contents = handler.getMeta(function(results){
    if(!results){
      next(createError(404));
      return;
    }

    // console.log("<api.js>results[0][stat_id]: " + results[0]["stat_id"]);
    // console.log("<api.js>results[0][stat_name_short]: " + results[0]["stat_name_short"]);

    // return results, a object (dictionary) containing the key/value pairs of requested categories
    res.json(results);
  });
});

module.exports = router;
