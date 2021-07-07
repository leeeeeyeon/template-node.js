var mysql = require('mysql');

var dbConfig = {
    connectionLimit: 20,
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b2444c51b8bc05',
    password: '6e116f20',
    database: 'heroku_6c15c1a9e25a849'
  };

var db = mysql.createPool(dbConfig);


module.exports = db;