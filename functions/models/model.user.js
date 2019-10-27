var ApiResponse = require('./class/apiResponse');
var moment = require('moment-timezone');
var admin = require('firebase-admin');
var db = admin.database();
var ref = db.ref('users');

// #region Public functions

/**
 * 제품키가 유효한지 검증 합니다
 * @param { String } key
 * @param { String } email
 */
async function keyVerify(key, email) {
  try {
    const searched = ref.orderByChild('key').equalTo(key);
    var fetched = await searched.once('value');
    fetched = fetched.val();
    if (fetched == null) return null;

    result = result.filter((v, i, a) => {
      return v.email == email && v.isActive == false;
    });

    return result;
  } catch (err) {
    return false;
  }
}
module.exports.keyVerify = keyVerify;

async function search(name, x, y, codename) {
  try {
    const searched = await ref.orderByChild('name').equalTo(name);
    var fetched = await searched.once('value');
    fetched = fetched.val();

    if (fetched == null) return null;

    // 연관 오브젝트를 배열로 변환, 키값은 property 로 변환
    var result = [];
    Object.keys(fetched).map((key, i, a) => {
      result.push(fetched[key]);
    });

    // GPS 좌표로 필터링
    result = result.filter((v, i, a) => {
      return v.x == x && v.y == y;
    });

    // 코드네임이 있으면 코드네임도 필터링
    if (isEmpty(codename) === false)
      result = result.filter((v, i, a) => {
        return v.codenameLower == codename.toLowerCase();
      });

    return result;
  } catch (err) {
    throw err;
  }
}
module.exports.search = search;

/**
 * 새 Entity를 등록
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
    codenameLower: codename.toLowerCase(),
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

/*async function test() {
  try {
    const searched = await ref.orderByChild('name');
    var fetched = await searched.once('value');
    fetched = fetched.val();

    if (fetched == null) return null;

    Object.keys(fetched).map(async (key, i, a) => {
      console.log(fetched[key].creator);

      var trimed = fetched[key].creator.trim();

      const doc = ref.child(key);
      var newdoc = {
        creator: trimed,
        updater: fetched[key].updater.trim(),
        codenameLower: trimed.toLowerCase(),
      };

      await doc.update(newdoc);
    });
  } catch (err) {
    console.log(err);
  }
}
module.exports.test = test;*/

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
