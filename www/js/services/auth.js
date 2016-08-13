angular.module('starter').service("Auth", function($q, $firebaseAuth, $cordovaOauth, $firebaseArray){

  var provider = new firebase.auth.GoogleAuthProvider();

  var loggedIn = false;

  this.isAuthorised = function(){
    return loggedIn;
  };

  this.authorise = function(value){
    loggedIn = value;
  };

  this.get = function(uid){
    var def = $q.defer();
    var userInfoRef = firebase.database().ref().child("userInfo").orderByChild("uid").equalTo(uid);
    var userInfo = $firebaseArray(userInfoRef);
    userInfo.$loaded().then(function(snap){
      def.resolve(snap);
    });
    return def.promise;
  };

  this.setUserInfo = function(uid, profile){
    firebase.database().ref('userInfo').child(uid).set({
      uid: uid,
      name: profile.displayName,
      email: profile.email,
      photo: profile.photoURL
    });
  };

  this.login = function(email, password) {
    // true if running on native device
    if (window.cordova) {
      $cordovaOauth.facebook("1753255498267207", ["email"]).then(function(result){
        console.log("Response Object -> " + JSON.stringify(result));
        var credential = firebase.auth.FacebookAuthProvider.credential(
          result.access_token);

        firebase.auth().signInWithCredential(credential).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });

      });

      // $cordovaOauth.google("355986396669-jf11simegnn5l7t1fdvklr2s9rv276ge.apps.googleusercontent.com", ["email"]).then(function (result) {
      //   console.log("Response Object -> " + JSON.stringify(result));
      //   var credential = firebase.auth.GoogleAuthProvider.credential(result.access_token);
      //   // Sign in with credential from the Google user.
      //   firebase.auth().signInWithCredential(credential).then(function (response) {
      //     console.log(response);
      //     // This gives you a Google Access Token. You can use it to access the Google API.
      //     // var token = result.credential.accessToken;
      //     // // The signed-in user info.
      //     // var user = result.user;
      //     console.log("Sign in sucessful!");
      //     return true;
      //   }).catch(function(error) {
      //     // Handle Errors here.
      //     var errorCode = error.code;
      //     var errorMessage = error.message;
      //     // The email of the user's account used.
      //     var email = error.email;
      //     // The firebase.auth.AuthCredential type that was used.
      //     var credential = error.credential;
      //     console.log("error: " + error.message);
      //   });
      // }, function (error) {
      //   console.log("Error -> " + error);
      //   return false;
      // });
    }
    else {
      firebase.auth().signInWithRedirect(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log("Sign in sucessful!");
        return true;
      }).catch(function (error) {
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
    }

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
