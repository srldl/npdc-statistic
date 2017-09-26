'use strict';

var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

var angular = require('angular');

var npdcStatisticApp = angular.module('npdcStatisticApp', ['npdcCommon']);



npdcStatisticApp.controller('StatisticShowController', require('./search/StatisticShowController'));
npdcStatisticApp.factory('StatisticSearchService', require('./search/StatisticSearchService'));
npdcStatisticApp.factory('Statistic', require('./Statistic.js'));

npdcStatisticApp.directive('xchronopic', function($timeout) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elem, attrs, model) {
      var cp = new Chronopic(elem[0], {
        className: '.chronopic.chronopic-ext-md',
        format: '{date}',
        onChange: function(element, value) {
          $timeout(() => {
            var isoDate = value.toISOString();
            model.$viewValue = scope[attrs.ngModel] = isoDate;
          });
        }
      });

      scope.$on('npolar-lang', (e, lang) => {
        cp.locale = lang.lang;
      });
    }
  };
});

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/', 'resource': 'NpolarApi'},
  {'path': '/user', 'resource': 'User'},
  {'path': '/statistic', 'resource': 'StatisticResource'}
];

resources.forEach(service => {
  // Expressive DI syntax is needed here
  npdcStatisticApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});


npdcStatisticApp.factory('L', function() {
  return window.L; // assumes Leaflet has already been loaded on the page
});

// Routing
npdcStatisticApp.config(require('./router'));


npdcStatisticApp.config(($httpProvider, npolarApiConfig) => {
  var autoconfig = new AutoConfig("production");
   //var autoconfig = new AutoConfig("test");
  angular.extend(npolarApiConfig, autoconfig, { resources });
  console.debug("npolarApiConfig", npolarApiConfig);

  $httpProvider.interceptors.push('npolarApiInterceptor');
});

npdcStatisticApp.run(($http, npdcAppConfig, NpolarTranslate, NpolarLang) => {
  //npdcAppConfig.help = {uri: 'https://github.com/npolar/npdc-statistic/wiki' };
  NpolarTranslate.loadBundles('npdc-statistic');
  npdcAppConfig.toolbarTitle = 'Statistics';
});
