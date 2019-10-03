var mysql = require('mysql');

var mysql_connection = mysql.createConnection({
  host: 'hawkbro.cafe24app.com',
  port: '3306',
  user: 'hawkbro',
  password: 'ghzmqmfhskQmssha',
  database: 'hawkbro',
});

module.exports = mysql_connection;
