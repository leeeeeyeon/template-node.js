const sanitizeHtml = require('sanitize-html');

module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
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
  ,authorSelect:function(authors, author_id){ // 저자 선택 기능
    var tag = '';
    var i = 0;
    while(i<authors.length){
      var selected = '';
      if(authors[i].id===author_id){
        selected = 'selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`
      i++;
    }

    return `
      <select name="author">
      ${tag}
    </select>
    `;
  }
  ,authorTable:function(authors){ // 저자 목록
    var tag = '<table>';
    var i = 0;
    while(i<authors.length){
        tag += `
        <tr>
            <td>${sanitizeHtml(authors[i].name)}</td>
            <td><a href="/author/update/${authors[i].id}">update</a></td>
            <td>
              <form action="author/delete_process" method="post">
                <input type="hidden" name="id" value="${authors[i].id}">
                <input type="submit" value="delete">
              </form>
            </td>
        </tr>
      `;
      i++;
    }
    tag += '</table>';

    return tag;
  }
}
