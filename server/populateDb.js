var mongoose = require('mongoose');
require('./models/user.model');
var Users = mongoose.model('Users');

var user1 = {
    _id: 1,
    firstName: 'pavey',
    lastName: 'nganpi',
    email: 'pavey@email.com',
    cashBalance: 20000
};

var user2 = {
    _id:2,
    firstName: 'marc',
    lastName: 'nganpi',
    email: 'marc@email.com',
    cashBalance: 20000
};

Users.create([user1, user2], function(err){
    if(err){console.log(err);}
});


