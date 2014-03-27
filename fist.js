'use strict';

var Fist = require('fist/Framework');

//  создание приложения
var app = new Fist();
//  бэкенд
var backend = require('./lib/backend');

//  Отображает страницу дел пользователя
app.decl('todoPage', [
    'status', 'todos', 'sessid'
], function (track, errors, result) {
    track.send(result);
});

//  Узел статуса пользователя
app.decl('status', ['sessid'], function (track, errors, result, done) {
    backend.status(result.sessid.id, done);
});

//  Узел списка дел пользователя
app.decl('todos', ['sessid'], function (track, errors, result, done) {
    backend.todo(result.sessid.id, done);
});

//  Узел авторизации
app.decl('sessid', function (track, errors, result, done) {
    backend.sessid(track.cookie('sessid'), done);
});

//  ассоциация маршрута с узлом
app.route('GET', '/todo/', 'todoPage');

//  ДРУГИЕ СТРАНИЦЫ

//  рекламный блок
app.decl('ads', function (track, errors, result, done) {
    backend.ads(done);
});

//  Узел списка пользователей
app.decl('users', function (track, errors, result, done) {
    backend.users(done);
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

app.listen(1337);
