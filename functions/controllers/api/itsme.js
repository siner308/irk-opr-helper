var express = require('express');
var router = express.Router();

var ApiResponse = require('../../models/class/apiresponse');
var model = require('../../models/itsme');

// #region Public functions

router.get('/itsme', async (req, res, next) => {
  var name = req.query.name;
  var x = req.query.x;
  var y = req.query.y;
  var codename = req.query.codename;

  // 코드네임은 유효성 검사 조건에 넣지 않음. 코드네임을 넣지 않으면 누가 올렸는지 구분 없이 가져오기 위함
  // 심사에 떴을 때는 코드네임 구분 없이 가져 오고
  // 내 신청건을 등록 할 때는 코드네임을 넣어서 내 신청건 임을 구분 해야 함
  if (isEmpty(name) || isEmpty(x) || isEmpty(y))
    return res.json(new ApiResponse(false, 'PARAMETER IS INSUFFICIENT', null));

  return res.json(
    new ApiResponse(true, null, await model.search(name, x, y, codename)),
  );
});

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
