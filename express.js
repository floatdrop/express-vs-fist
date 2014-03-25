'use strict';

var Express = require('express');

var app = Express();
var backend = require('./lib/backend');

app.use(Express.cookieParser());

// страница профиля
app.get('/profile/', function (request, response) {

    //  сначала надо авторизоваться
    backend.auth(request.cookies.sessionid, function (err, res) {

        //  ошибка авторизации
        if ( err ) {
            response.send(403);

            return;
        }

        //  на странице надо отобразить
        //  данные авторизации
        //  статус пользователя
        //  список его дел
        var result = {
            auth: res
        };

        var remaining = 2;

        function done () {
            remaining -= 1;

            if ( 0 === remaining ) {
                response.send(result);
            }
        }

        //  загружаем статуст пользователя
        backend.status(res.id, function (err, res) {
            result.status = res;
            done();
        });

        //  загружаем список дел пользователя
        backend.deals(res.id, function (err, res) {
            result.deals = res;
            done();
        });
    });

});

//  страница новостей
app.get('/news/', function (request, response) {

    //  требуется авторизация
    backend.auth(request.cookies.sessionid, function (err, res) {

        //  ошибка авториазации
        if ( err ) {
            response.send(403);

            return;
        }

        //  надо отобразить
        //  данные авторизации
        //  ленту новостей
        var result = {
            auth: res
        };

        //  загружаем статус пользователя чтобы узнать
        //  может ли он читать новости
        backend.status(res.id, function (err, res) {
            /*eslint max-nested-callbacks: [2, 4]*/
            if ( res.canReadPortalNews ) {
                //  загружаем ленту новостей
                backend.news(function (err, res) {
                    result.news = res;
                    response.send(result);
                });

                return;
            }

            //  не может
            response.send(403);
        });
    });
});

app.listen(1338);
