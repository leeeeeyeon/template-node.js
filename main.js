const express = require('express');
const app = express();

// 미들웨어 불러오기
const compression = require('compression');
const helmet = require('helmet');

// 라우팅 불러오기
const homeRouter = require('./routes/home.js');
const topicRouter = require('./routes/topic.js');
const authorRouter = require('./routes/author.js');

// 미들웨이 사용
app.use(express.urlencoded({extended:false}));
app.use(compression());
app.use(express.static('public'));
app.use(helmet());

// 라우팅 사용
app.use('/topic', topicRouter);
app.use('/', homeRouter);
app.use('/author', authorRouter);

// 오류 처리
app.use(function(req, res, next){
    res.status(404).send('404 - Sorry cannot find that!');
 });

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('500 - Something broke!');
});

app.listen(3000);

// const PORT = process.env.PORT;
// app.listen(PORT);