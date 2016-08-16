angular.module('starter').service('Points', function($q, Events, Matches, Votes, Auth, $firebaseArray, $firebaseObject) {

  var self = this;

  var ref = firebase.database().ref();
  var pointsRef = firebase.database().ref().child("points/");
  var points = $firebaseArray(pointsRef);

  this.getAll = function(){
    return points;
  };

  this.get = function(pointsId){
    return points.$getRecord(pointsId);
  };

  this.set = function(eventId, pointsRef, newPoints){
     var eventsRef = firebase.database().ref().child("events").child(eventId).child("points");
     eventsRef.child(pointsRef).set(newPoints);
  }

  this.getByEvent = function(event){
    var def = $q.defer();
    var eventsRef = firebase.database().ref().child("events").child(event.$id).child("points");
    var eventPoints = $firebaseArray(eventsRef);
    eventPoints.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.getByReference = function(eventId, uniqueRef){
    var eventsRef = firebase.database().ref().child("events").child(eventId).child("points").child(uniqueRef);
    //var pointsRef = firebase.database().ref().child("points");
    var uPoints = $firebaseObject(eventsRef);
    return uPoints;
  }
});
