var ApiResponse = require('./class/apiresponse');

var admin = require('firebase-admin');
var db = admin.database();
var dicRef = db.ref('dic');

// #region Public functions

/**
 * 사전 검색
 * @param { string } english
 */
async function search(english) {
  try {
    const searched = await dicRef
      .orderByChild('english')
      .equalTo(english.toLowerCase());
    const fetched = await searched.once('value');
    return fetched.val();
  } catch (err) {
    throw err;
  }
}
module.exports.search = search;

/**
 * 사전에 새 Entity를 등록
 * @param { string } english 원문
 * @param { string } korean 번역한 한글
 * @param { string } codename 등록자 코드네임
 * @returns { ApiResponse }
 */
async function add(english, korean, codename) {
  var newRow = {
    english: english,
    korean: korean,
    creator: codename,
    updater: codename,
    createtime: new Date().toLocaleString('ko-KR', { hour12: false }),
    updatetime: new Date().toLocaleString('ko-KR', { hour12: false }),
  };
  try {
    // set() 은 return 값이 error
    var newDocRef = dicRef.push();
    const err = await newDocRef.set(newRow);
    newRow.key = newDocRef.key;

    if (err) return new ApiResponse(false, err, null);
    else return new ApiResponse(true, null, newRow);
  } catch (err) {
    return new ApiResponse(false, err, null);
  }
}
module.exports.add = add;

/**
 * 사전 업데이트
 * @param { string } key 업데이트 할 문서의 키
 * @param {*} english 업데이트 할 원문, 비었으면 업데이트 하지 않음
 * @param {*} korean 업데이트 할 번역문, 비었으면 업데이트 하지 않음
 * @param {*} codename 기여자 코드네임
 */
async function update(key, english, korean, codename) {
  // 영문을 바꾸려는 경우 중복이 존재하는지 확인
  if (!isEmpty(english)) {
    try {
      const existData = await dicRef.orderByChild('english').equalTo(english);
      const fetched = await existData.once('value');
      if (fetched.numChildren() > 0)
        return new ApiResponse(false, 'ENGLISH IS EXISTS', null);
    } catch (err) {
      return new ApiResponse(false, err, null);
    }
  }

  // 한글을 바꾸려는 경우 중복이 존재하는지 확인
  if (!isEmpty(korean)) {
    try {
      const existData = await dicRef.orderByChild('korean').equalTo(korean);
      const fetched = await existData.once('value');
      if (fetched.numChildren() > 0)
        return new ApiResponse(false, 'KOREAN IS EXISTS', null);
    } catch (err) {
      return new ApiResponse(false, err, null);
    }
  }

  // 실제 업데이트
  const doc = dicRef.child(key);
  var newdoc = {
    updater: codename,
    updatetime: new Date().toLocaleString('ko-KR', { hour12: false }),
  };
  if (!isEmpty(english)) newdoc.english = english;
  if (!isEmpty(korean)) newdoc.korean = korean;

  try {
    await doc.update(newdoc);
    return new ApiResponse(true, null, newdoc);
  } catch (err) {
    return new ApiResponse(false, err, null);
  }
}
module.exports.update = update;

/**
 * 사전에서 삭제
 * @param { string } key 삭제 할 문서의 키
 */
async function remove(key) {
  try {
    const err = await dicRef.child(key).remove();

    if (err) return new ApiResponse(false, err, null);
    else return new ApiResponse(true, null, null);
  } catch (err) {
    return new ApiResponse(false, err, null);
  }
}
module.exports.remove = remove;

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
