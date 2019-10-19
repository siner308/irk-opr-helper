var ApiResponse = require('./class/apiresponse');
var moment = require('moment-timezone');
var admin = require('firebase-admin');
var db = admin.database();
var ref = db.ref('itsme');

// #region Public functions

/**
 * 사전 검색
 * @param { string } english
 */
async function search(english) {
  try {
    const searched = await ref
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
 * 새 Entity를 등록
 * @param { string } english 원문
 * @param { string } korean 번역한 한글
 * @param { string } codename 등록자 코드네임
 * @returns { ApiResponse }
 */
async function add(name, x, y, image, codename) {
  var newRow = {
    name: name,
    x: x,
    y: y,
    image: image,
    creator: codename,
    updater: codename,
    createtime: moment()
      .tz('Asia/Seoul')
      .format('YYYY-MM-DD HH:mm'),
    updatetime: moment()
      .tz('Asia/Seoul')
      .format('YYYY-MM-DD HH:mm'),
  };
  try {
    // set() 은 return 값이 error
    var newDocRef = ref.push();
    const err = await newDocRef.set(newRow);
    newRow.key = newDocRef.key;

    if (err) return new ApiResponse(false, err, null);
    else return new ApiResponse(true, null, newRow);
  } catch (err) {
    return new ApiResponse(false, err, null);
  }
}
module.exports.add = add;

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
