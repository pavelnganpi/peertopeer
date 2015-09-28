var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var constants = require('../../util/constants/constants');

module.exports = function () {
    return {
        // only returns user's apps, even for admins.
        send: function (req, res) {

            var io = req.app.get('io');

            var payload = req.body;

            //updates sender's cash balance
            var updateSenderCashBalance = function (res) {
                Users.findOne({'email': payload.senderEmail}, function (err, user) {

                    if (err || !user) {
                        res.status(404).send({'message': payload.receiverEmail + constants.HTTP_STATUS.MSG_404});
                    }
                    else {
                        user.cashBalance -= payload.cashAmount;
                        user.sentTransactions.receivers.push(payload.receiverEmail);
                        user.sentTransactions.cashAmount.push(payload.cashAmount);
                        user.sentTransactions.createdAt.push(new Date());

                        user.save(function (err) {
                            if (err) {
                                res.status(500).send({'message': constants.HTTP_STATUS.MSG_500});
                            }
                        });
                    }

                });
            };

            //update receiver's cash balance
            Users.findOne({'email': payload.receiverEmail}, function (err, user) {

                if (err || !user) {
                    res.status(404).send({'message': payload.receiverEmail + constants.HTTP_STATUS.MSG_404})
                }
                else {

                    var online = user.online;
                    //if receiver is online, send a message
                    if (online) {
                        io.emit('send:money', payload);
                    }
                    else { //else store a message
                        var message = "You received " + payload.cashAmount + "$ from " + payload.senderEmail;
                        user.messages.push(message);
                    }

                    user.cashBalance += payload.cashAmount;
                    user.receivedTransactions.senders.push(payload.senderEmail);
                    user.receivedTransactions.cashAmount.push(payload.cashAmount);
                    user.receivedTransactions.createdAt.push(new Date());
                    user.receivedTransactions.status.push("Accepted");  //status of a sent money is default to Accepted
                    user.receivedTransactions.transactionType.push("Send Money");
                    user.receivedTransactions.index.push(user.receivedTransactions.transactionType.length - 1);
                    user.save(function (err) {
                        if (err) {
                            res.status(500).send({'message': constants.HTTP_STATUS.MSG_500});
                        }
                        updateSenderCashBalance(res);
                        res.status(201).send({'message': constants.HTTP_STATUS.MSG_201})
                    });
                }
            });

        },
        request: function (req, res) {
            var io = req.app.get('io');
            var payload = req.body;

            //updates requestedTransactions for the sender
            var updateSenderTransaction = function (res) {
                Users.findOne({'email': payload.senderEmail}, function (err, user) {

                    if (err || !user) {
                        res.status(404).send({'message': payload.receiverEmail + constants.HTTP_STATUS.MSG_404});
                    }
                    else {
                        user.requestedTransactions.receivers.push(payload.receiverEmail);
                        user.requestedTransactions.cashAmount.push(payload.cashAmount);
                        user.requestedTransactions.createdAt.push(new Date());

                        user.save(function (err) {
                            if (err) {
                                res.status(500).send({'message': constants.HTTP_STATUS.MSG_500});
                            }
                        });
                    }

                });
            };

            Users.findOne({'email': payload.receiverEmail}, function (err, user) {

                if (err || !user) {
                    res.status(404).send({'message': payload.receiverEmail + constants.HTTP_STATUS.MSG_404})
                }
                else {
                    var online = user.online;
                    if (online) {
                        io.emit('requestMoney:sent', payload);
                    }
                    else { //else store a message
                        var message = payload.senderEmail + ' has requested ' + payload.cashAmount + '$. you can accept or decline in transactions';
                        user.messages.push(message);
                    }
                }

                //updates receivedTransactions for the receiver
                user.receivedTransactions.senders.push(payload.senderEmail);
                user.receivedTransactions.cashAmount.push(payload.cashAmount);
                user.receivedTransactions.createdAt.push(new Date());
                user.receivedTransactions.status.push("noresponse");  //status of a request money is default to noresponse. will be switched to Accepted or Declined when the receiver response
                user.receivedTransactions.transactionType.push("Request Money");
                user.receivedTransactions.index.push(user.receivedTransactions.transactionType.length - 1);
                updateSenderTransaction(res);
                user.save(function (err) {
                    if (err) {
                        console.log('error is ');
                        console.log(err);
                        res.status(500).send({'message': constants.HTTP_STATUS.MSG_500});
                    }
                    res.status(201).send({'message': constants.HTTP_STATUS.MSG_201});

                });

            });

        },
        getUser: function (req, res) {
            Users.findById(req.params.userId, function (err, data) {
                if (err) {
                    console.log(err)
                }
                res.send(data);
            });
        }
    }
};