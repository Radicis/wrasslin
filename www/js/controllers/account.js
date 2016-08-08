angular.module('starter').controller('AccountCtrl', function($scope, $ionicPopup, $firebaseAuth) {
    $scope.settings = {
      enableFriends: true
    };

    $scope.addWrestler = function(){
      $scope.newWrestler = {};

      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/addWrestler.html',
        title: 'Enter Name',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.newWrestler.name) {
                e.preventDefault();
              } else {
                myPopup.close();
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        firebase.database().ref('wrestlers/').push({
          isTeam: $scope.newWrestler.isTeam,
          name:  $scope.newWrestler.name,
          active: true
        });
        console.log('Created!', $scope.newWrestler.name);
      });
    };

  });
