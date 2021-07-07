/*
var express = require('express');
var app = express();

app.get('/', function(req, res){
  fs.readdir('./data', function(error, filelist){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
});

app.get('/page', function(req, res){
  return res.send('/page');
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
*/

var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var db = require('./lib/db');
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');

const PORT = process.env.PORT;

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){ // 메인 페이지
        topic.home(request, response);
      } else { // 상세 글
        topic.page(request, response);
      }
    } else if(pathname === '/create'){ // 생성
        topic.create(request, response);
    } else if(pathname === '/create_process'){ // 생성 submit
        topic.create_process(request, response);
    } else if(pathname === '/update'){ // 수정
        topic.update(request, response);
    } else if(pathname === '/update_process'){ // 수정 submit
        topic.update_process(request, response);
    } else if(pathname === '/delete_process'){ // 삭제
        topic.delete_process(request, response);
    } else if(pathname === '/author'){
        author.home(request, response);
    } else if(pathname === '/author/create_process'){
      author.create_process(request, response);
    } else if(pathname === '/author/update'){
      author.update(request, response);
    } else if(pathname === '/author/update_process'){
      author.update_process(request, response);
    } else if(pathname === '/author/delete_process'){
      author.delete_process(request, response);
    }  
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});

app.listen(PORT);
