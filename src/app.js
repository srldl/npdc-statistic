'use strict';

var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

var angular = require('angular');
var Highcharts = require('highcharts');

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
require('npdc-common/src/wrappers/leaflet');

var npdcStatisticApp = angular.module('npdcStatisticApp', ['npdcCommon', 'leaflet']).value('Highcharts', Highcharts);


npdcStatisticApp.controller('StatisticShowController', require('./show/StatisticShowController'));
npdcStatisticApp.factory('StatisticSearchService', require('./show/StatisticSearchService'));
npdcStatisticApp.factory('StatisticJSONService', require('./show/StatisticJSONService'));
npdcStatisticApp.directive('hcPieChart', require('./show/hcPieChart'));
npdcStatisticApp.directive('hcBarChart', require('./show/hcBarChart'));



// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/', 'resource': 'NpolarApi'},
  {'path': '/user', 'resource': 'User'},
  {'path': '/expedition', 'resource': 'Expedition'},
  {'path': '/statistic', 'resource': 'Statistic'}
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
  npdcAppConfig.help = {uri: 'https://github.com/npolar/npdc-statistic/wiki' };
  NpolarTranslate.loadBundles('npdc-statistic');
  npdcAppConfig.toolbarTitle = 'Statistics';
});
