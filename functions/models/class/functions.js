/**
 * 연관 오브젝트를 배열로 변환. 오브젝트의 이름은 'key' 프로퍼티로 변환
 */
module.exports.objToArray = source => {
  var result = [];
  Object.keys(source).map((key, i, a) => {
    source[key].key = key;
    result.push(source[key]);
  });
  return result;
};

/**
 * 비었거나 null 인지 체크
 * @param { string } value 체크 할 값
 */
module.exports.isEmpty = value => {
  return value == undefined || value == '';
};
