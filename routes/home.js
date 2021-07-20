const express = require('express');
const router = express.Router();

// 파일 분리
const db = require('../lib/db.js');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');

// 메인 화면
router.get('/', function(request, response){
    // console.log('/', request.user);
    db.query(`SELECT * FROM topic`, function(error, topics){
      if(error) throw error;

      var title = 'Welcome';
      var description = 'Hello, Node.js';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `
        <h2>${title}</h2>${description}
        <img src="/images/squirrel.jpg" style="width: 300px; display: block; margin-top" 10px">
        `,
        `<a href="/topic/create">create</a>`,
        auth.statusUI(request, response)
      );
      response.send(html);
    });
  });

  module.exports = router;