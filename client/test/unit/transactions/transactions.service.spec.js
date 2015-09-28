'use strict';

describe('Service: MainService', function () {

    // load the controller's module
    beforeEach(module('PeerToPeerApp'));

    var httpBackend, TRANSACTION_CONSTANTS, q, TransactionsService, filter;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        filter = $injector.get('$filter');
        TRANSACTION_CONSTANTS = $injector.get('TRANSACTION_CONSTANTS');
        q = $injector.get('$q');
        httpBackend = $injector.get('$httpBackend');
        TransactionsService = $injector.get('TransactionsService');
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('getTransactions, should return a promise containing all transactions of a user', function () {

        var userPayload ={
            email: 'pav@email.com',
            'userId': 1
        };

        var transactionsPayload = {
            sentTransactions:{
                receivers:['pav'],
                cashAmount:[2],
                createdAt: [new Date()]

            },
            requestedTransactions:{
                receivers:['mama'],
                cashAmount:[4],
                createdAt: [new Date()]
                
            },
            receivedTransactions:{
                senders:['marc'],
                cashAmount:[89],
                createdAt: [new Date()],
                transactionType: ['Send Money'],
                status: ['Accepted'],
                index: [0]

            }
        };
        httpBackend.whenGET(TRANSACTION_CONSTANTS.URIS.TRANSACTIONS + userPayload.userId).respond(200, transactionsPayload);
        TransactionsService.getTransactions(userPayload.userId)
            .then(
            function (res) {
                expect(res).toEqual(transactionsPayload);
            });
        httpBackend.flush();
    });

    it('getTransactions, should return a promise containing an error message for getting transactions for an invalid user', function () {

        var userPayload ={
            email: 'pav@email.com',
            'userId': 1
        };

        var result = {
            type: 'error',
            msg: 'not found'
        };
        httpBackend.whenGET(TRANSACTION_CONSTANTS.URIS.TRANSACTIONS + userPayload.userId).respond(400, result);
        TransactionsService.getTransactions(userPayload.userId)
            .then(
            function (res) {
                expect(res).toEqual(result);
            });
        httpBackend.flush();
    });

    it('respondToMoneyRequest, should return a promise containing a success message for successfully responding to a money request', function () {

        var receivedTransaction = {
            sender: 'pav',
            cashAmount: 9,
            createdAt: new Date(),
            index: 1
        };

        var messagePayload = {
            requesterEmail: receivedTransaction.sender,
            receiverEmail: 'mama@email.com',
            cashAmount: receivedTransaction.cashAmount,
            status: 'Declined',
            date: receivedTransaction.createdAt,
            index: receivedTransaction.index,
            responseType: 'Declined'
        };
        var result = {
            type: 'success',
            msg: 'Successfully declined ' + messagePayload.requesterEmail + ' request'
        };

        httpBackend.whenPOST(TRANSACTION_CONSTANTS.URIS.TRANSACTIONS_UPDATE).respond(200, messagePayload);
        TransactionsService.respondToMoneyRequest(receivedTransaction, messagePayload.receiverEmail, 'Declined')
            .then(
            function (res) {
                expect(res).toEqual(result);
            });
        httpBackend.flush();
    });

    it('respondToMoneyRequest, should return a promise containing an error message for not successfully responding to a money request', function () {

        var receivedTransaction = {
            sender: 'pav',
            cashAmount: 9,
            createdAt: new Date(),
            index: 1
        };

        var messagePayload = {
            requesterEmail: receivedTransaction.sender,
            receiverEmail: 'mama@email.com',
            cashAmount: receivedTransaction.cashAmount,
            status: 'Declined',
            date: receivedTransaction.createdAt,
            index: receivedTransaction.index,
            responseType: 'Declined'
        };
        var result = {
            type: 'error',
            msg: 'Error declining ' + messagePayload.requesterEmail + ' request. Please try again'
        };

        httpBackend.whenPOST(TRANSACTION_CONSTANTS.URIS.TRANSACTIONS_UPDATE).respond(400, messagePayload);
        TransactionsService.respondToMoneyRequest(receivedTransaction, messagePayload.receiverEmail, 'Declined')
            .then(
            function (res) {
                expect(res).toEqual(result);
            });
        httpBackend.flush();
    });

});