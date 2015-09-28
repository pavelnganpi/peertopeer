angular.module('PeerToPeerApp')
    .factory('Auth', ['$http', '$location', '$rootScope', '$cookies', 'HttpService', 'AUTH_CONSTANTS', 'notificationService',
        function ($http, $location, $rootScope, $cookies, HttpService, AUTH_CONSTANTS, notificationService) {
            $rootScope.currentUser = $cookies.get('user') ? JSON.parse($cookies.get('user')) : $cookies.get('user');

            return {
                login: function (user) {
                    return HttpService.post(AUTH_CONSTANTS.URIS.LOGIN_BASE, user)
                        .success(function (data) {
                            $rootScope.currentUser = data;
                            $location.path('/');

                            notificationService.notify({
                                title: 'Cheers!',
                                text: 'You have successfully logged in.',
                                type: 'success'
                            });
                        })
                        .error(function () {

                            notificationService.notify({
                                title: 'Error!',
                                text: 'Invalid username or password.',
                                type: 'error'
                            });
                        });
                },
                signup: function (user) {
                    return HttpService.post(AUTH_CONSTANTS.URIS.SIGNUP_BASE, user)
                        .success(function () {
                            $location.path('/login');

                            notificationService.notify({
                                title: 'Congratulations!',
                                text: 'Your account has been created.',
                                type: 'success'
                            });
                        })
                        .error(function (response) {
                            notificationService.notify({
                                title: 'Error!',
                                text: response.data,
                                type: 'error'
                            });
                        });
                },
                logout: function () {
                    return HttpService.post(AUTH_CONSTANTS.URIS.LOGOUT_BASE, $rootScope.currentUser)
                        .success(function () {
                            $rootScope.currentUser = null;
                            $cookies.remove('user');
                            notificationService.notify({
                                title: 'Logout!',
                                text: 'You have been logged out successfully.',
                                type: 'success'
                            });
                        }).error(function () {
                            notificationService.notify({
                                title: 'Logout!',
                                text: 'Error logging you out. Please try again',
                                type: 'error'
                            });
                        });
                }
            };
        }]);
