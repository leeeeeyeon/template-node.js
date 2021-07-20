const sanitizeHtml = require('sanitize-html');

module.exports = {
  HTML:function(title, list, body, control,
    authStatusUI='<a href="/auth/login">login</a> | <a href="/auth/register">register</a>'){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <p>새로고침을 해야 로그인이 반영돼요 ㅠㅅㅠ</p>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  }
  ,list:function(topics){ // 게시글 리스트
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/topic/${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}
