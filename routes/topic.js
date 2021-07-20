const express = require('express');
const router = express.Router();

const sanitizeHtml = require('sanitize-html');
const shortid = require('shortid');

// 파일 분리
const db = require('../lib/db.js');
const template = require('../lib/template.js');
const auth = require('../lib/auth.js');

// 게시글 생성
router.get('/create', function(request, response){
  if(!auth.isLogin(request, response)){
    response.redirect('/');
    return false;
  }
  db.query(`SELECT * FROM topic`, function(error, topics){
    var title = 'Create';
    var list = template.list(topics);
    var html = template.HTML(sanitizeHtml(title), list,
      `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `,
    ``,
    auth.statusUI(request, response)
    );

    response.send(html);
  });
});

router.post('/create_process', function(request, response){
    if(!auth.isLogin(request, response)){
        response.redirect('/');
        return false;
    }
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = shortid.generate();
    
    var topic = {
      id: id,
      title: title,
      description: description,
      user_id: request.user.count
    };
    db.query(`
      INSERT INTO topic SET ?`,
        topic,
        function(error, result){
          if(error) throw error;
          response.redirect(`/topic/${id}`);
        }
        );
});

// 게시글 수정
router.get('/update/:pageId', function(request, response){
  if(!auth.isLogin(request, response)){
    response.redirect('/');
    return false;
  }
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error) throw error;
    db.query(`SELECT * FROM topic WHERE id=?`, [request.params.pageId], function(error2, topic){
      if(error2) throw error2;
      var list = template.list(topics);
      var html = template.HTML(sanitizeHtml(topic[0].title), list,
        `
        <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${topic[0].id}">
          <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
          <p>
            <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a>`,
        auth.statusUI(request, response)
      );
      response.send(html);
    });
  });
});

router.post('/update_process', function(request, response){
  if(!auth.isLogin(request, response)){
    response.redirect('/');
    return false;
  }
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    var count = request.user.count; // 로그인한 사람의 아이디
    
    db.query(`SELECT * FROM topic left join auth on count=user_id WHERE topic.title=?`,
    [title], function(error, topic){
      if(error) throw error;
      if(count !== topic[0].user_id){
        request.flash('error', 'You cannot edit it!');
        return response.redirect('/');
      } else{
          db.query(`UPDATE topic SET title=?, description=? WHERE id=?`,
          [title, description, id],
          function(error, result){
            if(error) throw error;
            response.redirect(`/topic/${id}`);
          });
      }
    });
});

// 게시글 삭제
router.post('/delete_process', function(request,response){
    if(!auth.isLogin(request, response)){
      response.redirect('/');
      return false;
    }
    var post = request.body;
    var id = post.id;
    var count = request.user.count; // 로그인 한 사용자
    db.query(`SELECT * FROM topic left join auth on count=user_id WHERE topic.id=?`,
    [id], function(error, topic){
      if(error) throw error;
      if(count !== topic[0].user_id){
        request.flash('error', 'You cannot delete it!');
        return response.redirect('/');
      } else{
          db.query(`DELETE FROM topic WHERE id=?`, [id], function(error, result){
            if(error){
              throw error;
            }
            response.redirect('/');
          });
      }
    });
});

// 상세글
router.get('/:pageId', function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
      if(error) throw error;
      db.query(`SELECT * FROM topic left join auth on user_id=count WHERE topic.id=?`,
      [request.params.pageId], function(error2, topic){
        if(error2) throw error2;
        var title = topic[0].title;
        var description = topic[0].description;
        var nickname = topic[0].nickname;
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${sanitizeHtml(title)}</h2>
          ${sanitizeHtml(description)}
          <p>by ${nickname}</p>`,
          `
          <a href="/topic/create">create</a>
          <a href="/topic/update/${request.params.pageId}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${request.params.pageId}">
            <input type="submit" value="delete">
          </form>
          `,
          auth.statusUI(request, response)
        );

        response.send(html);
      });
    });
});

module.exports = router;