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
exports.todo = function (userId, done) {
    setTimeout(function () {
        done(null, [
            {
                header: 'Сходить в магазин',
                content: 'Дома совсем кончился хлеб!'
            },
            {
                header: 'Рыбки',
                content: 'Отыскать в интернете каких выбок можно ' +
                    'поселить вместе с барбусами и можно ли вообще'
            }
        ]);
    }, 50);
};

//  статус пользователя, необходимо передать id пользователя
exports.status = function (userId, done) {
    setTimeout(function () {
        done(null, {
            role: 'user'
        });
    }, 50);
};

//  ручка новостей
exports.users = function (done) {
    setTimeout(function () {
        done(null, [
            {
                login: 'golyshevd'
            },
            {
                login: 'zelenin'
            }
        ]);
    }, 50);
};

//  рекламные блоки
exports.ads = function (done) {
    setTimeout(function () {
        done(null, [
            {
                name: 'Реклама!',
                content: 'Новые альбомы на яндекс музыке!'
            }
        ]);
    }, 50);
};
