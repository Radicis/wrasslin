'use strict';
angular.module('Wrasslin').service('Matches', function($q, Votes, $firebaseArray) {

  var ref = firebase.database().ref();
  var matchesRef = ref.child('matches/');
  var matches = $firebaseArray(matchesRef);

  var self = this;

  this.getAll = function(){
    return matches;
  };

  this.get = function(matchId){
    return matches.$getRecord(matchId);
  };

  this.createMatch = function (eventId, type, p1, p2) {
    var dateTime = firebase.database.ServerValue.TIMESTAMP;
    matchesRef.push({
      eventId: eventId,
      type: type,
      p1: p1,
      p2: p2,
      date: dateTime,
      active: true
    });
  };

  this.getVotes = function(match){
    var def = $q.defer();
    var votes = $firebaseArray(ref.child('votes').orderByChild('matchId').equalTo(match.$id));
    votes.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.hasuserVoted = function(match, uid){
    var voted = false;
    match.votes.forEach(function(vote){
      if(vote.uid===uid){
        console.log('its true');
        voted =  true;
      }
    });
    return voted;
  };

  this.setWinner = function(match, name){
    var matchRef = ref.child('matches').child(match.$id);
    matchRef.update({winner: name, active: false});
  };

  this.getByEvent = function(eventId){
    var def = $q.defer();
    var eventMatches = $firebaseArray(matchesRef.orderByChild('eventId').equalTo(eventId));
    eventMatches.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.delete = function(match){
    matchesRef.child(match.$id).remove();
    Votes.deleteByMatch(match);
  };

  this.deleteByEvent = function(event){
    var eventMatches = $firebaseArray(matchesRef.orderByChild('eventId').equalTo(event.$id));
    eventMatches.$loaded().then(function(){
      eventMatches.forEach(function(match){
        self.delete(match);
      });
    });
  };

});
