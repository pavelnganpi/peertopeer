'use strict';

var express = require('express');
var router = express.Router();
var transactionController = require("./transaction.controller")();

router.get('/:userId', function(req, res, next) {
    next();
}, transactionController.getTransactions);

router.post('/update', function(req, res, next) {
    next();
}, transactionController.updateTransaction);

module.exports = router;
