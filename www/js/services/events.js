angular.module('starter').service('Events', function($q, Matches, Votes, Auth, $firebaseArray) {

  var ref = firebase.database().ref();
  var eventsRef = firebase.database().ref().child("events/");

  this.getAll = function(){
      var def = $q.defer();
      var events = $firebaseArray(eventsRef);
      events.$loaded().then(function(snap){
          def.resolve(snap);
      });
      return def.promise;
  };

  this.getActive = function(){
    var def = $q.defer();
    var activeEvents = $firebaseArray(eventsRef.orderByChild("active").equalTo(true));
    activeEvents.$loaded().then(function(snap){
        def.resolve(snap);
    });
    return def.promise;
  };

  this.getRecentActive = function(){
      var def = $q.defer();
      var active = $firebaseArray(eventsRef.orderByChild("active").equalTo(true).limitToFirst(1));
      active.$loaded().then(function(snap){
          def.resolve(snap);
      });
      return def.promise;
  };

  this.getLastActive = function(){
      var def = $q.defer();
      var lastActive = $firebaseArray(eventsRef.limitToLast(1));
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

  this.getMatches = function(event){
    var def = $q.defer();
    //var votes = [];
    Matches.getByEvent(event.$id).then(function(matches){
      def.resolve(matches);
    });
    return def.promise;
  };

  this.delete = function(event){
    eventsRef.child(event.$id).remove();
    Matches.deleteByEvent(event);
    Votes.deleteByEvent(event);
  };

  this.getPoints = function(event){
    userPoints = [];
    Votes.getByEvent(event.$id).then(function(votes) {
      angular.forEach(votes, function(vote){
        var points = 0;
        angular.forEach(event.userPoints, function(vote){
          if(key.uid==vote.uid){
            points++
          }
        });
        Auth.get(vote.uid).then(function(userInfo){
          event.userPoints.push({uid: vote.uid, name: userInfo[0].name, points: points});
        });
      });
    });
    return userPoints;
  };
});
