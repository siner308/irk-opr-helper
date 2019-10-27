const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');

const ApiResponse = require('../../models/class/apiresponse');
const model = require('../../models/model.user');

// #region Public functions

router.get('/key/verify', async (req, res, next) => {
  var key = req.query.key;
  var user = req.user;

  if (user == null) res.status(403).send();
  if (key == null) res.json(new apifunc(false, 'NO KEY', null));

  var result = await model.keyVerify(key, user.email);

  res.json(new apifunc(result != null && result.length > 0, null, null));
});

router.post('/key/activate', async (req, res, next) => {
  var key = req.query.key;
  var user = req.user;

  if (user == null) res.status(403).send();
  if (key == null) res.json(new apifunc(false, 'NO KEY', null));

  var result = await model.keyVerify(key, user.email);

  if (result != null && result.length > 0 == false)
    return res.status(403).send();
});

// #endregion

// #region Private funcs

/**
 * 비었거나 null 인지 체크
 * @param { string } value 체크 할 값
 */
function isEmpty(value) {
  return value == undefined || value == '';
}

// #endregion

module.exports = router;
