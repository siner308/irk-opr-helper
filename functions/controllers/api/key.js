const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');

var ApiResponse = require('../../models/class/apiresponse');

// #region Public functions

router.get('/key', async (req, res, next) => {
  res.json(new ApiResponse(true, null, '테스트 메세지 - 권한 있음'));
  //var token = req.body.token;
  /*
  console.log(token);
  var decoded = null;
  try {
    decoded = await admin.auth().verifyIdToken(token);
  } catch (err) {
    decoded = err;
  }
  res.json(decoded);*/
  //await admin.auth().createSessionCookie(token);
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
