'use strict';

// @ngInject

var router = function ($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/', {
    templateUrl: 'show/stat.html',
    controller: 'StatShowController',
    reloadOnSearch: false
  });
};

module.exports = router;