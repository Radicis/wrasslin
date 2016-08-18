angular.module('starter').controller('WrestlerDetailCtrl', function($scope, $stateParams, Wrestlers, $ionicPopup, $firebaseAuth) {

    var wrestlerId = $stateParams.wrestlerId;
    
    $scope.show();
      Wrestlers.get(wrestlerId).then(function(wrestler){
          $scope.hide();
          $scope.wrestler = wrestler;
      });

});
