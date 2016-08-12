angular.module('starter').service('Wrestlers', function($q, $http, $firebaseArray, $firebaseObject) {

    var westerlerRef = firebase.database().ref().child("wrestlers/");

    this.getAll = function(){
      return $firebaseArray(westerlerRef);
    };


    this.getAllSingle = function(){
        var singleref = westerlerRef.orderByChild("isTeam").equalTo(false);
       var singleWrestlers =  $firebaseArray(singleref);
       return singleWrestlers;
    };

    this.getAllTag = function(){
       var tagRef = westerlerRef.orderByChild("isTeam").equalTo(true);
       var tagWrestlers =  $firebaseArray(tagRef);

       return tagWrestlers;
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
      };

    this.getWikiInfo = function(name){
        return $http.jsonp('http://en.wikipedia.org/w/api.php?titles=' + name + '&action=query&format=json&prop=images%7Cpageimages&redirects=1&callback=JSON_CALLBACK');
    }


});
