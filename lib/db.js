var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b2444c51b8bc05',
    password: '6e116f20',
    database: 'heroku_6c15c1a9e25a849'
  });
  db.connect();

  module.exports = db;