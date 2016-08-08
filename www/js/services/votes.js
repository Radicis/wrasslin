angular.module('starter').service('Votes', function($q, $firebaseArray, $firebaseObject) {

  var votesRef = firebase.database().ref().child("votes/");
  var votes = $firebaseArray(votesRef);

  this.getAll = function(){
    return votes;
  };

  this.getByMatch = function(matchId){
    var def = $q.defer();
    var matchVotes = $firebaseArray(votesRef.orderByChild("matchId").equalTo(matchId));
    matchVotes.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.getByEvent = function(eventId){
    var def = $q.defer();
    var eventPoints = $firebaseArray(votesRef.orderByChild("eventId").equalTo(eventId));
    eventPoints.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.hasUserVoted = function(uid, votes){
    var dupe = false;
    angular.forEach(votes, function(key){
      if(key.uid===uid){
        dupe = true;
      }
    });
    return dupe;
  }
});
