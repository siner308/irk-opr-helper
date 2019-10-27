module.exports.objToArray = function(source) {
  // 연관 오브젝트를 배열로 변환, 키값은 property 로 변환
  var result = [];
  Object.keys(source).map((key, i, a) => {
    result.push(source[key]);
  });
  return result;
};
