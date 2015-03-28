angular.module('MyApp')
  .controller('DashboardCtrl', ['$scope', '$alert', '$http','socket', function($scope, $alert, $http, socket) {

     $scope.getRecords = function (){
        $http.get('/api/records')
        .success(function(data) {
            $scope.records = data;
            $scope.lastRecord = data[data.length-1];
            $scope.addDelta = function (selector){
              $scope.delta = data[data.length-1].temperature - data[data.length-2].temperature;
              if ($scope.delta < 0){
                  $('.'+selector).addClass('negative arrow-down-medium');
              }else if ($scope.delta >0){
                  $('.'+selector).addClass('positive arrow-up-medium');
              }else{
                  $('.'+selector).addClass('arrow-level-medium');
              }
              return $scope.delta;
            };
            $scope.addDelta('temp-delta');
            var items = [];
            $.each(data, function(key, val) {
              if(val.temperature == undefined){
                items.push(0);
              }else{
                items.push(val.temperature);
              }
            });
            $(".chart_temp").text(items.join(",")).peity("bar", {width: 185, height: 50});
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
     };
     $scope.getRecords();

    socket.on('onRecordCreated', function() {
        $scope.getRecords();
    });

  }]);