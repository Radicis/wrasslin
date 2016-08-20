angular.module('starter').controller('WrestlersCtrl', function($scope, Wrestlers,$ionicPopup, $firebaseAuth) {

  // Gets all of the wrestlers in the single category
  Wrestlers.getAllMale().then(function(wrestlers) {
    $scope.show();
    $scope.male = wrestlers;
    $scope.hide();
  });

  Wrestlers.getAllTag().then(function(tags){
    $scope.show();
    $scope.tag = tags;
    $scope.hide();
  });

  Wrestlers.getAllFemales().then(function(female){
    $scope.show();
    $scope.female = female;
    $scope.hide();
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
            $scope.saveWrestler($scope.newWrestler);
            myPopup.close();
          }
        }
      }
    ]
  });
};

$scope.saveWrestler = function(wrestler) {
  /*Wrestlers.exists(wrestler.name).then(function(exists){
    console.log(exists);
    if(exists != false){
      alert("Already exists in the database!");
    }
    else{*/
      console.log(wrestler);
      var wrass = Wrestlers.getWikiInfo(wrestler.name);
      var img;
      wrass.then(function(response){
        try{
          var pageId = response.data.continue.imcontinue.split("|")[0];
          var pages = response.data.query.pages;
          var imgsrc = pages[pageId];
          img = imgsrc.thumbnail.source;
        }catch(err){img = null}
        var wrestlerToAdd = {
          name:  wrestler.name.split('(')[0],
          active: true,
          pic: img
        };
        if(wrestler.isFemale){
          Wrestlers.addFemale(wrestlerToAdd);
        } else if (wrestler.isTeam){
          Wrestlers.addTag(wrestlerToAdd);
        } else {
          Wrestlers.addMale(wrestlerToAdd);
        }
        console.log('Created!', wrestler.name);
      });
  };
});
