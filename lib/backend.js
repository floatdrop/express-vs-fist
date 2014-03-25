'use strict';

/**
 * Это настоящий бэкенд, все его вызовы я вынес
 * в отдельный модуль чтобы разные приложения могли им пользоваться
 * */

//  ручка авторизации
//  нужно передать id сессии
exports.auth = function (sessionid, done) {
    setTimeout(function () {
        done(null, {
            id: 777,
            login: 'golyshevd'
        });
    }, 50);
};

//  ручка списка дел, необходимо передать id пользователя
exports.deals = function (userId, done) {
    setTimeout(function () {
        done(null, [
            {
                title: 'Сходить в магазин',
                descr: 'Нужно купить хлеб!'
            },
            {
                title: 'Поспать',
                descr: 'Хочу спать, сколько можно откладывать'
            }
        ]);
    }, 50);
};

//  статус пользователя, необходимо передать id пользователя
exports.status = function (userId, done) {
    setTimeout(function () {
        done(null, {
            completeDealsCount: 0,
            canReadPortalNews: true
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
