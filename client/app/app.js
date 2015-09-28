angular.module('PeerToPeerApp', ['ngResource', 'ui.router', 'ngCookies','ui.bootstrap','jlareau.pnotify'])
    .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginCtrl'
            })
            .state('transactions', {
                url: '/transactions',
                templateUrl: 'app/transactions/transaction.html',
                controller: 'TransactionsCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/signup/signup.html',
                controller: 'SignupCtrl'
            });

        $urlRouterProvider.otherwise("/");
    });
