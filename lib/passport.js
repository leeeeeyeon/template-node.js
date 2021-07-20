const db = require('../lib/db.js');

module.exports = function(app){
    const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session()); // 세션 이후에 serializeUser 등 세션 이용하는 메서드들 작성

    passport.serializeUser(function(user, done){
        // console.log('serializeUser', user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        var userinfo;
        db.query('SELECT * FROM auth WHERE id=?', [id],
            function(err, result){
                if(err) throw err;
                // console.log('deserializeUser', result);
                var json = JSON.stringify(result[0]);
                userinfo = JSON.parse(json);
                done(null, userinfo);
        });
    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'id'
            // passwordField: 'password'
        },
        function(username, password, done){
            db.query('SELECT * FROM auth WHERE id=? AND password=?', [username, password],
                function(err, result){
                    // console.log('result', result);
                    if(err) throw err;
                    if(result.length == 0){ // 입력한 id, password와 일치하는 회원정보가 없는 경우
                        return done(null, false, { message: 'Incorrect' });
                    } else{
                        var json = JSON.stringify(result[0]);
                        var userinfo = JSON.parse(json);
                        // console.log('userinfo', userinfo);
                        return done(null, userinfo);
                    }
                });
        }
    ));

    return passport;
}