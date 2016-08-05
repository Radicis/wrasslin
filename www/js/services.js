angular.module('starter.services', [])

  .service("Auth", function($firebaseAuth){

    this.authorize = function(){
      console.log("User is: " + $scope.loggedIn);
      return $scope.loggedIn;
    };

    this.login = function(email, password) {
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Login: " + error);
        return false;
      });
      return true;
    };

    this.createAccount = function(email, password){
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Sign in: " + error);
          return false;
        });

      return true;
    };

    this.signOut = function(){
      firebase.auth().signOut().then(function() {
        console.log("Signed out!");
      }, function(error) {
        console.log("Signed error: " + error);
      });
    }
})

  .service('Events', function($firebaseArray, $firebaseObject) {

    var eventsRef = firebase.database().ref().child("events/");
    var events = $firebaseArray(eventsRef);

    this.getAll = function(){
      return events;
    };

    this.getActive = function(){
      var activeEvents = $firebaseArray(eventsRef.orderByChild("active").equalTo(true));
      return activeEvents;
    };

    this.get = function(eventId){
      events.$loaded().then(function(x) {
        var event = events.$getRecord(eventId);
        return event;
      });
    }
  });

