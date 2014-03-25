'use strict';

var Fist = require('fist/Framework');

var app = new Fist();
var backend = require('./lib/backend');

//  Узел авторизации
//  При любой ошибке бэкенда отправляем 403
app.decl('auth', function (track, errors, result, done) {
    backend.auth(track.cookie('sessionid'), function (err, res) {

        if ( err ) {
            track.send(403);

            return;
        }

        done.apply(this, arguments);
    });
});

//  Узел статуса пользователя
app.decl('status', ['auth'], function (track, errors, result, done) {
    backend.status(result.auth.id, done);
});

//  Усзел списка дел пользователя
app.decl('deals', ['auth'], function (track, errors, result, done) {
    backend.deals(result.auth.id, done);
});

//  Узел ленты новостей, новости может видеть не каждый
app.decl('news', ['status'], function (track, errors, result, done) {

    if ( result.status.canReadPortalNews ) {
        backend.news(done);

        return;
    }

    track.send(403);
});

//  Отображает страницу профиля
app.decl('userProfilePage', [
    'status', 'deals', 'auth'],
    function (track, errors, result) {
        track.send(result);
    });

//  Отображает страницу новостей
app.decl('newsPage', ['news', 'auth'], function (track, errors, result) {
    track.send(result);
});

//  настройка роутера
app.route('GET', '/profile/', 'userProfilePage');
app.route('GET', '/news/', 'newsPage');

app.listen(1337);
