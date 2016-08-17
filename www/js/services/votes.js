angular.module('starter').service('Votes', function($q, $firebaseArray, $firebaseObject) {

    var self = this;

  var votesRef = firebase.database().ref().child("votes/");
  var votes = $firebaseArray(votesRef);

  this.getAll = function(){
    return votes;
  };

  this.get = function(voteId){
    return votes.$getRecord(voteId);
};



  this.add = function(vote){
      var newKey = firebase.database().ref('votes/').push(vote).key;

        firebase.database().ref().child("matches").child(vote.matchId).child("votes/" + newKey).set(
            {
              uid: vote.uid
            }
        );
  }

  this.hasUserVoted = function(votes, uid){
    var dupe = false;
    if(votes){
        console.log(votes[0]);
      votes.forEach(function(vote){
        if(vote.uid==uid){
          dupe = true;
        }
      });
    }
    return dupe;
  }

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
  }

  this.deleteByMatch = function(match){
      var matchVotes = $firebaseArray(votesRef.orderByChild("matchId").equalTo(match.$id));
      matchVotes.$loaded().then(function(votes){
        votes.forEach(function(vote){
            self.delete(vote);
        })
      });
  }


});
