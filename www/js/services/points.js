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

  this.set = function(pointsRef, newPoints){
     firebase.database().ref('points').child(pointsRef).set(newPoints); 
  }

  this.getByEvent = function(event){
    var def = $q.defer();
    var eventPoints = $firebaseArray(pointsRef.orderByChild("eventId").equalTo(event.$id));
    eventPoints.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.getEventPoints = function(event){
    var def = $q.defer();
    var userPoints = [];
    this.getByEvent(event).then(function(points) {
      var winnerPoints = 0;
      var winner = {};
      points.forEach(function (point) {
        Auth.get(point.uid).then(function (userInfo) {
          self.getByReference(point.uid + point.eventId).$loaded().then(function (uPoint) {
            userPoints.push({
              uid: uPoint.uid,
              img: userInfo[0].photo,
              name: userInfo[0].name,
              points: uPoint.points
            });
          });
        });
      });
      def.resolve(userPoints);
    });
    return def.promise;
  };

  this.getByReference = function(uniqueRef){
    var pointsRef = firebase.database().ref().child("points");
    var uPoints = $firebaseObject(pointsRef.child(uniqueRef));
    return uPoints;
  }
});
