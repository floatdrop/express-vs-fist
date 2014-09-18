var express = require('express');
var app = express();
var backend = require('./lib/backend');
var async = require('async');
var cookies = express.cookieParser();

function sessid(rq, rs, next) {
    backend.sessid(rq.cookies.sessid, function (err, res) {
        rq.sessid = res;
        next();
    });
}

function status(rq, rs, next) {
    backend.status(rq.sessid.id, function (err, res) {
        rq.status = res;
        next();
    });
}

function todos(rq, res, next) {
    backend.todo(rq.sessid.id, function (err, res) {
        rq.todos = res;
        next();
    });
}

function statusTodos(rq, rs, next) {
    async.parallel([
        status.bind(null, rq, rs),
        todos.bind(null, rq, rs)
    ], next);
}

app.get('/todo/', cookies, sessid, statusTodos, function (rq, rs) {
    rs.send({ sessid: rq.sessid, status: rq.status, todos: rq.todos });
});

function users(rq, rs, next) {
    backend.users(function (err, res) {
        rq.users = res;
        next();
    });
}

function ads(rq, rs, next) {
    backend.ads(function (err, res) {
        rq.ads = res;
        next();
    });
}

app.get('/robots.txt', function (rq, rs) {
    rs.send([ 'Host: ' + rq.host, 'User-agent: *' ].join('\n'));
});

function cookiesAdsUsers(rq, rs, next) {
    async.parallel([
        cookies.bind(null, rq, rs),
        ads.bind(null, rq, rs),
        users.bind(null, rq, rs)
    ], next);
}

app.get('/', cookiesAdsUsers, sessid, function (rq, rs) {
    rs.send({
        sessid: rq.sessid,
        users: rq.users,
        ads: rq.ads
    });
});

app.listen(1338);
