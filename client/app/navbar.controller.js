angular.module('PeerToPeerApp')
    .controller('NavbarCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location) {
        $scope.logout = function() {
            Auth.logout();
            $location.path('/login');
        };
    }]);