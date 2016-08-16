angular.module('starter').controller("ChatCtrl", function($scope, Auth, Chat, $ionicPopup,$ionicLoading){

    $scope.show();

    Chat.getRecent().then(function(chats){
        $scope.chats = chats;
        $scope.hide();
    });

    $scope.newChat = {};

    $scope.chat = function(){
        var uid = $scope.getUid();
        var date = new Date().toISOString();
        Auth.get(uid).then(function(userInfo){
            var username = userInfo[0].name;
            var img = userInfo[0].photo;
            var newChat = {
                name: username,
                date: date,
                text: $scope.newChat.text,
                uid: uid,
                img: img
            };
            Chat.chat(newChat);
            $scope.newChat.text = "";
        });
    }

});
