var express = require('express');
var router = express.Router();
var mysql = require('../import/mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  mysql.query(
    `SELECT T.*, U.codename as creatorname FROM opr_translate T INNER JOIN opr_user U on T.creator = U.id order by id`,
    (err, results, fields) => {
      if (err) console.log(err.message);
      rows = results;
      res.render('index', {
        title: 'OPR Helper For IRK Agents',
        rows: results,
      });
    },
  );
});

module.exports = router;
