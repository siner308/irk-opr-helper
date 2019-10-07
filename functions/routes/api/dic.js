var express = require('express');
var router = express.Router();
var dicmodel = require('../../models/dic/dic');

class Response {
  constructor(success = true, message = null, data = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

router.post('/add', async (req, res, next) => {
  var korean = req.body['korean'];
  var english = req.body['english'].toLowerCase();
  var codename = req.body['codename'];

  var response = await dicmodel.add(english, korean, codename);

  if (response.success) res.json(new Response(true, null, response.result));
  else res.json(new Response(false, response.result, null));
});

// router.get('/search', async (req, res) => {
//   var keyword = req.query.keyword;
//   var result = await dicmodel.search(keyword);

//   res.send(new Response(true, null, result).json());
// });

module.exports = router;
