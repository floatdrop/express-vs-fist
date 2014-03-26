'use strict';

var Express = require('express');

var app = Express();
var backend = require('./lib/backend');

var cookies = Express.cookieParser();

//  авторизация (не работает без cookies)
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

//  дела пользователя (не работает без sessid)
function todos (rq, res, next) {
    backend.todo(rq.sessid.id, function (err, res) {
        rq.todos = res;
        next();
    });
}

//  Список пользователей
function users (rq, rs, next) {
    backend.users(function (err, res) {
        rq.users = res;
        next();
    });
}

//  прослойка рекламы (ни от чего не зависит)
function ads (rq, rs, next) {
    backend.ads(function (err, res) {
        rq.ads = res;
        next();
    });
}

//  robots.txt
app.get('/robots.txt', function (rq, rs) {
    rs.type('text');
    rs.send([
        'Host: ' + rq.host,
        'User-agent: *'
    ].join('\n'));
});

//  Главная страница (список пользователей)
app.get('/',
    //  cookies, ads, users
    cookiesAdsUsers,
    sessid,
    function (rq, rs) {
    rs.send({
        sessid: rq.sessid,
        users: rq.users,
        ads: rq.ads
    });
});

//  Параллельно вызывает ads, users, cookies
function cookiesAdsUsers (rq, rs, next) {

    var remaining = 3;

    function done () {
        remaining -= 1;

        if ( 0 === remaining ) {
            next();
        }
    }

    cookies(rq, rs, done);
    ads(rq, rs, done);
    users(rq, rs, done);
}

// страница профиля
app.get('/todo/',
    cookies,
    sessid,
    auth,
//    status, todos,
    statusTodos,
    function (rq, rs) {
        rs.send({
            sessid: rq.sessid,
            status: rq.status,
            todos: rq.todos
        });
    });

//  параллельно вызывает status и todos
function statusTodos (rq, rs, next) {

    var remaining = 2;

    function done () {
        remaining -= 1;

        if ( 0 === remaining ) {
            next();
        }
    }

    status(rq, rs, done);
    todos(rq, rs, done);
}

app.listen(1338);
