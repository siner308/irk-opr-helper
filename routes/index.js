var express = require('express');
var router = express.Router();
var dicmodel = require('../models/dic');

/* GET home page. */
router.get('/', async (req, res, next) => {
  var result = await dicmodel.getAllList();
  res.render('index', {
    title: 'OPR Helper For IRK Agents',
    rows: result,
  });
});

module.exports = router;
