var admin = require('firebase-admin');

var db = admin.database();
var ref = db.ref('dic');

/**
 * 사전을 등록
 * @param { String } english - 원문
 * @param { String } korean - 번역한 한글
 * @returns { [boolean, Object] } - [ 성공여부, Data (성공시 삽입된 object) ]
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
    const err = await ref.push().set(newRow);

    console.log(err);

    if (err) return { success: false, result: err };
    else return { success: true, result: newRow };
  } catch (err) {
    return { success: false, result: err };
  }
}

module.exports.add = add;
