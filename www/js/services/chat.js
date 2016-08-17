angular.module('starter').service('Chat', function($q, $firebaseArray, $firebaseObject) {

    var ref = firebase.database().ref();
    var chatRef = ref.child("chat");

    // get the last 50 messages
    this.getRecent = function(){
        var def = $q.defer();
        var chats = $firebaseArray(chatRef.limitToFirst(50));
        chats.$loaded().then(function(snap){
          def.resolve(snap);
        });
        return def.promise;
    };

    this.chat = function(message){
        chatRef.push(message);
    }
});
