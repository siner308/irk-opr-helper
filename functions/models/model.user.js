var ApiResponse = require('./class/apiresponse');
var moment = require('moment-timezone');
var admin = require('firebase-admin');
var db = admin.database();
var ref = db.ref('users');
var functions = require('./class/functions');

// #region Public functions

/**
 * 제품키가 유효한지 검증 합니다
 * @param { String } key
 * @param { String } email
 */
async function keyVerify(key, email) {
  try {
    const searched = ref.orderByChild('productKey').equalTo(key);
    var fetched = await searched.once('value');
    fetched = fetched.val();

    if (fetched == null) return null;

    var result = fetched.filter((v, i, a) => {
      return v.email == email && v.isActive == false;
    });

    return result;
  } catch (err) {
    throw err;
  }
}
module.exports.keyVerify = keyVerify;

module.exports.keyActivate = async (key, email, uid) => {
  try {
    var verify = await keyVerify(key, email);
    if (verify == null) return null;

    var val = await ref
      .orderByChild('productKey')
      .equalTo(key)
      .once('value');

    val = functions.objToArray(val.val());
    console.log(val);

    const doc = ref.child(val[0].key);

    var newdoc = {
      isActive: true,
      uid: uid,
      updatetime: moment()
        .tz('Asia/Seoul')
        .format('YYYY-MM-DD HH:mm'),
    };

    await doc.update(newdoc);
    return new ApiResponse(true, null, doc);
  } catch (err) {
    throw err;
  }
};

// #endregion
