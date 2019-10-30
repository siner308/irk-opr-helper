var express = require('express');
var router = express.Router();

var AR = require('../../models/class/apiresponse');
var model = require('../../models/model.dic');
var f = require('../../models/class/functions');

// #region Public functions

/**
 * 영어로 한글을 가져옴, 문장을 넣으면 띄어쓰기 단위로 각각 번역해서 가져옴
 */
router.get('/dic', async (req, res) => {
  var keyword = req.query.keyword;

  if (f.isEmpty(keyword))
    return res.json(new AR(false, 'KEYWORD IS EMPTY', null));

  var splitted = keyword.split(' ');

  // 여러 단어인 경우
  if (splitted.length > 1) {
    var result = [];

    for (var s of splitted) {
      try {
        result.push(await search(s));
      } catch (err) {
        return res.json(new AR(false, err, null));
      }
    }

    return res.json(new AR(true, null, result.join(' ')));
  }
  // 한 단어인 경우
  else {
    try {
      return res.json(new AR(true, null, await search(keyword)));
    } catch (err) {
      return res.json(new AR(false, err, null));
    }
  }

  /**
   * 모델에서 가져오는 코드를 묶어놓음
   * @param { string } key
   */
  async function search(key) {
    try {
      var find = await model.search(key);

      // 번역 할 것이 없으면 원문을 다시 내보냄
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
router.post('/dic', async (req, res) => {
  var korean = req.body.korean;
  var english = req.body.english.toLowerCase();
  var codename = req.body.codename;

  if (f.isEmpty(english))
    return res.json(new AR(false, 'ENGLISH IS EMPTY', null));
  if (f.isEmpty(korean))
    return res.json(new AR(false, 'KOREAN IS EMPTY', null));
  if (f.isEmpty(codename))
    return res.json(new AR(false, 'CODENAME IS EMPTY', null));

  /**
   * @type { ApiResponse }
   */
  var responseBody = await model.add(english, korean, codename);
  res.json(responseBody);
});

/**
 * 사전 수정 컨트롤러
 */
router.put('/dic', async (req, res) => {
  var key = req.body.key;
  var english = req.body.english;
  var korean = req.body.korean;
  var codename = req.body.codename;

  if (f.isEmpty(english) && f.isEmpty(korean))
    return res.json(new AR(false, 'VALUE IS EMPTY', null));
  if (f.isEmpty(key)) return res.json(new AR(false, 'KEY IS EMPTY', null));
  if (f.isEmpty(codename))
    return res.json(new AR(false, 'CODENAME IS EMPTY', null));

  var responseBody = await model.update(key, english, korean, codename);
  return res.json(responseBody);
});

/**
 * 사전 삭제 컨트롤러
 */
router.delete('/dic', async (req, res) => {
  var key = req.body.key;

  if (f.isEmpty(key)) return res.json(new AR(false, 'KEY IS EMPTY', null));

  var responseBody = await model.remove(key);
  return res.json(responseBody);
});

// #endregion

// #region Private funcs

// #endregion

module.exports = router;
