var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var constants = require('../../util/constants/constants');

module.exports = function () {
    return {

        login: function (req, res) {
            res.cookie('user', JSON.stringify(req.user));
            Users.findOne({'email': req.user.email}, function (err, user) {
                if (err) {
                    console.log(err)
                }

                user.online = true;  //update users status to online
                var userPayload = {
                    email: user.email,
                    _id: user._id,
                    cashBalance: user.cashBalance,
                    messages: user.messages,   // any messages the user had of they were offline
                    online: true
                };

                user.messages = user.messages.splice(); // delete messages if any.
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    res.status(201).send(userPayload);
                });
            });
        },
        signup: function (req, res, next) {
            var user = {
                email: req.body.email,
                password: req.body.password,
                cashBalance: 20000,
                online: false
            };
            Users.create(user, function (err) {
                if (err) {res.status(500).send({'message': constants.HTTP_STATUS.MSG_500});}
                res.status(201).send({'message': constants.HTTP_STATUS.MSG_201});
            });
        },
        logout: function (req, res, next) {
            Users.update({'email': req.body.email}, {
                online: false
            }, function (err) {
                if (err) {
                    res.status(500).send({'message': constants.HTTP_STATUS.MSG_500});
                }
                req.logout();
                res.status(201).send({'message': constants.HTTP_STATUS.MSG_201});
            });
        }

    }
};