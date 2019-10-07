var express = require('express');
var router = express.Router();

var ApiResponse = require('../../models/class/apiresponse');
var dicmodel = require('../../models/dic');

// #region Public functions

/**
 * 영어로 한글을 가져옴, 띄어쓰기 단위로 각각 번역해서 가져옴
 */
router.get('/dic', async (req, res, next) => {
  var keyword = req.query.keyword;
  if (keyword == undefined || keyword == '')
    return res.json(new ApiResponse(false, 'KEYWORD IS EMPTY', null));

  var splitted = keyword.split(' ');

  // 여러 단어인 경우
  if (splitted.length > 1) {
    var result = [];

    for (var s of splitted) {
      try {
        result.push(await search(s));
      } catch (err) {
        return res.json(new ApiResponse(false, err, null));
      }
    }

    return res.json(new ApiResponse(true, null, result.join(' ')));
  }
  // 한 단어인 경우
  else {
    try {
      return res.json(new ApiResponse(true, null, await search(keyword)));
    } catch (err) {
      return res.json(new ApiResponse(false, err, null));
    }
  }

  /**
   * 모델에서 가져오는 코드를 묶어놓음
   * @param { string } key
   */
  async function search(key) {
    try {
      var find = await dicmodel.search(key);
      console.log(find);
      if (find == null) return key;
      else return find[Object.keys(find)[0]].korean;
    } catch (err) {
      throw err;
    }
  }
});

/**
 * 사전 추가 컨트롤러
 */
router.post('/dic', async (req, res, next) => {
  var korean = req.body.korean;
  var english = req.body.english.toLowerCase();
  var codename = req.body.codename;

  if (isEmpty(english))
    return res.json(new ApiResponse(false, 'ENGLISH IS EMPTY', null));
  if (isEmpty(korean))
    return res.json(new ApiResponse(false, 'KOREAN IS EMPTY', null));
  if (isEmpty(codename))
    return res.json(new ApiResponse(false, 'CODENAME IS EMPTY', null));

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
  var codename = req.body.codename;

  if (isEmpty(english) && isEmpty(korean))
    return res.json(new ApiResponse(false, 'VALUE IS EMPTY', null));
  if (isEmpty(key))
    return res.json(new ApiResponse(false, 'KEY IS EMPTY', null));
  if (isEmpty(codename))
    return res.json(new ApiResponse(false, 'CODENAME IS EMPTY', null));

  var responseBody = await dicmodel.update(key, english, korean, codename);
  return res.json(responseBody);
});

/**
 * 사전 삭제 컨트롤러
 */
router.delete('/dic', async (req, res, next) => {
  var key = req.body.key;

  if (isEmpty(key))
    return res.json(new ApiResponse(false, 'KEY IS EMPTY', null));

  var responseBody = await dicmodel.remove(key);
  return res.json(responseBody);
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
