const mysql = require('mysql');

const dbConfig = {
    connectionLimit: 20,
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b2444c51b8bc05',
    password: '6e116f20',
    database: 'heroku_6c15c1a9e25a849'
  };
const db = mysql.createPool(dbConfig);

// const db = mysql.createConnection({
//     connectionLimit: 20,
//     host:'localhost',
//     user:'root',
//     password:'111111',
//     database:'web'
//   });

module.exports = db;