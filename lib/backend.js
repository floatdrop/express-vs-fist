'use strict';

/**
 * Это настоящий бэкенд, все его вызовы я вынес
 * в отдельный модуль чтобы разные приложения могли им пользоваться
 * */

//  ручка авторизации
//  нужно передать id сессии
exports.sessid = function (sessid, done) {
    setTimeout(function () {
        done(null, {
            id: 0,
            login: 'golyshevd'
        });
    }, 50);
};

//  Ручка сообщений пользователя
exports.messages = function (userId, done) {
    setTimeout(function () {
        done(null, [
            {
                header: 'Я в ужасе!',
                message: 'Привет, забери своего кота, ' +
                         'он ободрал мне всю мебель!'
            },
            {
                header: 'У меня идея',
                message: 'Привет, я придумал как решить наш спор, ' +
                       'подробности при встрече'
            }
        ]);
    }, 50);
};

//  статус пользователя, необходимо передать id пользователя
exports.status = function (userId, done) {
    setTimeout(function () {
        done(null, {
            role: 'user',
            canReadNews: true
        });
    }, 50);
};

//  ручка новостей
exports.news = function (done) {
    setTimeout(function () {
        done(null, [
            {
                title: 'День рождения портала',
                content: 'Сегодня у нашего портала день рождения!'
            },
            {
                title: 'Отладочные работы на сервере',
                content: 'Сегодня в 19:00 на сервере будут проходить ' +
                    'профилактические работы, сервис может быть не доступен.'
            }
        ]);
    }, 50);
};
