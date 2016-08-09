angular.module('starter').service('Wrestlers', function($q, $firebaseArray, $firebaseObject) {

  var westerlerRef = firebase.database().ref().child("wrestlers/");

  this.getAll = function(){
    return $firebaseArray(westerlerRef);
  };

  this.getById = function(id){
    var def = $q.defer();
    var matchVotes = $firebaseArray(votesRef.orderByChild("matchId").equalTo(matchId));
    matchVotes.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.delete = function(wrestler){
    var wrestlers = westerlerRef.child(wrestler.$id).remove();
    // wrestlers.$loaded().then(function(){
    //     wrestlers.$remove(wrestler);
    //     wrestlers.$save();
    // });
  }
});
