angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Events) {
  $scope.events = Events.getActive();

})

.controller('EventCtrl', function($scope, $ionicPopup, $timeout, $firebaseArray, Events) {

  $scope.events = Events.getAll();

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
    });
  };
})

.controller('EventDetailCtrl', function($scope,  $ionicPopup, $stateParams, Events, $firebaseObject) {

  var ref = firebase.database().ref();
  $scope.event = $firebaseObject(ref.child('events').child($stateParams.eventId));
  $scope.matches = $scope.event.matches;
  $scope.wrestlers = $firebaseObject(ref.child('wrestlers').orderByChild("name"));

  $scope.addMatch = function(){

    $scope.newMatch = {};
    $scope.matchTypes = ['Single', 'Tag-Team'];
    $scope.selectedMatchtype;

    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/addMatch.html',
      title: 'Enter Match Details',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            console.log($scope.newMatch.p1.name);
            if (!$scope.newMatch.p1 || !$scope.newMatch.p2) {
              alert("Try again");
              e.preventDefault();
            } else {
              myPopup.close();
            }
          }
        }
      ]
    });
    myPopup.then(function(res) {
      createMatch($stateParams.eventId, $scope.selectedMatchtype, $scope.newMatch.p1.name, $scope.newMatch.p2.name);
      console.log('Created!');
    });
  };

  $scope.matchTypeChanged = function(matchType){
    $scope.selectedMatchtype = matchType;
  };


  var createMatch = function (eventId, type, p1, p2) {
    if(!$scope.matches){
      $scope.matches = {};
    }
    $scope.matches.add({
      type: type,
      p1: p1,
      p2: p2,
      date: new Date().toISOString(),
      active: true
    });
    firebase.database().ref('events').child(eventId).child('matches').set($scope.matches);
    // $scope.event.matches.add({
    //     type: type,
    //     p1: p1,
    //     p2: p2,
    //     date: new Date().toISOString(),
    //     active: true
    // });
    // firebase.database().ref('events').child(eventId).child('matches').push({
    //   type: type,
    //   p1: p1,
    //   p2: p2,
    //   date: new Date().toISOString(),
    //   active: true
    // });
  };

})

.controller('AccountCtrl', function($scope, $ionicPopup) {
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
  }
});
