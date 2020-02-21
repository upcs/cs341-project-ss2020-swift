//The file routes all API requests

var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var handler = require('./imports/apiHandler');
var dbms = require('../routes/dbms');

// //The root of the api url offers nothing
// //Potentially we could offer something like API documentation here
// router.get('/', function(req, res, next) {
//   next(createError(404));
// });

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

//server side post -------------------------------------------------------------
router.post('/', function(req, res, next){

  console.log("req body ", req.body);

  // //testing of reading files
  // console.log("lines from the passwords file: " )
  // //preparing to read in a line from the passwords.txt file for use as the host/db/user/password variables
  // const readInterface = readline.createInterface({
  //   input: fs.createReadStream('../routes/passwords.txt'),
  //   output: process.stdout,
  //   console: false
  // });

  // readInterface.on('line', function(line) {
  //   post = line;
  //   console.log(line);
  // });

  //var invert_flag =

  dbms.dbquery("SELECT invert_flag FROM stats2 WHERE stat_name_short='Median household income'",
  function(error, results){
    //the results that come back are JSON objects for each of the applicable entries, with each column as the key
    console.log("got invert_flag");
    // after testing this, DO NOT commit with the password stuff intact!
    console.log("FLAG:" + results[0]);
    //make and send back a JSON of the 3 topping types as keys and the quantity as values
    // toppingData = {"cherry" : numCherry, "plain" : numPlain, "chocolate" : numChocolate};
    // console.log(toppingData);
    // res.send(toppingData);

  }
);

  // //TODO: change to actual stat instead of hardcoded value
  // //query for the actual datadata from the selected category
  // dbms.dbquery("SELECT AL FROM stats2 WHERE stat_name_short='Median household income'",
  //   function(error, results){
  //     //the results that come back are JSON objects for each of the applicable entries, with each column as the key
  //     console.log("got invert_flag");
  //     // after testing this, DO NOT commit with the password stuff intact!

  //     //make and send back a JSON of the 3 topping types as keys and the quantity as values
  //     // toppingData = {"cherry" : numCherry, "plain" : numPlain, "chocolate" : numChocolate};
  //     // console.log(toppingData);
  //     // res.send(toppingData);

  //     console.log("Results: " + results);

  //     res.send({fakeKey: "uselessValue"});

  //   }
  // );

});

module.exports = router;
