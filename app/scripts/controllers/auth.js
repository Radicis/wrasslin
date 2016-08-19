'use strict';
angular.module('Wrasslin').controller('AuthCtrl', function($scope, $state, Auth, $ionicPopup,$ionicLoading){

  var loadingText = [
    'Making Cena win',
    'Cheering for Ziggler',
    'Getting in trouble',
    'Squaring circles',
    'Cocking Fist',
    'Eating Booty Os',
    'Certifying Gs'
  ];

  // shows the loading overlay
  $scope.show = function() {
    var index = Math.floor(Math.random() * (loadingText.length));
    $ionicLoading.show({
      duration: 30000,
      noBackdrop: true,
      template: '<p class="item-icon-left">'+loadingText[index]+'<ion-spinner icon="lines"/></p>'
    }).then(function(){
    });
  };

  // hides the loading overlay
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
    });
  };

  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyA5YRfAkhhtCiAksZVnPFbaIuZfqZPE_No',
    authDomain: 'wrestling-246e2.firebaseapp.com',
    databaseURL: 'https://wrestling-246e2.firebaseio.com',
    storageBucket: 'wrestling-246e2.appspot.com',
  };

  firebase.initializeApp(config);

  // Determines if the user is logged in
  $scope.isAuthorised = function(){
    return Auth.isAuthorised();
  };

  // Logs in the user
  $scope.login = function() {
    console.log('Trying to log in');
    Auth.login();
  };

  // Determines if the logged in user is the creator(owner) of the specified event
  $scope.isCreator = function(event){
    return Auth.isCreator(event);
  };

  // Returns the logged in user's uid
  $scope.getUid = function(){
    if(Auth.isAuthorised()) {
      return firebase.auth().currentUser.uid;
    }
  };

  // Listens for auth state changes
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Signed in with: ' + user.uid);
      // Set the authorised flag
      Auth.authorise(true);
      user.providerData.forEach(function (profile) {
        // Create the custom user info record to asssociate this user with name/image
        Auth.setUserInfo(user.uid, profile);
      });
      $scope.$apply();
    } else {
      console.log('Not Signed in.');
      Auth.authorise(false);
      $scope.$apply();
    }
  });

  // NYI email password login
  $scope.createUser = function() {
    $scope.user = {};
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/modals/signup.html',
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
              Auth.createAccount($scope.user.email, $scope.user.password);
              myPopup.close();
            }
          }
        }
      ]
    });
  };

  // Signs out the user
  $scope.logout = function(){
    Auth.signOut();
  };
});
