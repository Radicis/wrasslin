angular.module('starter').service('Points', function($q, Events, Matches, Votes, Auth, $firebaseArray, $firebaseObject) {

  var ref = firebase.database().ref();
  var pointsRef = firebase.database().ref().child("points/");
  var points = $firebaseArray(pointsRef);

  this.getAll = function(){
    return points;
  };


  this.get = function(pointsId){
    return points.$getRecord(pointsId);
  }

  this.getByEvent = function(event){
    var def = $q.defer();
    var eventPoints = $firebaseArray(pointsRef.orderByChild("eventId").equalTo(event.$id));
    eventPoints.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  }

  this.getByReference = function(uniqueRef){
    var pointsRef = firebase.database().ref().child("points");
    var uPoints = $firebaseObject(pointsRef.child(uniqueRef));
    console.log(uPoints);
    return uPoints;
  }
});
