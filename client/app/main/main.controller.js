'use strict';

angular.module('PeerToPeerApp')
    .controller('MainCtrl', function ($scope, MainService, $location, $cookies, Socket, notificationService) {

        $scope.init = function () {
            console.log('init called');
            if (!$scope.currentUser) {
                $location.path('/login');
            }
            else {
                if($scope.currentUser.messages){
                    var messages = $scope.currentUser.messages;
                    for (var i = 0; i < messages.length; i++) {
                        var message = messages[i];
                        //setTimeout(function () {
                        notificationService.notify({
                                    title: 'Notification',
                                    text: message,
                                    icon: 'glyphicon glyphicon-envelope'
                            });

                        //}, 5000);
                        console.log(message);
                    }
                }

                MainService.getCurrentUser($scope.currentUser._id)
                    .then(
                    function success(user) {
                        $scope.cashBalance = user.cashBalance;
                        $scope.currentUser.messages = user.messages;
                    },
                    function failed() {

                    });
            }
        };

        $scope.sendMoney = function (user) {

            //if current user is sending money > than what they have
            //send an alert and abort the transaction
            if (user.cashAmount > $scope.currentUser.cashBalance) {

                notificationService.notify({
                        title: 'Error!',
                        text: 'Sorry you can\'t afford that kind of money, Please try what you can afford',
                        type: 'error'
                });

            }
            else {

                MainService.sendMoney(user.email, $scope.currentUser.email, user.cashAmount)
                    .then(
                    function success(result) {
                        notificationService.notify({
                                title: 'Congratulations!',
                                text: result.msg,
                                type: result.type
                        });
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

        $scope.requestMoney = function (user) {

            MainService.requestMoney(user.email, $scope.currentUser.email, user.cashAmount)
                .then(
                function success(result) {
                    notificationService.notify({
                            title: 'Congratulations!',
                            text: result.msg,
                            type: result.type
                    });
                },
                function failed(result) {
                    notificationService.notify({
                            title: 'Error!',
                            text: result.msg,
                            type: result.type
                    });
                });

        };

        Socket.on('send:money', function (data) {

            //shows notifications only on receiver's desktop
            if (data.receiverEmail === $scope.currentUser.email) {
                notificationService.notify({
                        title: 'Money Received',
                        text: 'You have received ' + data.cashAmount
                        + '$ from ' + data.senderEmail,
                        icon: 'glyphicon glyphicon-envelope'
                });
            }
            $scope.init();
            //console.log(data);
        });


        Socket.on('requestMoney:sent', function (data) {

            //shows notifications only on receiver's desktop
            if (data.receiverEmail === $scope.currentUser.email) {
                notificationService.notify({
                    title: 'Money Request',
                    text: data.senderEmail + ' has requested ' + data.cashAmount + '$. you can accept to decline in transactions',
                    icon: 'glyphicon glyphicon-envelope',
                    hide: false,
                    confirm: {
                        confirm: true
                    },
                    buttons: {
                        closer: false,
                        sticker: false
                    },
                    history: {
                        history: false
                    }
                }).get().on('pnotify.confirm', function() {
                    alert('Ok, cool.');
                }).on('pnotify.cancel', function() {
                    alert('Oh ok. Chicken, I see.');
                });

            }
            $scope.init();
            //console.log(data);
        });

        $scope.init();
    });
