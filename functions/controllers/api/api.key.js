const express = require('express');
const router = express.Router();

const AR = require('../../models/class/apiresponse');
const model = require('../../models/model.user');

// #region Public functions

/**
 * 미들웨어
 * 제품키와 인증된 유저로 유효성 검사
 */
router.use(async (req, res, next) => {
  var key = req.query.key ? req.query.key : req.body.key;
  var user = req.user;

  if (user == null) res.status(403).send('authorization failed - invalid user');
  if (key == null) res.json(new AR(false, 'insufficient product key', null));

  req.user = user;
  next();
});

/**
 * 제품키 유효성 검사
 */
router.get('/key/verify', async (req, res, next) => {
  var key = req.query.key;
  var user = req.user;

  try {
    var result = await model.keyVerify(key, user.email);
    res.json(new AR(result != null && result.length > 0, null, null));
  } catch (err) {
    console.log('err');
    res.json(new AR(false, null, err));
  }
});

/**
 * 제품키 등록
 */
router.post('/key/activate', async (req, res, next) => {
  var key = req.body.key;
  var user = req.user;

  // 유효성 검사 먼저
  try {
    await model.keyVerify(key, user.email);
  } catch (err) {
    return res.json(new AR(false, err, err));
  }

  // 제품키 등록
  try {
    await model.keyActivate(key, user.email, user.uid);
    res.json(new AR(true, null, null));
  } catch (err) {
    console.log(err);
    res.json(new AR(false, null, err));
  }
});

// #endregion

module.exports = router;
