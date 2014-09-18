var Fist = require('fist/Framework');
var app = new Fist();
var backend = require('./lib/backend');

app.decl('todoPage', [
    'status',
    'todos',
    'sessid'
], function (track, errors, result) {
    track.send({
        sessid: result.sessid,
        status: result.status,
        todos: result.todos
    });
});

app.decl('status', ['sessid'], function (track, errors, result, done) {
    backend.status(result.sessid.id, done);
});

app.decl('todos', ['sessid'], function (track, errors, result, done) {
    backend.todo(result.sessid.id, done);
});

app.decl('sessid', function (track, errors, result, done) {
    backend.sessid(track.cookie('sessid'), done);
});

app.route('GET', '/todo/', 'todoPage');

app.decl('ads', function (track, errors, result, done) {
    backend.ads(done);
});

app.decl('users', function (track, errors, result, done) {
    backend.users(done);
});

app.decl('usersPage', [
    'users',
    'sessid',
    'ads'
], function (track, errors, result) {
    track.send({
        sessid: result.sessid,
        users: result.users,
        ads: result.ads
    });
});

app.decl('robots', function (track) {
    track.send([ 'Host: ' + track.url.hostname, 'User-agent: *' ].join('\n'));
});

app.route('GET', '/robots.txt', 'robots');
app.route('GET', '/', 'usersPage');

app.listen(1337);
