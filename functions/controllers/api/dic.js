var express = require('express');
var router = express.Router();

require('../../models/class/apiresponse');
var dicmodel = require('../../models/dic');

// #region Public functions

/**
 * 사전 추가 컨트롤러
 */
router.post('/add', async (req, res, next) => {
  /**
   * @type { string } 한글
   */
  var korean = req.body['korean'];
  /**
   * @type { string } 번역전 원문
   */
  var english = req.body['english'].toLowerCase();
  /**
   * @type { string } 등록자 코드네임
   */
  var codename = req.body['codename'];

  /**
   * @type { ApiResponse }
   */
  var responseBody = await dicmodel.add(english, korean, codename);
  res.json(responseBody);
});

// #endregion

module.exports = router;
