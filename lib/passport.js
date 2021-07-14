module.exports = function(app){
    const authData = {
        id:'leeeeeyeon',
        password: '1',
        nickname: 'leeeeeyeon'
    }

    const passport = require('passport')
    , LocalStrategy = require('passport-local')
    .Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(user, done){
        done(null, authData);
    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'id'
            // passwordField: 'password'
        },
        function(username, password, done){
            if(username === authData.id){
                if(password === authData.password){ // 로그인 성공
                    return done(null, authData);
                } else{ // 비밀번호 다름
                    return done(null, false, {
                        message: 'Incorrect password'
                    });
                }
            } else{ // 아이디 다름
                return done(null, false, {
                    message: 'Incorrect username'
                });
            }
        }
    ));

    return passport;
}