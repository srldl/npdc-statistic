'use strict';
/**
 *
 *
 * @ngInject
 */
var StatisticShowController = function ($scope, $controller, $q, $routeParams,
  Statistic, npdcAppConfig, StatisticSearchService, StatisticJSONService, chronopicService) {
   'ngInject';

  $controller('NpolarBaseController', {$scope: $scope});
  $scope.resource = Statistic;

  var id = "d9f287b7b7fd667d175b5a6028026ce7";

  //Set link for now - demo purposes
  var link = "http://api-test.data.npolar.no/statistic/" + id;

  //Configuration object
  var config = {};

  //Fetch result which is the config
  StatisticSearchService.getValues(link).then(
        function(results) {
            // on success
            config = results.data;
            console.log(results.data);

            //Return title and subtitle
            $scope.main_title = config.main_title;
            $scope.main_subtitle = config.main_subtitle;
  }); //end getValues


  //Chronopic input values
  $scope.start_date = null;
  $scope.end_date = null;



         // Sample data for pie chart
  $scope.pieData = [{
            name: "Fieldwork",
            y: 56.33
      }, {
            name: "Cruise",
            y: 24.03,
            sliced: true,
            selected: true
  }];


   // Invoke Chronopic on all datetime input fields using the material css extension
  new Chronopic('#start_date', {
    className: '.chronopic.chronopic-ext-md',
    format: '{date}',
    onChange: function(element, value) {
      $scope.start_date = value.toISOString();
    }
  });

  new Chronopic('#end_date', {
    className: '.chronopic.chronopic-ext-md',
    format: '{date}',
    onChange: function(element, value) {
      $scope.end_date = value.toISOString();
    }
  });


  //Get submitted dates, search for entries, extract values, push to service
  $scope.submit = function() {
     console.log($scope);
        console.log("------");

        //Search the API
        var link = 'https://api.npolar.no/expedition/?q=&fields=start_date,end_date,people,locations';

        if ($scope.start_date && $scope.end_date) {
           var link2 = '&filter-start_date=' + $scope.start_date + '..' + $scope.end_date;
           var link3 = '&filter-end_date=' + $scope.start_date + '..' + $scope.end_date;
           link = link + link2 + link3;
        }

        console.log(link);


         //Fetch search result
        StatisticSearchService.getValues(link).then(
              function(results) {
                  // on success
                  console.log(results.data);

                  $scope.query2 = EstStats(results.data);

                  var doc = [{
                        name: "Microsoft Internet Explorer",
                        y: 56.33
                    }, {
                        name: "Chrome",
                        y: 24.03,
                        sliced: true,
                        selected: true
                    }, {
                        name: "Firefox",
                        y: 10.38
                    }, {
                        name: "Safari",
                        y: 4.77
                    }, {
                        name: "Opera",
                        y: 0.91
                    }, {
                        name: "Proprietary or Undetectable",
                        y: 0.2
                }];
                //  StatisticJSONService.entryObject = doc;
                 // $scope.barData = doc;
                  console.log($scope);
                  console.log("Getjson------");
        });


    //$scope.barData = StatisticJSONService.entryObject;
     console.log("Getjson2");

  }; //Submit



 };



/* Estimate the diagram values */
function EstStats(data) {

           //Summarize the date results
           var num = (data.feed.entries).length;

           //type_arr holds all dates for type (cruise or fieldwork)
           var type_arr = Array.apply(null, Array(2)).map(Number.prototype.valueOf,0);

           for (var i = 0; i < num; i++) {
              var entry = data.feed.entries[i];

              // var activity_arr = [];
              let t_arr = entry.type === 'cruise' ?  0 : 1;

              //Find date diff between start and end date
              var diff =  Math.floor( ((Date.parse(entry.end_date)) - (Date.parse(entry.start_date))) / 86400000);

              //If people listed
              if (typeof entry.people !== 'undefined') {
                //Traverse through people
                for (var j = 0; j < entry.people.length; j++) {
                  type_arr[t_arr] =  type_arr[t_arr] + diff;
                } //for j
              }

          } //for i
        return type_arr;
}



module.exports = StatisticShowController;


