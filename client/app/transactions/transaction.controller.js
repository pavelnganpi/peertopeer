'use strict';

angular.module('PeerToPeerApp')
    .controller('TransactionsCtrl', function ($scope, TransactionsService, $filter, Socket, notificationService, MainService) {

        $scope.tabs = TransactionsService.tabs;

        $scope.init = function(){
            TransactionsService.getTransactions($scope.currentUser._id)
                .then(
                function success(result){
                    $scope.sentTransactions = TransactionsService.sentAndRequestedTransactionsSetup(result.sentTransactions);
                    $scope.requestedTransactions = TransactionsService.sentAndRequestedTransactionsSetup(result.requestedTransactions);
                    $scope.receivedTransactions = TransactionsService.receivedTransactionsSetup(result.receivedTransactions);

                },
                function failed(result){

                }
            )
        };
        
        //requesterEmail person who requested the money transaction
        //receiverEmail: person accepting to send the money to the requester
        $scope.AcceptMoneyRequest = function(receivedTransaction){

            //if current user is sending money > than what they have
            //send an alert and abort the transaction
            if (receivedTransaction.cashAmount > $scope.currentUser.cashBalance) {

                notificationService.notify({
                    title: 'Error!',
                    text: 'Sorry you can\'t afford that kind of money, Please try what you can afford',
                    type: 'error'
                });

            }
            else {

                MainService.sendMoney(receivedTransaction.sender, $scope.currentUser.email, receivedTransaction.cashAmount, receivedTransaction.type)
                    .then(
                    function success(result) {
                        notificationService.notify({
                            title: 'Congratulations!',
                            text: result.msg,
                            type: result.type
                        });
                        var transactionStatus = 'Accepted';
                        $scope.respondToMoneyRequest(receivedTransaction, transactionStatus);
                    },
                    function failed(result) {
                        notificationService.notify({
                            title: 'Error!',
                            text: result.msg,
                            type: result.type
                        });
                    });
            }

        };

        $scope.DeclineMoneyRequest = function (receivedTransaction){

            var transactionStatus = 'Declined';
            $scope.respondToMoneyRequest(receivedTransaction, transactionStatus);
        };

        //requesterEmail person who requested the money transaction
        //receiverEmail: person declining or accepting to send the money to the requester
        $scope.respondToMoneyRequest = function(receivedTransaction, transactionStatus){

            TransactionsService.respondToMoneyRequest(receivedTransaction, $scope.currentUser.email, transactionStatus)
                .then(
                function success(result){
                    notificationService.notify({
                        title: 'Congratulations!',
                        text: result.msg,
                        type: result.type
                    });

                },
                function failed(result){
                    notificationService.notify({
                        title: 'Error!',
                        text: result.msg,
                        type: result.type
                    });

                }
            );
        };



        Socket.on('requestMoney:response', function(message){

            if (message.requesterEmail === $scope.currentUser.email) {
                notificationService.notify({
                    title: 'Update',
                    text: message.receiverEmail + ' ' + message.responseType + ' your request for ' + message.cashAmount + '$ which you submitted on ' + message.date,
                    icon: 'glyphicon glyphicon-envelope'
                });
            }
            $scope.init();
        });

        Socket.on('send:money', function (message) {

            //shows notifications only on receiver's desktop
            if ((message.receiverEmail === $scope.currentUser.email) && $scope.notification) {
                $scope.notification = false;
                var description;
                if(message.transactionType === 'Send Money'){
                    description = 'You have received ' + message.cashAmount
                        + '$ from ' + message.senderEmail;
                }
                else{
                    description = message.senderEmail + ' accepted your money request of ' + message.cashAmount + '$. Your account was credited';
                }
                notificationService.notify({
                    title: 'Money Received',
                    text: description,
                    icon: 'glyphicon glyphicon-envelope'
                });
            }
            $scope.init();
        });


        Socket.on('requestMoney:sent', function (data) {

            //shows notifications only on receiver's desktop
            if (data.receiverEmail === $scope.currentUser.email) {
                notificationService.notify({
                    title: 'Money Request',
                    text: data.senderEmail + ' has requested ' + data.cashAmount + '$. you can accept to decline in transactions',
                    icon: 'glyphicon glyphicon-envelope',
                });

            }
            $scope.init();
        });



        $scope.init();

    });