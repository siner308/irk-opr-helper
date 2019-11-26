var express = require('express');
var router = express.Router();

var AR = require('../../models/class/apiresponse');
var model = require('../../models/model.itsme');
var f = require('../../models/class/functions');

// #region Public functions

/**
 * 접니다 검색
 */
router.get('/itsme', async (req, res) => {
  var title = req.query.name.trim();
  var x = req.query.x.trim();
  var y = req.query.y.trim();
  var codename = req.query.codename.trim();

  // 코드네임은 유효성 검사 조건에 넣지 않음. 코드네임을 넣지 않을때는 누가 올렸는지 구분 없이 가져오기 위함
  // 심사에 떴을 때는 코드네임 구분 없이 가져 오고
  // 내 신청건을 등록 할 때는 코드네임을 넣어서 내 신청건 임을 구분 해야 함
  if (f.isEmpty(title) || f.isEmpty(x) || f.isEmpty(y))
    return res.json(new AR(false, 'PARAMETER IS INSUFFICIENT', null));

  return res.json(
    new AR(true, null, await model.search(title, x, y, codename)),
  );
});

/**
 * 접니다 추가
 */
router.post('/itsme', async (req, res) => {
  var title = req.body.name.trim();
  var x = req.body.x.trim();
  var y = req.body.y.trim();
  var image = req.body.image.trim();
  var codename = req.body.codename.trim();

  if (f.isEmpty(title)) return res.json(new AR(false, 'NAME IS EMPTY', null));
  if (f.isEmpty(x))
    return res.json(new AR(false, 'COORDINATION X IS EMPTY', null));
  if (f.isEmpty(y))
    return res.json(new AR(false, 'COORDINATION Y IS EMPTY', null));
  if (f.isEmpty(image))
    return res.json(new AR(false, 'IMAGE URL IS EMPTY', null));
  if (f.isEmpty(codename))
    return res.json(new AR(false, 'CODENAME IF EMPTY', null));

  res.json(await model.add(title, x, y, image, codename));
});

// #endregion

// #region Private funcs

// #endregion

module.exports = router;
