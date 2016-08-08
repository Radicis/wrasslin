angular.module('starter').service("Auth", function($firebaseAuth){

    var provider = new firebase.auth.GoogleAuthProvider();

  this.authorize = function(){
    console.log("User is: " + $scope.loggedIn);
    return $scope.loggedIn;
  };

  this.login = function(email, password) {
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log("Sign in sucessful!");
        return true;
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log("Error signing in: " + errorMessage);
        return false
      });
  };

  this.createAccount = function(email, password){
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Sign in error: " + error);
        return false;
      });
    return true;
  };

  this.signOut = function(){
    firebase.auth().signOut().then(function() {
      console.log("Signed out!");
    }, function(error) {
      console.log("Signed error: " + error);
    });
  }
})
