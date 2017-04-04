angular.module('starter').controller('WrestlersCtrl', function($scope, Wrestlers,$ionicPopup, $firebaseAuth) {

  $scope.single = Wrestlers.getAllSingle();

  $scope.tag = Wrestlers.getAllTag();

  $scope.delete = function(wrestler){
    $scope.check = {};
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/confirmDelete.html',
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
  };

  $scope.addWrestler = function(){
    $scope.newWrestler = {};

    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/addWrestler.html',
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
        firebase.database().ref('wrestlers/').push({
          isTeam: $scope.newWrestler.isTeam,
          name:  $scope.newWrestler.name.split('(')[0],
          active: true,
          pic: img
        });
        console.log('Created!', $scope.newWrestler.name);
      });
    });
  };
});
