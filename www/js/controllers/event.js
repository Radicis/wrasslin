angular.module('starter').controller('EventDetailCtrl', function($scope,  $ionicPopup, $stateParams, Events, Matches, $firebaseObject) {

    var ref = firebase.database().ref();
    var eventId = $stateParams.eventId;

    $scope.event = Events.get(eventId);
    $scope.eventMatches = Matches.getByEvent(eventId);
    $scope.wrestlers = $firebaseObject(ref.child('wrestlers').orderByChild("name"));

    $scope.addMatch = function(){

      $scope.newMatch = {};
      $scope.matchTypes = ['Single', 'Tag-Team'];
      $scope.selectedMatchtype;

      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/addMatch.html',
        title: 'Enter Match Details',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.newMatch.p1 || !$scope.newMatch.p2) {
                alert("Try again");
                e.preventDefault();
              } else {
                myPopup.close();
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        createMatch($stateParams.eventId, $scope.selectedMatchtype, $scope.newMatch.p1.name, $scope.newMatch.p2.name);
        console.log('Created!');
      });
    };

    $scope.matchTypeChanged = function(matchType){
      $scope.selectedMatchtype = matchType;
    };

    var createMatch = function (eventId, type, p1, p2) {
      firebase.database().ref('matches/').push({
        eventId: eventId,
        type: type,
        p1: p1,
        p2: p2,
        date: new Date().toISOString(),
        active: true
      });
    };

  })
