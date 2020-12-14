var express = require('express');
var router = express.Router();
var model = require('../models/CommuDAO');


/* GET home page. */
router.get('/', function (req, res, next) {
  model.checkProduct((result)=>{
    res.json(result);
  });
  
});

module.exports = router;
