angular.module('starter').controller('WrestlersCtrl', function($scope, Wrestlers, $ionicPopup, $firebaseAuth) {

    $scope.wrestlers = Wrestlers.getAll();

    $scope.delete = function(wrestler){
        $scope.check = {};
        var myPopup = $ionicPopup.show({
          templateUrl: 'templates/confirmDelete.html',
          title: 'Enter Name',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Delete</b>',
              type: 'button-positive',
              onTap: function(e) {
                console.log($scope.check.confirmDelete);
                if ($scope.check.confirmDelete==true) {
                  Wrestlers.delete(wrestler);
                } else {
                  myPopup.close();
                }
              }
            }
          ]
        });
    }

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