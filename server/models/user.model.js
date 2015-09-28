var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var UserSchema = new Schema({

    email: { type: String, unique: true },
    password: String,
    cashBalance: Number,
    online: Boolean,
    messages: [String], // stores notifications messages if user is offline
    sentTransactions: {        //transactions user sent money out
        receivers:[String],
        cashAmount:[Number],
        createdAt: [Date]
    },
    requestedTransactions: {     //transactions user requested for money
        receivers:[String],
        cashAmount:[Number],
        createdAt: [Date]
    },
    receivedTransactions: {   // transactions user received as money requests or money received
        senders:[String],
        cashAmount:[Number],
        createdAt: [Date],
        transactionType: [String],
        status: [String],
        index: [Number]  //to be able to update a status
    }
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

mongoose.model('Users', UserSchema);