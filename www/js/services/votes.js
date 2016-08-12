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
    var eventVotes = $firebaseArray(votesRef.orderByChild("eventId").equalTo(eventId));
    eventVotes.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.hasUserVoted = function(votes, uid){
    var dupe = false;
    if(votes){
      votes.forEach(function(vote){
        if(vote.uid==uid){
          dupe = true;
        }
      });
    }
    return dupe;
  }
});
