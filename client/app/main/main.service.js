angular.module('PeerToPeerApp')
    .service('MainService', function ($q, HttpService, MAIN_CONSTANTS) {

        this.getCurrentUser = function (userId) {
            var deferred = $q.defer();
            HttpService.get(MAIN_CONSTANTS.URIS.GET_USER + userId)
                .success(function (user) {
                    deferred.resolve(user);
                }).catch(function () {

                });
            return deferred.promise;
        };

        this.sendMoney = function (receiverEmail, senderEmail, cashAmount, transactionType) {
            var deferred = $q.defer();
            var payload = {
                receiverEmail : receiverEmail,
                senderEmail: senderEmail,
                cashAmount: cashAmount,
                transactionType: transactionType
            };

            console.log('payload in service is');
            console.log(payload);
            HttpService.post(MAIN_CONSTANTS.URIS.SEND_MONEY_BASE, payload)
                .success(function () {
                    var result = {
                        type: 'success',
                        msg: 'Successfully sent money to ' + receiverEmail
                    };
                    deferred.resolve(result);
                }).catch(function (res) {
                    var result = {
                        type: 'error',
                        msg: res.data.message
                    };
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        this.requestMoney = function (receiverEmail, senderEmail, cashAmount) {

            var deferred = $q.defer();
            var payload = {
                receiverEmail : receiverEmail,
                senderEmail: senderEmail,
                cashAmount: cashAmount
            };
            HttpService.post(MAIN_CONSTANTS.URIS.REQUEST_MONEY_BASE, payload)
                .success(function () {
                    var result = {
                        type: 'success',
                        msg: 'Request Successfully submitted to ' + receiverEmail
                    };
                    deferred.resolve(result);
                }).catch(function (res) {
                    var result = {
                        type: 'error',
                        msg: res.data.message
                    };
                    deferred.reject(result);
                });
            return deferred.promise;

        }
    });
