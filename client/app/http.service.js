'use strict';

angular.module('PeerToPeerApp')
  .service('HttpService', function ($http) {

    this.get = function (url) {
      return $http.get(url);
    };

    this.put = function (url, payload) {
      return $http.put(url, payload);
    };

    this.post = function (url, payload) {
      return $http.post(url, payload);
    };

    this.delete = function (url) {
      return $http.delete(url);
    };
  });
