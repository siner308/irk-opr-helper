var express = require('express');
var router = express.Router();
var dicmodel = require('../models/dic');

class Response {
  constructor(success = true, message = null, data = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  json() {
    return JSON.stringify(this);
  }
}

router.post('/add', async (req, res, next) => {
  var korean = req.body['korean'];
  var english = req.body['english'];

  var [success, result] = await dicmodel.add(english, korean);
  if (success) res.send(new Response(true, null, null).json());
  else res.send(new Response(false, result, null).json());
});

router.get('/search', async (req, res) => {
  var keyword = req.query.keyword;
  var result = await dicmodel.search(keyword);

  res.send(new Response(true, null, result).json());
});

module.exports = router;
