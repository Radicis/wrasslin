angular.module('starter').service('Events', function($q, Matches, Votes, Auth, $firebaseArray, $firebaseObject) {

  var ref = firebase.database().ref();
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

  this.getMatches = function(event){
    var def = $q.defer();
    //var votes = [];
    Matches.getByEvent(event.$id).then(function(matches){
        def.resolve(matches);
      });
      return def.promise;
  }


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
