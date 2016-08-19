'use strict';
angular.module('Wrasslin').service('Events', function($q, Matches, Votes, Auth, $firebaseArray) {

  var ref = firebase.database().ref();
  var eventsRef = ref.child('events/');

  this.getAll = function(){
    var def = $q.defer();
    var events = $firebaseArray(eventsRef);
    events.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.getRecentActive = function(){
    var def = $q.defer();
    var active = $firebaseArray(eventsRef.orderByChild('active').equalTo(true).limitToFirst(1));
    active.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.getLastActive = function(){
    var def = $q.defer();
    var lastActive = $firebaseArray(eventsRef.limitToFirst(1));
    lastActive.$loaded().then(function(snap){
      def.resolve(snap[0]);
    });
    return def.promise;
  };

  this.get = function(eventId){
    var def = $q.defer();
    var events = $firebaseArray(eventsRef);
    events.$loaded().then(function(snap){
      def.resolve(snap.$getRecord(eventId));
    });
    return def.promise;
  };

  this.createEvent = function (newEvent) {
    eventsRef.push(newEvent);
  };

  this.delete = function(event){
    eventsRef.child(event.$id).remove();
    Matches.deleteByEvent(event);
    Votes.deleteByEvent(event);
  };
});
