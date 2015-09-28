var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');

var mongoUri = 'mongodb://localhost/peertopeer';
mongoose.connect(mongoUri);
var db = mongoose.connection;

db.on('error', function(){
    throw new Error('unable to connect to database at ' + mongoUri);
});

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
app.set('io', io);
app.set('port', process.env.PORT || 3003);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'client')));
app.use(function(req, res, next) {
    if (req.user) {

        //prevents sending user's password to client
        var userPayload = {
            email: req.user.email,
            _id: req.user._id,
            cashBalance: req.user.cashBalance,
            messages: req.user.messages,   // any messages the user had of they were offline
            online: true
        };
        console.log(userPayload)
        res.cookie('user', JSON.stringify(userPayload));
    }
    next();
});

require('./server/models/user.model');
var router = require('./server/resources')(app);

http.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;