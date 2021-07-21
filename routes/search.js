const { request } = require('express');
const express = require('express');
const router = express.Router();

const sanitizeHtml = require('sanitize-html');
const url = require('url');

// 파일 분리
const db = require('../lib/db.js');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');

router.get('/', function(request, response){
    // 쿼리값 추출
    const newUrl = new URL(request.url, 'http://localhost:3000/search');
    const urlParams = newUrl.searchParams;
    const query = urlParams.get('query');

    db.query(`SELECT * FROM topic`, function(error, topics){
        var title = `${query}`;
        var list = template.list(topics);
        var view = ``;
        
        db.query(`SELECT id, title FROM topic WHERE title LIKE ?`, `%${query}%`
        ,function(error2, result){
            if(error2) throw error2;
            for(var i in result){
              view += `
              <li><a href='/topic/${result[i].id}'>${result[i].title}</a></li>
            `;
            }
            var html = template.HTML(title, list,
                `
                <h2>${title} 검색 결과</h2>
                ${view}
                <br>
                <img src="/images/search.jpg" style="width: 450px; display: block; margin-top" 10px">
                `,
                ``,
                auth.statusUI(request, response)
              );
              response.send(html);
        });
    });
});

module.exports = router;