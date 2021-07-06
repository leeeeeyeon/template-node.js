var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var url = require('url');
var db = require('./db');
var template = require('./template.js');

exports.home = function(request, response){
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
            response.writeHead(200);
            response.end(html);
        });
      }); 
}

exports.create_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        
        db.query(`
          INSERT INTO author (name)
            VALUES(?)`,
            [post.name],
            function(error, result){
              if(error) throw error;
              response.writeHead(302, {Location: `/author`});
              response.end();
            }
            );
    });
}

exports.update = function(request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        if(error) throw error;
        db.query(`SELECT * FROM author`, function(error2, authors){
            if(error2) throw error2;
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`,[queryData.id], function(error3, author){
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
                            <input type="hidden" name="id" value="${queryData.id}">
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
                response.writeHead(200);
                response.end(html);
            });
        });
      }); 
}

exports.update_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        
        db.query(`
          UPDATE author SET name=? WHERE id=?`,
            [post.name, post.id],
            function(error, result){
              if(error) throw error;
              response.writeHead(302, {Location: `/author`});
              response.end();
            }
            );
    });
}

exports.delete_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        db.query(`DELETE FROM topic WHERE author_id=?`,
        [post.id], function(error1, result){
            if(error1) throw error1;
            db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error2, result){
                if(error2) throw error;
                response.writeHead(302, {Location: `/author`});
                response.end();
              });
        });
    });
}