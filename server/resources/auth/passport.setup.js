var express = require('express');
var passport = require('passport');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Users = mongoose.model('Users');

module.exports = function (app) {

    app.use(passport.initialize());
    app.use(passport.session());
    //
    // passport config
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
        Users.findOne({ email: email }, function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false);
            user.comparePassword(password, function(err, isMatch) {
                if (err) return done(err);
                if (isMatch) return done(null, user);
                return done(null, false);
            });
        });
    }));

    return passport;

};