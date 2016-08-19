'use strict';
angular.module('Wrasslin').service('Wrestlers', function($q, $http, $firebaseArray) {

  var westerlerRef = firebase.database().ref().child('wrestlers/');

  this.getAll = function(){
    return $firebaseArray(westerlerRef);
  };


  this.getAllSingle = function(){
    var def = $q.defer();
    var tagRef = westerlerRef.orderByChild('isTeam').equalTo(false);
    var tagWrestlers =  $firebaseArray(tagRef);
    tagWrestlers.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.getAllTag = function(){
    var def = $q.defer();
    var tagRef = westerlerRef.orderByChild('isTeam').equalTo(true);
    var tagWrestlers =  $firebaseArray(tagRef);
    tagWrestlers.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.add = function(wrestler){
    westerlerRef.push(wrestler);
  };

  this.exists = function(name){
    var def = $q.defer();
    var thisWrestler = $firebaseArray(westerlerRef.orderByChild('name').equalTo(name));
    thisWrestler.$loaded().then(function(snap){
      try{
        def.resolve(snap[0].$id);
      }catch(err){def.resolve(false);}
    });
    return def.promise;
  };

  this.get = function(id){
    var def = $q.defer();
    var wrestler = $firebaseArray(westerlerRef);
    wrestler.$loaded().then(function(snap){
      def.resolve(snap.$getRecord(id));
    });
    return def.promise;
  };

  this.delete = function(wrestler){
    westerlerRef.child(wrestler.$id).remove();
  };

  this.getWikiInfo = function(name){
    return $http.jsonp('http://en.wikipedia.org/w/api.php?titles=' + name + '&action=query&format=json&prop=images%7Cpageimages&redirects=1&callback=JSON_CALLBACK');
  };
});
