const express = require('express');
const router = express.Router();

const sanitizeHtml = require('sanitize-html');

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
        db.query(`SELECT * FROM author`, function(error2, authors){

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
    });

    router.post('/login_process',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true
    }));

    router.get('/logout', function(request, response){
        request.logout();
        request.session.save(function(err){
          response.redirect('/');
        });
    });

    return router;
}
