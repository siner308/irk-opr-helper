const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');

const ApiResponse = require('../../models/class/apiresponse');
const model = require('../../models/model.user');

// #region Public functions

router.use(async (req, res, next) => {
  var key = req.query.key ? req.query.key : req.body.key;
  var user = req.user;

  if (user == null) res.status(403).send();
  if (key == null) res.json(new ApiResponse(false, 'NO KEY', null));

  req.user = user;
  next();
});

/**
 * 제품키 유효성 검사
 * 유효기간은 검사하지 않음
 */
router.get('/key/verify', async (req, res, next) => {
  var key = req.query.key;
  var user = req.user;

  try {
    var result = await model.keyVerify(key, user.email);
    res.json(new ApiResponse(result != null && result.length > 0, null, null));
  } catch (err) {
    console.log('err');
    res.json(new ApiResponse(false, null, err));
  }
});

/**
 * 제품키 등록
 */
router.post('/key/activate', async (req, res, next) => {
  var key = req.body.key;
  var user = req.user;

  // 유효성 검사 먼저
  var result = await model.keyVerify(key, user.email);

  if (result != null && result.length > 0 == false)
    return res.status(403).send();

  try {
    await model.keyActivate(key, user.email, user.uid);
    res.json(new ApiResponse(true, null, null));
  } catch (err) {
    console.log(err);
    res.json(new ApiResponse(false, null, err));
  }
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
