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
};

    this.createMatch = function (eventId, type, p1, p2) {
      matchesRef.push({
        eventId: eventId,
        type: type,
        p1: p1,
        p2: p2,
        date: firebase.database.ServerValue.TIMESTAMP,
        active: true
      });
    };

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
  };

  this.setWinner = function(match, name){
      var matchRef = firebase.database().ref().child("matches").child(match.$id);
      matchRef.update({winner: name, active: false});
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
