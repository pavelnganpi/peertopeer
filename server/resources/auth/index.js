var express = require('express');
var router = express.Router();
var AuthController = require('./auth.controller')();

module.exports = function (app) {
    var passport = require('./passport.setup')(app);

    router.post('/login',
        passport.authenticate('local'),
        AuthController.login);

    router.post('/signup', AuthController.signup);

    router.post('/logout', AuthController.logout);

    return router;

};