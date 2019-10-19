var express = require('express');
var router = express.Router();

var ApiResponse = require('../../models/class/apiresponse');
var model = require('../../models/itsme');

// #region Public functions

/**
 * 사전 추가 컨트롤러
 */
router.post('/itsme', async (req, res, next) => {
  var name = req.body.name;
  var x = req.body.x;
  var y = req.body.y;
  var image = req.body.image;
  var codename = req.body.codename;

  if (isEmpty(name))
    return res.json(new ApiResponse(false, 'NAME IS EMPTY', null));
  if (isEmpty(x))
    return res.json(new ApiResponse(false, 'COORDINATION X IS EMPTY', null));
  if (isEmpty(y))
    return res.json(new ApiResponse(false, 'COORDINATION Y IS EMPTY', null));
  if (isEmpty(image))
    return res.json(new ApiResponse(false, 'IMAGE URL IS EMPTY', null));
  if (isEmpty(codename))
    return res.json(new ApiResponse(false, 'CODENAME IF EMPTY', null));

  /**
   * @type { ApiResponse }
   */
  var responseBody = await model.add(name, x, y, image, codename);
  res.json(responseBody);
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
