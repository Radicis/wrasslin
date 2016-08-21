angular.module('starter').service('Votes', function($q, $firebaseArray, $firebaseObject) {

  var self = this;

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

  this.add = function(vote){
    var newKey = firebase.database().ref('votes/').push(vote).key;
    firebase.database().ref().child("matches").child(vote.matchId).child("votes/" + vote.uid).set(vote);
  };

  this.hasUserVoted = function(votes, uid){
    if(votes){
      return !(typeof votes[uid] === "undefined");
    }
  };

  this.delete = function(vote){
    votesRef.child(vote.$id).remove();
  };

  this.deleteByEvent = function(event){
    var eventVotes = $firebaseArray(votesRef.orderByChild("eventId").equalTo(event.$id));
    eventVotes.$loaded().then(function(votes){
      votes.forEach(function(vote){
        self.delete(vote);
      })
    });
  };

  this.deleteByMatch = function(match){
    var matchVotes = $firebaseArray(votesRef.orderByChild("matchId").equalTo(match.$id));
    matchVotes.$loaded().then(function(votes){
      votes.forEach(function(vote){
        self.delete(vote);
      })
    });
  }
});
