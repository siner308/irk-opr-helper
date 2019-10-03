var express = require('express');
var router = express.Router();
var mysql = require('../import/mysql');

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

/* GET home page. */
router.post('/add', function(req, res, next) {
  /**
   * @type String - 번역후 국문
   */
  var korean = req.body['korean'];
  /**
   * @type String - 번역전 원문
   */
  var english = req.body['english'];

  mysql.query(
    `insert into opr_translate (english, korean, createtime, updatetime, creator, updater) 
    VALUES ('${english.toLowerCase()}', '${korean.toLowerCase()}', NOW(), NOW(), 1, 1)`,
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        var response = new Response(false, err.message, null);
        res.send(response.json());
        return;
      }

      var response = new Response(true, null, null).json();
      res.send(response);
    },
  );
});

module.exports = router;
