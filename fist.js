'use strict';

var Fist = require('fist/Framework');

var app = new Fist();
var backend = require('./lib/backend');

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

//  Узел списка сообщений пользователя
app.decl('messages', [
    'auth', 'sessid'
], function (track, errors, result, done) {
    backend.messages(result.sessid.id, done);
});

//  Узел ленты новостей, новости может видеть не каждый
app.decl('news', ['status'], function (track, errors, result, done) {

    if ( result.status.canReadNews ) {
        backend.news(done);

        return;
    }

    track.send(403);
});

//  Отображает страницу профиля
app.decl('profilePage', [
    'status', 'messages', 'sessid'
], function (track, errors, result) {
    track.send(result);
});

//  Отображает страницу новостей
app.decl('newsPage', [
    'news', 'sessid', 'ads'
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
app.route('GET', '/news/', 'newsPage');
app.route('GET', '/profile/', 'profilePage');

app.listen(1337);
