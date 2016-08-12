angular.module('starter').controller('EventDetailCtrl', function($scope, Auth, Points,  $ionicPopup, $stateParams, Events, Matches, $firebaseObject) {

  var ref = firebase.database().ref();
  var eventId = $stateParams.eventId;

  $scope.event = Events.get(eventId);
  $scope.eventMatches = Matches.getByEvent(eventId);
  $scope.wrestlers = $firebaseObject(ref.child('wrestlers').orderByChild("name"));

  $scope.getEventInfo = function(event){
    Events.getMatches(event).then(function(matches){
      event.matches = matches;
      angular.forEach(event.matches, function(match){
        Matches.getVotes(match).then(function(votes){
          match.votes = votes;
        });
      });
    });
    Points.getByEvent(event).then(function(points){
      event.userPoints = [];
      points.forEach(function(point){
        Auth.get(point.uid).then(function(userInfo){
          Points.getByReference(point.uid + point.eventId).$loaded().then(function(uPoint){
            event.userPoints.push({uid: uPoint.uid, name: userInfo[0].name, points: uPoint.points});
          });
        });
      });
    });
  };

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
