angular.module('starter').controller('EventCtrl', function($scope, Auth, $ionicPopup, $timeout, $firebaseArray, Events, $firebaseAuth) {

  // gets all of the events in firebase
  $scope.show();
  Events.getAll().then(function(events){
      $scope.events = events;
      $scope.hide();
  })

  $scope.doRefresh = function() {
      $scope.show();
      Events.getAll().then(function(events){
          $scope.events = events;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.hide();
      });
  };

  // Creates a new event
  $scope.addEvent = function(){
    $scope.newEvent = {};
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/modals/addEvent.html',
      title: 'Enter Event Details',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Create</b>',
          type: 'button-balanced',
          onTap: function(e) {
            if (!$scope.newEvent.name || !$scope.newEvent.location) {
              e.preventDefault();
            } else {
              var uid = firebase.auth().currentUser.uid;
              var newEvent = {
                  name: $scope.newEvent.name,
                  location: $scope.newEvent.location,
                  date: firebase.database.ServerValue.TIMESTAMP,
                  active: true,
                  owner: uid
              };
              Events.createEvent(newEvent);
              myPopup.close();
            }
          }
        }
      ]
    });
  };

  // Displays a confirmation to the user and deleted the event is confirmed
  $scope.delete = function(eventObj){
    if(Auth.isCreator(eventObj)) {
      $scope.check = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/modals/confirmDelete.html',
        title: 'You sure?',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Delete</b>',
            type: 'button-assertive',
            onTap: function (e) {
              if ($scope.check.confirmDelete == true) {
                Events.delete(eventObj);
              } else {
                myPopup.close();
              }
            }
          }
        ]
      });
    }
  };
})
