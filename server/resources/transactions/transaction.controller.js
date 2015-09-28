var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var constants = require('../../util/constants/constants');

module.exports = function () {
    return {
        getTransactions: function(req, res){
            Users.findById(req.params.userId, function (err, user) {

                if (err) {
                    res.status(404).send({'message': constants.HTTP_STATUS.MSG_404})
                }
                var transactionsPayload = {
                    sentTransactions: user.sentTransactions,
                    requestedTransactions: user.requestedTransactions,
                    receivedTransactions: user.receivedTransactions
                };

                res.status(200).send(transactionsPayload);
            });
        },
        updateTransaction: function(req, res){
            var io = req.app.get('io');
            var payload = req.body;
            var index = payload.index;

            //update the status for the receiver(person who received the money request) to Declined
            Users.findOne({'email': payload.receiverEmail}, function (err, user) {

                if (err || !user) {
                    res.status(404).send({'message': payload.receiverEmail + constants.HTTP_STATUS.MSG_404})
                }
                else {
                    var online = user.online;
                    if (online) {
                        io.emit('requestMoney:response', payload);
                    }
                    else { //else store a message
                        var message = payload.receiverEmail + ' ' + payload.type + ' your request for ' + payload.cashAmount + '$ which you submitted on ' + payload.date;
                        user.messages.push(message);
                    }

                    user.receivedTransactions.status.set(index, payload.status);
                    user.save(function (err) {
                        if (err) {
                            res.status(500).send({'message': constants.HTTP_STATUS.MSG_500});
                        }
                        //res.status(201).send({'message': constants.HTTP_STATUS.MSG_201});

                    });
                    res.status(201).send({'message': constants.HTTP_STATUS.MSG_201});

                }

            });
        }
    }
};