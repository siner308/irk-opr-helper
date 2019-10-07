var ApiResponse = require('./class/apiresponse');

var admin = require('firebase-admin');
var db = admin.database();
var dicRef = db.ref('dic');

// #region Public functions

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
