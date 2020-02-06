var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
  console.log("api routing");
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  next(createError(404));
});

router.get('/cats', function(req, res, next) {
  res.json(['crime_rate', 'salary', 'gdp']);
});

module.exports = router;
