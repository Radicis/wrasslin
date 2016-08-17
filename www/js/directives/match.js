angular.module('starter').directive('match', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      scope:{
          thisMatch: '='
      }
      template: '<h3>Hello World!!: {{thisMatch}}</h3>',
      controller: "MatchDisplayCtrl"
  };
});
