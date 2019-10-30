var ApiResponse = require('./class/apiresponse');
var moment = require('moment-timezone');
var admin = require('firebase-admin');
var db = admin.database();
var ref = db.ref('users');
var functions = require('./class/functions');

// #region Public functions

/**
 * 제품키가 유효한지 검증 합니다
 * @param { String } productKey   제품키
 * @param { String } email        이메일
 */
module.exports.keyVerify = async (productKey, email) => {
  try {
    // 해당 제품키로 등록된 유저가 있는지 검색
    var fetched = await ref
      .orderByChild('productKey')
      .equalTo(productKey)
      .once('value');
    var user = fetched.val();

    if (user == null) throw 'no matched product key';

    // 이메일이 일치하면서 활성화 되었는지 체크
    var result = user.filter(v => v.email == email && v.isActive == false);
    if (result == null || result.length == 0) throw 'no matched user';

    return result;
  } catch (err) {
    throw err;
  }
};

/**
 * 제품키를 등록 합니다
 * 현재는 유효기간을 체크하지 않습니다
 * @param { String } productKey   제품키
 * @param { String } email        이메일
 * @param { String } uid          구글 api 에 등록된 유저의 uid
 */
module.exports.keyActivate = async (productKey, email, uid) => {
  try {
    var verify = await keyVerify(productKey, email);
    if (verify == null) throw 'product key does not verified';

    var val = await ref
      .orderByChild('productKey')
      .equalTo(productKey)
      .once('value');
    val = functions.objToArray(val.val());

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
