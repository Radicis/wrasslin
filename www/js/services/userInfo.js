angular.module('starter').service("UserInfo", function($q, $firebaseObject, $firebaseAuth, $firebaseArray){
    this.get = function(uid){
        var def = $q.defer();
        var userRef = firebase.database().ref().child("userInfo");
        var userInfoRef = userRef.orderByChild("uid").equalTo(uid);        
        $firebaseArray(userInfoRef).$loaded().then(function(snap){
            def.resolve(snap);
        });
        return def.promise;
    }
});
