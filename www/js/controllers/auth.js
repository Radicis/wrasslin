angular.module('starter').controller("AuthCtrl", function($scope, Auth, $ionicPopup, $ionicPopover){

  var provider = new firebase.auth.GoogleAuthProvider();

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA5YRfAkhhtCiAksZVnPFbaIuZfqZPE_No",
    authDomain: "wrestling-246e2.firebaseapp.com",
    databaseURL: "https://wrestling-246e2.firebaseio.com",
    storageBucket: "wrestling-246e2.appspot.com",
  };

  firebase.initializeApp(config);

  $scope.isAuthorised = function(){
    return Auth.isAuthorised();
  };

  $scope.login = function() {
    console.log("Trying to log in");
    Auth.login();
  };

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Signed in with: " + user.uid);
      Auth.authorise(true);
      user.providerData.forEach(function (profile) {
        Auth.setUserInfo(user.uid, profile);
      });
      //$route.reload();
    } else {
      console.log("Not Signed in.");
      Auth.authorise(false);
      $route.reload();
    }
  });

  $scope.createUser = function() {

    $scope.user = {};

    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/signup.html',
      title: 'Enter Account Details',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.user.email || !$scope.user.password) {
              e.preventDefault();
            } else {
              myPopup.close();
            }
          }
        }
      ]
    });
    myPopup.then(function(res) {
      Auth.createAccount($scope.user.email, $scope.user.password);
    });
  };

  $scope.logout = function(){
    Auth.signOut();
  };
})
