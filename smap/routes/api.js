var express = require('express');
var router = express.Router();
var createError = require('http-errors');

var dummyData = {crime_rate: {NV: 1, OR: 2}, salary: {NV: 5, OR: 7}, gdp: {NV: 8, OR: 25}};

/* TODO: Add API documentation. */

/* everything in this file is server responses to requests from the client */
router.get('/', function(req, res, next) {
  next(createError(404));
});

// response to request for categories available
router.get('/cats', function(req, res, next) {
  res.json(['crime_rate', 'salary', 'gdp']);
});

// response to request for data for specific categories, as specified by URL encoding
router.get('/data', function(req, res, next){
  var cats = req.query.cat;

  if (cats === undefined){
    next(createError(400));
    return;
  }

  if (!Array.isArray(cats)){
    //making it so that even a single item is an array we can deal with
    cats = [cats];
  }

  let contents = {};

  for (category of cats){
    if (dummyData[category] === undefined){
      next(createError(404));
      return;
    }
    contents[category] = dummyData[category];
  }

  // return contents, a object (dictionary) containing the key/value pairs of requested categories
  res.json(contents);
});

module.exports = router;

