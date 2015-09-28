angular.module('PeerToPeerApp')
    .service('TransactionsService', function ($q, HttpService, TRANSACTION_CONSTANTS, $filter) {

        this.tabs = [
            {title: 'Sent Transactions', id: 'sentTransactions'},
            {title: 'Requested Transactions', id: 'requestedTransactions'},
            {title: 'Received Transactions', id: 'receivedTransactions'}
        ];

        this.getTransactions = function (userId) {

            var deferred = $q.defer();
            HttpService.get(TRANSACTION_CONSTANTS.URIS.TRANSACTIONS + userId)
                .success(function (result) {
                    deferred.resolve(result);
                })
                .catch(function (result) {
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        this.respondToMoneyRequest = function (receivedTransaction, receiverEmail, transactionStatus) {

            var message = {
                requesterEmail: receivedTransaction.sender,
                receiverEmail: receiverEmail,
                cashAmount: receivedTransaction.cashAmount,
                status: transactionStatus,
                date: receivedTransaction.createdAt,
                index: receivedTransaction.index,
                responseType: transactionStatus
            };
            var deferred = $q.defer();

            HttpService.post(TRANSACTION_CONSTANTS.URIS.TRANSACTIONS_UPDATE, message)
                .success(function () {
                    var result = {
                        type: 'success',
                        msg: 'Successfully declined ' + message.requesterEmail + ' request'
                    };
                    deferred.resolve(result);

                })
                .catch(function () {

                    var result = {
                        type: 'error',
                        msg: 'Error declining ' + message.requesterEmail + ' request. Please try again'
                    };
                    deferred.reject(result);
                });

            return deferred.promise;

        };


        //mines the data so as to make it easy to populate the table in
        //sent_transactions.html and requested_transactions.html
        this.sentAndRequestedTransactionsSetup = function (data) {

            var sentTransactions = [];

            for (var i = 0; i < data.receivers.length; i++) {
                var transactionPayload = {
                    receiver: data.receivers[i],
                    cashAmount: data.cashAmount[i],
                    createdAt: $filter('date')(data.createdAt[i], 'mediumDate')
                };
                sentTransactions.push(transactionPayload);
            }
            return sentTransactions;

        };

        //mines the data so as to make it easy to populate the table in
        //sent_transactions.html. duplicate from that above. Should be avoided but am running out of time
        this.receivedTransactionsSetup = function (data) {

            var receivedTransactions = [];

            for (var i = 0; i < data.senders.length; i++) {
                var transactionPayload = {
                    sender: data.senders[i],
                    cashAmount: data.cashAmount[i],
                    createdAt: $filter('date')(data.createdAt[i], 'mediumDate'),
                    type: data.transactionType[i],
                    status: data.status[i],
                    index: data.index[i]
                };
                receivedTransactions.push(transactionPayload);
            }

            return receivedTransactions;

        };
    });