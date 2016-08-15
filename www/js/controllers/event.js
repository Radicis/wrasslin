angular.module('starter').controller('EventDetailCtrl', function($scope,Wrestlers, Auth, Points,  $ionicPopup, $stateParams, Events, Matches, $firebaseObject) {

  // eventID parameter pulled from URI parsing
  var eventId = $stateParams.eventId;

  // gets the specified event if from firebase
  Events.get(eventId).then(function(event){
      $scope.event = event;
      // gets all the matches for that event
      $scope.eventMatches = Matches.getByEvent(eventId);
      // Populates the event with the relevant info (in memory)

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

  });
    
  // gets all of the wresters in the firebase to populate the add match dropdowns
  $scope.wrestlers = Wrestlers.getAll();

  // compares 2 objects based on their points property
  var comparePoints = function(a,b) {
    if (a.points < b.points)
      return -1;
    if (a.last_nom > b.last_nom)
      return 1;
    return 0;
  };

  // Completes the event, calculates winner, sets active to false
  $scope.eventComplete = function(event){
    var winner = null;
    Points.getEventPoints(event).then(function(points){
      console.log(points)
      console.log(points[0]);
      points.sort(comparePoints);
      winner = points[0].name;
    });

      // get max of userPoints
      // event.userPoints.forEach(function(points){
      //   if(points.points>winnerPoints){
      //     winner.name = points.name,
      //     winner.points = points.points
      //   }
      //   // account for tie
      // });
    // });

    if(winner) {
      firebase.database().ref('events').child(event.$id).set({
        name: event.name,
        location: event.location,
        date: event.date,
        active: false,
        owner: event.owner,
        winner: winner
      });
    }
  };

  // Adds a match to the event
  $scope.addMatch = function(){

    $scope.newMatch = {};
    $scope.matchTypes = ['Single', 'Tag-Team'];
    $scope.selectedMatchtype;

    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/modals/addMatch.html',
      title: 'Enter Match Details',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-balaned',
          onTap: function(e) {
            if (!$scope.newMatch.p1 || !$scope.newMatch.p2) {
              alert("Try again");
              e.preventDefault();
            } else {
              Matches.createMatch($stateParams.eventId, $scope.selectedMatchtype, $scope.newMatch.p1.name, $scope.newMatch.p2.name);
              console.log('Created!');
              myPopup.close();
            }
          }
        }
      ]
    });
  };

  // Swaps from single ot tag team
  $scope.matchTypeChanged = function(matchType){
    $scope.selectedMatchtype = matchType;
  };
})
