module.exports = {
    isLogin: function(request, response){ // 로그인 여부 확인
        if(request.user){
            return true;
        } else{
            return false;
        }
    },
    statusUI: function(request, response){
        var authStatusUI = '<a href="/auth/login">login</a>';
        if(this.isLogin(request, response)){
            authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
        }
    
        return authStatusUI;
    }
}