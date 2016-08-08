angular.module('starter').service('Events', function($firebaseArray, $firebaseObject) {

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
      return events.$getRecord(eventId);
  }
});
