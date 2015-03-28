angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Record',
    function($scope, $rootScope, $routeParams, Record) {
      Record.get({ _id: $routeParams.id }, function(record) {
        $scope.record = record;


      });

//        $http.get('/api/records')
//            .success(function(data) {
//                $scope.records = data.slice(-12, 0); //get 12 last items of data array
//
//                $scope.lastRecord = data[data.length-1];
////                $scope.addDelta = function (selector){
////                    $scope.delta = data[data.length-1].temperature - data[data.length-2].temperature;
////                    if ($scope.delta < 0){
////                        $('.'+selector).addClass('negative arrow-down-medium');
////                    }else if ($scope.delta >0){
////                        $('.'+selector).addClass('positive arrow-up-medium');
////                    }else{
////                        $('.'+selector).addClass('arrow-level-medium');
////                    }
////                    return $scope.delta;
////                };
////                $scope.addDelta('temp-delta');
//
//                var items = [];
//                $.each(data, function(key, val) {
//
//                    if(val.temperature == undefined){
//                        items.push(0);
//                    }else{
//                        items.push(val.temperature);
//                    }
//                });
//                $(".chart_temp").text(items.join(",")).peity("bar", {width: 185, height: 50});
//
//            })
//            .error(function(data) {
//                console.log('Error: ' + data);
//            });

    }]);