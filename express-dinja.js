var express = require('express');
var app = express();
var backend = require('./lib/backend');
var cookies = express.cookieParser();
var inject = require('express-dinja')(app);

inject('cookies', cookies);

inject('sessid', function sessid(cookies, req, res, next) {
    backend.sessid(cookies.sessid, next);
});

inject('status', function status(sessid, req, res, next) {
    backend.status(sessid.id, next);
});

inject('todos', function todos(sessid, req, res, next) {
    backend.todo(sessid.id, next);
});

app.get('/todo/', function (sessid, status, todos, req, res) {
    res.send({
        sessid: sessid,
        status: status,
        todos: todos
    });
});

inject('users', function users(req, res, next) {
    backend.users(next);
});

inject('ads', function ads(req, res, next) {
    backend.ads(next);
});

app.get('/robots.txt', function (req, res) {
    res.send([ 'Host: ' + req.host, 'User-agent: *' ].join('\n'));
});

app.get('/', function (ads, users, sessid, req, res) {
    res.send({
        ads: ads,
        users: users,
        sessid: sessid
    });
});

app.listen(1338);
