'use strict';

var Express = require('express');

var app = Express();
var backend = require('./lib/backend');

var cookieParser = Express.cookieParser();

//  авторизация (не работает без cookieParser)
function sessid (rq, rs, next) {
    backend.sessid(rq.cookies.sessid, function (err, res) {
        rq.sessid = res;
        next();
    });
}

//  обязательная авторизация (не работает без sessid)
function auth (rq, rs, next) {

    if ( !rq.sessid ) {
        rs.send(403);

        return;
    }

    next();
}

//  status (не работает без sessid)
function status (rq, rs, next) {
    backend.status(rq.sessid.id, function (err, res) {
        rq.status = res;
        next();
    });
}

//  сообщения пользователя (не работает без sessid)
function messages (rq, res, next) {
    backend.messages(rq.sessid.id, function (err, res) {
        rq.messages = res;
        next();
    });
}

//  параллельно вызывает status и messages
function statusAndMessages (rq, rs, next) {

    var remaining = 2;

    function done () {
        remaining -= 1;

        if ( 0 === remaining ) {
            next();
        }
    }

    status(rq, rs, done);
    messages(rq, rs, done);
}

//  news (не работает без status)
function news (rq, rs, next) {

    if ( rq.status.canReadNews ) {
        backend.news(function (err, res) {
            rq.news = res;
            next();
        });

        return;
    }

    rs.send(403);
}

//  robots.txt
app.get('/robots.txt', function (rq, rs) {
    rs.type('text');
    rs.send([
        'Host: ' + rq.host,
        'User-agent: *'
    ].join('\n'));
});

//  страница новостей
app.get('/news/', cookieParser, sessid, auth, status, news, function (rq, rs) {
    rs.send({
        sessid: rq.sessid,
        news: rq.news
    });
});

// страница профиля
app.get('/profile/', cookieParser, sessid, auth,
//    status, messages,     //  ТАК НЕ ОПТИМАЛЬНО, лучше параллельно
    statusAndMessages, function (rq, rs) {
        rs.send({
            sessid: rq.sessid,
            status: rq.status,
            messages: rq.messages
        });
    });

app.listen(1338);
