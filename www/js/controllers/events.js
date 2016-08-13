angular.module('starter').controller('EventCtrl', function($scope, Auth, $ionicPopup, $timeout, $firebaseArray, Events, $firebaseAuth) {

  $scope.events = Events.getAll();

  var eventsRef = firebase.database().ref().child("events/");

  $scope.addEvent = function(){
    $scope.newEvent = {};
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/addEvent.html',
      title: 'Enter Event Details',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Create</b>',
          type: 'button-balanced',
          onTap: function(e) {
            if (!$scope.newEvent.name) {
              e.preventDefault();
            } else {
              myPopup.close();
              return $scope.newEvent.name;
            }
          }
        }
      ]
    });
    myPopup.then(function(res) {
      createEvent($scope.newEvent.name, $scope.newEvent.location);
    });
  };

  $scope.delete = function(event){
    if(Auth.isCreator(event)) {
      $scope.check = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/confirmDelete.html',
        title: 'You sure?',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Delete</b>',
            type: 'button-assertive',
            onTap: function (e) {
              console.log($scope.check.confirmDelete);
              if ($scope.check.confirmDelete == true) {
                Events.delete(event);
              } else {
                myPopup.close();
              }
            }
          }
        ]
      });
    }
  };

  var createEvent = function (name, location) {
    firebase.database().ref('events/').push({
      name: name,
      location: location,
      date: new Date().toISOString(),
      active: true,
      owner: firebase.auth().currentUser.uid
    });
  };
})
