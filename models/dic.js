const mysql = require('mysql2/promise');
var conn;

(async () => {
  conn = await mysql.createConnection({
    host: 'hawkbro.cafe24app.com',
    port: '3306',
    user: 'hawkbro',
    password: 'ghzmqmfhskQmssha',
    database: 'hawkbro',
  });
})();

/**
 * 모든 리스트를 조회
 */
async function getAllList() {
  const [
    rows,
    fields,
  ] = await conn.query(`SELECT T.*, U.codename AS creatorname FROM opr_translate T
                            INNER JOIN opr_user U ON T.creator = U.id
                        ORDER BY id`);

  return rows;
}

/**
 * 사전을 등록
 * @param { String } english - 원문
 * @param { String } korean - 번역한 한글
 */
async function add(english, korean) {
  try {
    const result = await conn.query(
      `insert into opr_translate (english, korean, createtime, updatetime, creator, updater) 
    VALUES (?, ?, NOW(), NOW(), 1, 1)`,
      [english.toLowerCase(), korean.toLowerCase()],
    );

    return [true, result];
  } catch (err) {
    return [false, err.code];
  }
}

/**
 * 문장을 가지고 단어단위로 번역함
 * @param { String } keyword - 검색어
 */
async function search(keyword) {
  var bunch = keyword.split(' ');
  var result = [];

  for (var v of bunch) {
    var query = `SELECT english, korean FROM opr_translate WHERE english = ?`;

    const [rows] = await conn.query(query, v);
    if (rows.length > 0) result.push(rows[0].korean);
    else result.push(v);
  }

  return result.join(' ');
}

module.exports = { getAllList, add, search };
