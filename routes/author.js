const express = require('express');
const router = express.Router();

// 모듈 사용 
const sanitizeHtml = require('sanitize-html');

// 파일 분리
const db = require('../lib/db');
const template = require('../lib/template.js');

// 저자 목록
router.get('/', function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error2) throw error2;
            var title = 'Author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `
                ${template.authorTable(authors)}
                <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
                </style>
                
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    <p>
                    <p>
                        <input type="submit" value="create">
                    <p>
                </form>
                `,
                ``
            );
            response.send(html);
        });
      });  
});

// 저자 생성
router.post('/create_process', function(request, response){
    var post = request.body;
    var name = post.name;
    
    db.query(`
        INSERT INTO author (name)
        VALUES(?)`,
        [name],
        function(error, result){
            if(error) throw error;
            response.redirect(`/author`);
        }
        );
});

// 저자 수정
router.get('/update/:pageId', function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error2) throw error2;
            db.query(`SELECT * FROM author WHERE id=?`,[request.params.pageId], function(error3, author){
                if(error3) throw error3;
                var title = 'Author';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                  `
                    ${template.authorTable(authors)}
                    <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                    </style>
                    
                    <form action="/author/update_process" method="post">
                        <p>
                            <input type="hidden" name="id" value="${request.params.pageId}">
                        <p>
                        <p>
                            <input type="text" name="name" value="${sanitizeHtml(author[0].name)}" placeholder="name">
                        <p>
                        <p>
                            <input type="submit" value="update">
                        <p>
                    </form>
                    `,
                    ``
                );
                response.send(html);
            });
        });
      }); 
});

router.post('/update_process', function(request, response){
    var post = request.body;
    var name = post.name;
    var id = post.id;

    db.query(`
        UPDATE author SET name=? WHERE id=?`,
        [name, id],
        function(error, result){
            if(error) throw error;
            response.redirect(`/author`);
        }
        );
});

// 저자 삭제
router.post('/delete_process', function(request, response){
    var post = request.body;
    var id = post.id;
    db.query(`DELETE FROM topic WHERE author_id=?`,
    [id], function(error1, result){
        if(error1) throw error1;
        db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error2, result){
            if(error2) throw error;

            response.redirect('/author');
            });
    });
});

module.exports = router;