'use strict';
angular.module('Wrasslin').controller('WrestlerDetailCtrl', function($scope, $stateParams, Wrestlers) {

    var wrestlerId = $stateParams.wrestlerId;

    $scope.show();
      Wrestlers.get(wrestlerId).then(function(wrestler){
          $scope.hide();
          $scope.wrestler = wrestler;
      });

});
