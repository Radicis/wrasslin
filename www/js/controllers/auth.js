angular.module('starter').controller("AuthCtrl", function($scope, Auth, $ionicPopup){

  var provider = new firebase.auth.GoogleAuthProvider();

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCkeZQPg-wYtS08LQDqFKyDN4_aCvu6nkY",
    authDomain: "project-2974987705063058636.firebaseapp.com",
    databaseURL: "https://project-2974987705063058636.firebaseio.com",
    storageBucket: "project--2974987705063058636.appspot.com",
  };
  firebase.initializeApp(config);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Signed in with: " + user.uid);
      $scope.loggedIn = true;
      user.providerData.forEach(function (profile) {
        var userRef = firebase.database().ref('userInfo');

        var existingUser = userRef.child("uid").equalTo(user.uid);

        // if($firebaseArray(existingUser).length>0){
        //     console.log("Already in db");
        // }
        // else{
        //     console.log("not in db");
        // }

        // if($firebaseArray(userRef.child("uid").equalTo(user.uid)).length>0){
        //     console.log("Already in db");
        // }
        // console.log("Sign-in provider: "+profile.providerId);
        // console.log("  Provider-specific UID: "+profile.uid);
        // console.log("  Name: "+profile.displayName);
        // console.log("  Email: "+profile.email);
        // console.log("  Photo URL: "+profile.photoURL);


      //   var newUser = {
      //     uid: user.uid,
      //     name: profile.displayName,
      //     photo: profile.photoURL
      //   };
      //   console.log(newUser);
      //   userRef.push(newUser);
      });

      $state.reload();
    } else {
      console.log("Not Signed in ");
      $scope.loggedIn = false;
      $state.reload();
    }
  });

  $scope.login = function() {
    Auth.login();
  };

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
