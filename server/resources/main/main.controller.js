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

            Users.findOne({'email': payload.receiverEmail}, function (err, user) {

                if (err || !user) {
                    res.status(404).send( {'message': payload.receiverEmail + constants.HTTP_STATUS.MSG_404})
                }
                else {
                    var online = user.online;
                    if (online) {
                        io.emit('requestMoney:sent', payload);
                        res.status(201).send({'message':constants.HTTP_STATUS.MSG_201});
                    }
                    else { //else store a message
                        var message =  payload.senderEmail + ' has requested ' + payload.cashAmount + '$. you can accept or decline in transactions';
                        user.messages.push(message);
                        user.save(function (err) {
                            if (err) {
                                console.log('error is ');
                                console.log(err);
                                res.status(500).send({'message': constants.HTTP_STATUS.MSG_500});
                            }
                            res.status(201).send({'message': constants.HTTP_STATUS.MSG_201});

                        });
                    }
                }

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