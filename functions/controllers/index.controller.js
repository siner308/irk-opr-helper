var express = require('express');
var router = express.Router();

// #region Public functions

router.get('/', (req, res, next) => {
  res.render('dic', {
    pagename: 'dic',
  });
});

router.get('/itsme', (req, res, next) => {
  res.render('itsme', {
    pageName: 'itsme',
  });
});
// #endregion

module.exports = router;
