angular.module('starter').controller("ChatCtrl", function($scope, Auth, Chat,$ionicLoading, $ionicScrollDelegate){

    $scope.show();

    Chat.getRecent().then(function(chats){
        $scope.chats = chats;
        $scope.hide();
    });

    $scope.$watch('chats', function(newValue, oldValue) {
        $ionicScrollDelegate.scrollBottom(true);
      }, true);

    // Refreshes the scope in the case where the update is in memory and not in firebase
    $scope.doRefresh = function() {
        Chat.getRecent().then(function(chats){
            $scope.chats = chats;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.newChat = {};

    // Send a chat message
    $scope.chat = function(){
        if(!$scope.newChat.text){
            return;
        }
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
