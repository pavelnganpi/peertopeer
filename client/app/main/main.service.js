angular.module('PeerToPeerApp')
    .service('MainService', function ($q, HttpService) {

        this.getCurrentUser = function (userId) {
            var deferred = $q.defer();
            HttpService.get('/main/users/' + userId)
                .success(function (user) {
                    deferred.resolve(user);
                }).catch(function () {

                });
            return deferred.promise;
        };

        this.sendMoney = function (receiverEmail, senderEmail, cashAmount) {
            var deferred = $q.defer();
            var payload = {
                receiverEmail : receiverEmail,
                senderEmail: senderEmail,
                cashAmount: cashAmount
            };
            HttpService.post('/main/send', payload)
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
            HttpService.post('/main/request', payload)
                .success(function () {
                    var result = {
                        type: 'success',
                        msg: 'Request Successfully submitted to ' + receiverEmail
                    };
                    deferred.resolve(result);
                }).catch(function (res) {
                    console.log('errrr');
                    console.log(res);
                    var result = {
                        type: 'error',
                        msg: res.data.message
                    };
                    deferred.reject(result);
                });
            return deferred.promise;

        }
    });
