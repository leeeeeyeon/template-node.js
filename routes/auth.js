const express = require('express');
const router = express.Router();

const sanitizeHtml = require('sanitize-html');
const shortid = require('shortid');

// 파일 분리
const db = require('../lib/db.js');
const template = require('../lib/template.js');

module.exports = function(passport){
    router.get('/login', function(request, response){
      var fmsg = request.flash();
      var feedback = '';
      if(fmsg.error){
        feedback = fmsg.error[0];
      }
      db.query(`SELECT * FROM topic`, function(error, topics){
        var title = 'Login';
        var list = template.list(topics);
        var html = template.HTML(sanitizeHtml(title), list,
          `
          <div style="color:red;">${feedback}</div>
          <form action="/auth/login_process" method="post">
            <p><input type="text" name="id" placeholder="id"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p>
              <input type="submit" value="login">
            </p>
          </form>
        `,
          ``
        );

        response.send(html);
      });
    });

    router.post('/login_process',
        passport.authenticate('local', {
            failureRedirect: '/auth/login',
            failureFlash: true 
        }), function(request, response){
            request.session.save(function(err){
              response.redirect('/');
            }
            );
        }
    );

    router.get('/register', function(request, response){
      var fmsg = request.flash();
      var feedback = '';
      if(fmsg.error){
        console.log(fmsg.error);
        feedback = fmsg.error[0];
      }
      var title = 'Register';
      var html = template.HTML(sanitizeHtml(title), '',
        `
        <div style="color:red;">${feedback}</div>
        <form action="/auth/register_process" method="post">
          <p><input type="text" name="id" placeholder="id"></p>
          <p><input type="password" name="password" placeholder="password"></p>
          <p><input type="password" name="password2" placeholder="password again"></p>
          <p><input type="text" name="nickname" placeholder="nickname"></p>
          <p>
            <input type="submit" value="register">
          </p>
        </form>
      `,
        ``
      );
      
      response.send(html);
    });

    router.post('/register_process', function(request, response){
      var post = request.body;
      var id = post.id;
      var password = post.password;
      var password2 = post.password2;
      var nickname = post.nickname;
      
      if(password !== password2){
        request.flash('error', 'Password must be same!');
        response.redirect('/auth/register');
      } else{
        var user = {
          count: shortid.generate(),
          id: id,
          password: password,
          nickname: nickname
        };
        db.query(`
          INSERT INTO auth SET ?`, user, function(error, result){
            if(error) throw error;
          }
        );
        request.login(user, function(err){
          return response.redirect(`/`);
        });
      }
    });

    router.get('/logout', function(request, response){
        request.logout();
        request.session.save(function(err){
          response.redirect('/');
        });
    });

    return router;
}
