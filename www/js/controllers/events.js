angular.module('starter').controller('EventCtrl', function($scope, $ionicPopup, $timeout, $firebaseArray, Events, $firebaseAuth) {

  $scope.events = Events.getAll();

  var eventsRef = firebase.database().ref().child("events/");

  $scope.addEvent = function(){
    $scope.newEvent = {};
    var myPopup = $ionicPopup.show({
      template: '<input type="text" placeholder="name"  ng-model="newEvent.name"><input type="text" placeholder="location" ng-model="newEvent.location">',
      title: 'Enter Event Details',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Create</b>',
          type: 'button-positive',
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
      console.log('Created!', $scope.newEvent.name);
      window.location = "#/tab/events/";
    });
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
