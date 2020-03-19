//The file routes all API requests

var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var handler = require('./imports/apiHandler');
var dbms = require('../routes/dbms');

// //The root of the api url offers nothing
// //Potentially we could offer something like API documentation here
router.get('/', function(req, res, next) {
  next(createError(404));
});

router.get('/cats', function(req, res, next) {
  let contents = handler.getCats(function(results){
    if(!results){
      next(createError(404));
      // return;
    }
    // return contents, a object (dictionary) containing the key/value pairs of requested categories
    console.log("<api.js>results[0][stat_id]: " + results[0]["stat_id"]);
    console.log("<api.js>results[0][stat_name_short]: " + results[0]["stat_name_short"]);

    console.log("<api.js>results[1][stat_id]: " + results[1]["stat_id"]);
    console.log("<api.js>results[1][stat_name_short]: " + results[1]["stat_name_short"]);
    res.json(results);
  });

});

// response to request for data for specific categories, as specified by URL encoding
router.get('/data', function(req, res, next){
  //Get category list, or error if not provided
  let cats = handler.parseDataURL(req.query);
  if (!cats){
    next(createError(400));
    return;
  }

  console.log("api.js[router.get /data]: cats: " + cats);

  //Gets data associated with those categories, or throws 404 if any category does not exist
  let contents = handler.getData(cats, function(results){
    if(!results){
      next(createError(404));
      return;
    }

    console.log("CCCCCCCCCCCCCCCCCCCCCCCCCresults: " + results);
    console.log("CCCCCCCCCCCCCCCCCCCCCCCCCresults[0]: " + results[0]);
    console.log("CCCCCCCCCCCCCCCCCCCCCCCCCresults[1]: " + results[1]);
    // console.log("CCCCCCCCCCCCCCCCCCCCCCCCCresults[1][stat_id]: " + results[1]["stat_id"]);

    // return contents, a object (dictionary) containing the key/value pairs of requested categories
    res.json(results);
  });
});

module.exports = router;
