'use strict';

var Fist = require('fist/Framework');

var app = new Fist();
var backend = require('./lib/backend');

//  рекламный блок
app.decl('ads', function (track, errors, result, done) {
    backend.ads(done);
});

//  Узел авторизации
app.decl('sessid', function (track, errors, result, done) {
    backend.sessid(track.cookie('sessid'), done);
});

//  Обязательная авторизация
app.decl('auth', ['sessid'], function (track, errors) {

    if ( errors.sessid ) {
        track.send(403);

        return false;
    }

    return true;
});

//  Узел статуса пользователя
app.decl('status', [
    'auth', 'sessid'
], function (track, errors, result, done) {
    backend.status(result.sessid.id, done);
});

//  Узел списка дел пользователя
app.decl('todos', [
    'auth', 'sessid'
], function (track, errors, result, done) {
    backend.todo(result.sessid.id, done);
});

//  Узел списка пользователей
app.decl('users', function (track, errors, result, done) {
    backend.users(done);
});

//  Отображает страницу дел пользователя
app.decl('todoPage', [
    'status', 'todos', 'sessid'
], function (track, errors, result) {
    track.send(result);
});

//  Отображает страницу пользователей
app.decl('usersPage', [
    'users', 'sessid', 'ads'
], function (track, errors, result) {
    track.send(result);
});

//  robots.txt
app.decl('robots', function (track) {
    track.send([
        'Host: ' + track.url.hostname,
        'User-agent: *'
    ].join('\n'));
});

//  настройка роутера
app.route('GET', '/robots.txt', 'robots');
app.route('GET', '/', 'usersPage');
app.route('GET', '/todo/', 'todoPage');

app.listen(1337);
