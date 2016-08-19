'use strict';
angular.module('Wrasslin').service('Points', function($q, Events, Matches, Votes, Auth, $firebaseArray) {

  var ref = firebase.database().ref();
  var pointsRef = ref.child('points/');
  var points = $firebaseArray(pointsRef);

  this.getAll = function(){
    return points;
  };

  this.get = function(pointsId){
    return points.$getRecord(pointsId);
  };

  this.set = function(eventId, pointsRef, newPoints){
    var eventsRef = ref.child('events').child(eventId).child('points');
    eventsRef.child(pointsRef).set(newPoints);
  };

  this.getByEvent = function(eventId){
    var def = $q.defer();
    var eventPointsRef = ref.child('events').child(eventId).child('points');
    var eventPoints = $firebaseArray(eventPointsRef);
    eventPoints.$loaded().then(function(points){
      def.resolve(points);
    });
    return def.promise;
  };
});
