angular.module('PeerToPeerApp')
    .constant('AUTH_CONSTANTS', {
        'URIS': {
            'LOGIN_BASE': '/auth/login',
            'SIGNUP_BASE': '/auth/signup',
            'LOGOUT_BASE': '/auth/logout'
        }
    });