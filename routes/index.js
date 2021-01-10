var express = require('express');
var router = express.Router();
var model = require('../models/TIGDAO');


/* GET home page. */
router.get('/user', function (req, res, next) {
  model.checkUser((result)=>{
    res.json(result);
  });
});

router.post('/user/login', function (req, res, next) {
  model.checkMember(req.body,(result)=>{
    if(result == 'nonemail'){
      res.json('404')
    }
    res.json(result);
  });
});

router.get('/product/check', function (req, res, next) {
  model.checkProduct((result)=>{
    res.json(result);
  });
});

router.post('/user/join', function (req, res, next) {
  model.insertMember(req.body,(result)=>{
    res.json(result);
  });
});

router.post('/chargePoint', function (req, res, next) {
  model.chargePoint(req.body,(result)=>{
    res.json(result);
  });
});

router.post('/product/buy', function (req, res, next) {
  model.buyProduct(req.body,(result)=>{
    res.json(result);
  });
});

router.get('/product/sell', function (req, res, next) {
  model.sellProduct(req.query,(result)=>{
    res.json(result);
  });
});

module.exports = router;
