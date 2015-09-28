'use strict';

describe('Service: MainService', function () {

    // load the controller's module
    beforeEach(module('PeerToPeerApp'));

    var httpBackend, MAIN_CONSTANTS, q, MainService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($injector) {
        MAIN_CONSTANTS = $injector.get('MAIN_CONSTANTS');
        q = $injector.get('$q');
        httpBackend = $injector.get('$httpBackend');
        MainService = $injector.get('MainService');
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('getCurrentUser, should return a promise containing a currentUser same as userPayload', function () {
        var userPayload = {
            user: {
                email: 'pav@email.com',
                userId: 1
            }
        };
        httpBackend.whenGET(MAIN_CONSTANTS.URIS.GET_USER + userPayload.user.userId).respond(200, userPayload);
        MainService.getCurrentUser(userPayload.user.userId)
            .then(
            function (res) {
                expect(res.user).toEqual(userPayload.user);
            });
        httpBackend.flush();
    });

    it('sendMoney, should return a promise containing a success message for successfully sending money', function () {
        var payload = {
            receiverEmail : 'pav@email.com',
            senderEmail: 'mama@emai.com',
            cashAmount: '2.2',
            transactionType: 'Send Money'
        };

        var result = {
            type: 'success',
            msg: 'Successfully sent money to ' + payload.receiverEmail
        };

        httpBackend.whenPOST(MAIN_CONSTANTS.URIS.SEND_MONEY_BASE).respond(201, payload);
        MainService.sendMoney(payload.receiverEmail, payload.senderEmail, payload.cashAmount, payload.transactionType)
            .then(
            function (res) {
                expect(res).toEqual(result);
            });
        httpBackend.flush();
    });


    it('sendMoney, should return a promise containing an error message for not successfully sending money', function () {
        var payload = {
            receiverEmail : 'pav@email.com',
            senderEmail: 'mama@emai.com',
            cashAmount: '2.2',
            transactionType: 'Send Money'
        };

        var error = {
            data: {
                message: 'user not found'
            }
        };

        var result = {
            type: 'error',
            msg: error.data.message
        };

        httpBackend.whenPOST(MAIN_CONSTANTS.URIS.SEND_MONEY_BASE).respond(400, error);
        MainService.sendMoney(payload.receiverEmail, payload.senderEmail, payload.cashAmount, payload.transactionType)
            .then(
            function (res) {
                expect(res).toEqual(result);
            });
        httpBackend.flush();
    });

    it('requestMoney, should return a promise containing a success message for successfully requesting money', function () {
        var payload = {
            receiverEmail : 'pav@email.com',
            senderEmail: 'mama@emai.com',
            cashAmount: '2.2',
        };

        var result = {
            type: 'success',
            msg: 'Request Successfully submitted to ' + payload.receiverEmail
        };

        httpBackend.whenPOST(MAIN_CONSTANTS.URIS.REQUEST_MONEY_BASE).respond(201, payload);
        MainService.requestMoney(payload.receiverEmail, payload.senderEmail, payload.cashAmount)
            .then(
            function (res) {
                expect(res).toEqual(result);
            });
        httpBackend.flush();
    });

    it('requestMoney, should return a promise containing an error message for not successfully requesting money', function () {
        var payload = {
            receiverEmail : 'pav@email.com',
            senderEmail: 'mama@emai.com',
            cashAmount: '2.2',
        };
        var error = {
            data: {
                message: 'user not found'
            }
        };

        var result = {
            type: 'error',
            msg: error.data.message
        };
        httpBackend.whenPOST(MAIN_CONSTANTS.URIS.REQUEST_MONEY_BASE).respond(400, payload);
        MainService.requestMoney(payload.receiverEmail, payload.senderEmail, payload.cashAmount)
            .then(
            function (res) {
                expect(res).toEqual(result);
            });
        httpBackend.flush();
    });


});