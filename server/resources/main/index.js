'use strict';

var express = require('express');
var router = express.Router();
var mainController = require("./main.controller")();

router.post('/send', function(req, res, next) {
    next();
}, mainController.send);

router.post('/request', function(req, res, next) {
    next();
}, mainController.request);

router.get('/users/:userId', function(req, res, next) {
    next();
}, mainController.getUser);

module.exports = router;
