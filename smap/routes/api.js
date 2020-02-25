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

// response to request for categories available
router.get('/cats', function(req, res, next) {
  res.json(handler.getCats());
});

// response to request for data for specific categories, as specified by URL encoding
router.get('/data', function(req, res, next){
  //Get category list, or error if not provided
  let cats = handler.parseDataURL(req.query);
  if (!cats){
    next(createError(400));
    return;
  }

  //Gets data associated with those categories, or throws 404 if any category does not exist
  let contents = handler.getData(cats, function(results){
    console.log(results);
    if(!results){
      next(createError(404));
      return;
    }

    // return contents, a object (dictionary) containing the key/value pairs of requested categories
    res.json(results);
  });
});

module.exports = router;
