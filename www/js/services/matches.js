angular.module('starter').service('Matches', function($q, $firebaseArray, $firebaseObject) {

  var ref = firebase.database().ref();
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

  this.getVotes = function(match){
    var def = $q.defer();
    var votes = $firebaseArray(ref.child('votes').orderByChild("matchId").equalTo(match.$id));
    votes.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.hasuserVoted = function(match, uid){
    var voted = false;
    match.votes.forEach(function(vote){
      if(vote.uid==uid){
        console.log("its true");
        voted =  true;
      }
    });
    return voted;
  }

  this.getByEvent = function(eventId){
    var def = $q.defer();
    var eventMatches = $firebaseArray(matchesRef.orderByChild("eventId").equalTo(eventId));
    eventMatches.$loaded().then(function(snap){
      def.resolve(snap);
    })
    return def.promise;
  }
});
