angular.module('starter').controller('WrestlersCtrl', function($scope, Wrestlers,$ionicPopup, $firebaseAuth) {

  // Gets all of the westers in the single category
  Wrestlers.getAllSingle().then(function(wrestlers){
      $scope.show();
      $scope.single = wrestlers;
      // Gets all of the tags teams
      Wrestlers.getAllTag().then(function(tags){
          $scope.tag = tags;
          $scope.hide();
      });
  });

  // displays a confirmation to the user and dletes the wrestler is confirmed
  $scope.delete = function(wrestler){
    $scope.check = {};
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/modals/confirmDelete.html',
      title: 'Enter Name',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Delete</b>',
          type: 'button-assertive',
          onTap: function(e) {
            console.log($scope.check.confirmDelete);
            if ($scope.check.confirmDelete==true) {
              Wrestlers.delete(wrestler);
            } else {
              myPopup.close();
            }
          }
        }
      ]
    });
  }

  // Adds a new wrestler to the firebase and tries to pull the image from wiki
  $scope.addWrestler = function(){
    $scope.newWrestler = {};

    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/modals/addWrestler.html',
      title: 'Enter Name',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-balanced',
          onTap: function(e) {
            if (!$scope.newWrestler.name) {
              e.preventDefault();
            } else {
              myPopup.close();
            }
          }
        }
      ]
    });
    myPopup.then(function(res) {
      var wrass = Wrestlers.getWikiInfo($scope.newWrestler.name);
      var img;

      wrass.then(function(response){
        try{
          var pageId = response.data.continue.imcontinue.split("|")[0];
          var pages = response.data.query.pages;
          var imgsrc = pages[pageId];
          img = imgsrc.thumbnail.source;
        }catch(err){img = null}
        var wrestler = {
          isTeam: $scope.newWrestler.isTeam,
          name:  $scope.newWrestler.name.split('(')[0],
          active: true,
          pic: img
        }
        Wrestlers.add(wrestler);
        console.log('Created!', $scope.newWrestler.name);
      });
    });
  };
});
