angular.module('starter.services', [])

  .service('Events', function($firebaseArray, $firebaseObject) {

    var eventsRef = firebase.database().ref().child("events/");
    var events = $firebaseArray(eventsRef);

    this.getAll = function(){
      return events;
    };

    this.getActive = function(){
      return $firebaseArray(eventsRef.orderByChild("active").equalTo(true));
    };

    this.get = function(eventId){
      events.$loaded().then(function(x) {
        var event = events.$getRecord(eventId);
        return event;
      });
    }
  });

