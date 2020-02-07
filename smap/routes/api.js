var express = require('express');
var router = express.Router();

/* TODO: Add API documentation. */
router.get('/', function(req, res, next) {
  next(createError(404));
});

router.get('/cats', function(req, res, next) {
  res.json(['crime_rate', 'salary', 'gdp']);
});

router.get('/data', function(req, res, next){
  console.log(req);
  /*console.log(req.body);
  console.log(req.headers);
  console.log(req.path);*/
  res.send("Nothing to see here")
});

module.exports = router;
