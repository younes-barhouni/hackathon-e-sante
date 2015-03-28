angular.module('MyApp')
  .factory('Record', ['$resource', function($resource) {
    return $resource('/api/records/:_id');
  }]);