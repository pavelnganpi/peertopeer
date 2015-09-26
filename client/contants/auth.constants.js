angular.module('PeerToPeerApp')
    .constant('TRANSACTION_CONSTANTS', {
        'URIS': {
            'LOGIN_BASE': '/auth/login',
            'SIGNUP_BASE': '/auth/signup',
            'LOGOUT_BASE': '/auth/logout'
        }
    });