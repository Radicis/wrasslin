angular.module('starter').service('Matches', function($firebaseArray, $firebaseObject) {

  var matchesRef = firebase.database().ref().child("matches/");
  var matches = $firebaseArray(matchesRef);

  this.getAll = function(){
    return matches;
  };

  this.getActive = function(){
    return activeMatches = $firebaseArray(matchesRef.orderByChild("active").equalTo(true));
  };

  this.get = function(matchId){
      return matches.$getRecord(matchId);
  }

  this.getByEvent = function(eventId){
      var eventMatches = $firebaseObject(matchesRef.orderByChild("eventId").equalTo(eventId));
      return eventMatches;
  }
});
