var express = require('express');
var router = express.Router();

var ApiResponse = require('../../models/class/apiresponse');
var dicmodel = require('../../models/dic');

// #region Public functions

/**
 * 사전 추가 컨트롤러
 */
router.post('/dic', async (req, res, next) => {
  /**
   * @type { string } 한글
   */
  var korean = req.body.korean;
  /**
   * @type { string } 번역전 원문
   */
  var english = req.body.english.toLowerCase();
  /**
   * @type { string } 등록자 코드네임
   */
  var codename = req.body.codename;

  /**
   * @type { ApiResponse }
   */
  var responseBody = await dicmodel.add(english, korean, codename);
  res.json(responseBody);
});

/**
 * 사전 수정 컨트롤러
 */
router.put('/dic', async (req, res, next) => {
  var key = req.body.key;
  var english = req.body.english;
  var korean = req.body.korean;

  if (
    (english == undefined || english == '') &&
    (korean == undefined || korean == '')
  )
    return res.json(new ApiResponse(false, 'VALUE IS EMPTY', null));
  if (key == undefined || key == '')
    return res.json(new ApiResponse(false, 'KEY IS EMPTY', null));

  return res.json(new ApiResponse(true, null, null));
});

/**
 * 사전 삭제 컨트롤러
 */
router.delete('/dic', async (req, res, next) => {
  /**
   * @type { string } Key
   */
  var key = req.body.key;
  if (key == undefined || key == '')
    return res.json(new ApiResponse(false, 'KEY IS EMPTY', null));

  var responseBody = await dicmodel.remove(key);
  return res.json(responseBody);
});

// #endregion

module.exports = router;
