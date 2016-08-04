angular.module('starter.controllers', [])

  .controller("AuthCtrl", function($scope, Auth, $ionicPopup){

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCkeZQPg-wYtS08LQDqFKyDN4_aCvu6nkY",
      authDomain: "project-2974987705063058636.firebaseapp.com",
      databaseURL: "https://project-2974987705063058636.firebaseio.com",
      storageBucket: "project--2974987705063058636.appspot.com",
    };
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("Signed in with: " + user.uid);
        $scope.loggedIn = true;
        $location.path("/dash");
      } else {
        console.log("Not Signed in ");
        $scope.loggedIn = false;
        $location.path("/dash");
      }
    });

    $scope.login = function() {
      $scope.user = {};

      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/signup.html',
        title: 'Enter Account Details',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Login</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.user.email || !$scope.user.password) {
                e.preventDefault();
              } else {
                console.log("doing login");
                myPopup.close();
              }
            }
          }
        ]
      });
      myPopup.then(function() {
        Auth.login($scope.user.email, $scope.user.password);
      });

    };

    $scope.createUser = function() {

      $scope.user = {};

      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/signup.html',
        title: 'Enter Account Details',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.user.email || !$scope.user.password) {
                e.preventDefault();
              } else {
                myPopup.close();
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        Auth.createAccount($scope.user.email, $scope.user.password);
      });
    };

    $scope.logout = function(){
      Auth.signOut();
    };
  })

  .controller('DashCtrl', function($scope, Events, $firebaseObject, $firebaseArray, $firebaseAuth, $ionicPopup) {

    var ref = firebase.database().ref();
    $scope.userPoints = [];

    $scope.events = Events.getActive();

    $scope.getMatches = function(event){
      event.matches = {};
      event.matches = $firebaseArray(ref.child('matches').orderByChild("eventId").equalTo(event.$id));
    };

    $scope.getPoints = function(event){
      var eventRef = firebase.database().ref().child("events").child(event.$id);
      var points = $firebaseArray(eventRef.child("points"));
      var userRef = firebase.database().ref().child("users");
      points.$loaded().then(function(x) {
        angular.forEach(points, function(key, val){
          console.log("uid: " + key.uid + " points: " + key.points);
          var user = $firebaseObject(userRef.child(key.uid));
          console.log(user);
          $scope.userPoints.push({username: user.email, points: 10});
        })
      });
    };

    $scope.vote = function(matchId, wrestler){

      var uid = firebase.auth().currentUser.uid;

      var matchRef = firebase.database().ref().child("matches").child(matchId);
      var votes = matchRef.child('votes');
      var currentVotesRef = (votes).orderByChild('uid').equalTo(uid);
      var currentVotes = $firebaseArray(currentVotesRef);
      currentVotes.$loaded().then(function(x) {
        if(currentVotes.length>0){
          console.log("Duplicate");
          return false;
        }
        else{
          votes.push({uid: uid, name: firebase.auth().currentUser.email, vote: wrestler});
          matchRef.update({ votes: votes});
        }
      });
    };

    $scope.setWinner = function(match, event){
      $scope.match = match;
      $scope.winner = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/setWinner.html',
        title: 'Who Won?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Confirm</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.winner.name) {
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
        console.log("Match won by:" + $scope.winner.name);
        var matchRef = firebase.database().ref().child("matches").child(match.$id);
        matchRef.update({winner: $scope.winner.name, active: false});
        $scope.assignPoints(match, event);
      });
    };

    $scope.assignPoints = function(match, event){
      var eventRef = firebase.database().ref().child("events").child(event.$id);
      var votes = match.votes;
      var winningVotes = [];
      angular.forEach(votes, function(key, val){
        if(key.vote==match.winner){
          winningVotes.push(key.uid);
        }
      });

      var currentPoints = $firebaseArray(eventRef.child("points"));
      var newPoints = [];

        for(var i=0; i<winningVotes.length;i++) {
          eventRef.child('points').push({
            uid: winningVotes[i],
            points: 1
          });
        }
    }
  })

  .controller('EventCtrl', function($scope, $ionicPopup, $timeout, $firebaseArray, Events, $firebaseAuth) {

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
        owner: firebase.auth().currentUser.uid
      });
    };
  })

  .controller('EventDetailCtrl', function($scope,  $ionicPopup, $stateParams, Events, $firebaseObject) {

    var ref = firebase.database().ref();
    $scope.event = $firebaseObject(ref.child('events').child($stateParams.eventId));
    $scope.matches = $firebaseObject(ref.child('matches').orderByChild("eventId").equalTo($stateParams.eventId));
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
      firebase.database().ref('matches/').push({
        eventId: eventId,
        type: type,
        p1: p1,
        p2: p2,
        date: new Date().toISOString(),
        active: true
      });
    };

  })

  .controller('AccountCtrl', function($scope, $ionicPopup, $firebaseAuth) {
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
