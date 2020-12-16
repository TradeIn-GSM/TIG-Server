var express = require('express');
var router = express.Router();
var model = require('../models/CommuDAO');


/* GET home page. */
router.get('/user', function (req, res, next) {
  model.checkUser((result)=>{
    res.json(result);
  });
});

router.get('/product', function (req, res, next) {
  model.checkProduct((result)=>{
    res.json(result);
  });
});

router.post('/insertMember', function (req, res, next) {
  model.insertMember(req.body,(result)=>{
    res.json(result);
  });
});

module.exports = router;
