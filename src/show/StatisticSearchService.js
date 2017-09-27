'use strict';
//service

// @ngInject

var StatisticSearchService = function($resource, $http){

  var getValues = function(Inputlink) {
    return $http.get(Inputlink);
  };


  return {
    getValues: getValues
  };
};

module.exports = StatisticSearchService;
