angular.module('MyApp')
  .controller('MainCtrl', ['$scope', 'Record', function($scope, Record) {

    $scope.headingTitle = 'eDream App';

    $scope.records = Record.query();


  }]);