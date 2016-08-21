angular.module('starter').service('Wrestlers', function($q, $http, $firebaseArray, $firebaseObject) {

  var wrestlerRef = firebase.database().ref().child("wrestlers");
  var maleRef = wrestlerRef.orderByChild("type").equalTo(0);
  var tagRef = wrestlerRef.orderByChild("type").equalTo(2);
  var femaleRef = wrestlerRef.orderByChild("type").equalTo(1);

  this.getAll = function(){
    return $firebaseArray(wresterlerRef);
  };

  this.getAllMale = function(){
    var def = $q.defer();
    var maleWrestlers =  $firebaseArray(maleRef);
    maleWrestlers.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.getAllTag = function(){
    var def = $q.defer();
    var tagWrestlers =  $firebaseArray(tagRef);
    tagWrestlers.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.getAllFemales = function(){
    var def = $q.defer();
    var femaleWrestlers =  $firebaseArray(femaleRef);
    femaleWrestlers.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.add = function(wrestler){
    wrestlerRef.push(wrestler);
  };

  this.exists = function(name){
    var def = $q.defer();
    var thisWrestler = $firebaseArray(wrestlerRef.orderByChild("name").equalTo(name));
    thisWrestler.$loaded().then(function(snap){
      try{
        def.resolve(snap[0].$id);
      }catch(err){def.resolve(false);}
    });
    return def.promise;
  };

  this.get = function(id){
    var def = $q.defer();
    var wrestler = $firebaseArray(wrestlerRef);
    wrestler.$loaded().then(function(snap){
      def.resolve(snap.$getRecord(id));
    });
    return def.promise;
  };

  this.delete = function(wrestler){
    wrestlerRef.child(wrestler.$id).remove();
  };

  this.getWikiInfo = function(name){
    return $http.jsonp('http://en.wikipedia.org/w/api.php?titles=' + name + '&action=query&format=json&prop=images%7Cpageimages&redirects=1&callback=JSON_CALLBACK');
  }


});
