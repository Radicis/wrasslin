angular.module('starter').controller('EventDetailCtrl', function($scope,Wrestlers, Auth, Points,  $ionicPopup, $stateParams, Events, Matches, $firebaseObject) {

  $scope.show();

  // eventID parameter pulled from URI parsing
  var eventId = $stateParams.eventId;

  // gets the specified event if from firebase
  Events.get(eventId).then(function(event){
      $scope.event = event;
      // gets all the matches for that event
      $scope.eventMatches = Matches.getByEvent(eventId);
      // Populates the event object (in memory) with its related matches, votes and points
        event.userPoints = {};
        Events.getMatches(event).then(function(matches){
          event.matches = matches;
          angular.forEach(event.matches, function(match){
            Matches.getVotes(match).then(function(votes){
              match.votes = votes;
            });
          });
        });
        Points.getByEvent(event).then(function(points){
          event.userPoints = points;
        });
        $scope.hide();
  });

  // Displays the current event score in a modal
  $scope.showScore = function(event){
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/modals/showScore.html',
      title: 'Scores',
      scope: $scope,
      buttons: [
        { text: 'Close' }
      ]
    });
  };

  // compares 2 objects based on their points property
  var comparePoints = function(a,b) {
    console.log(a);

    console.log("Apoint: " + a.points);
    console.log(b);
    console.log("BpointS: " + b.points);
    if (a.points < b.points)
      return -1;
    if (a.points > b.points)
      return 1;
    return 0;
  };

  // Completes the event, calculates winner, sets active to false
  $scope.eventComplete = function(event){
    var points = event.userPoints;

    points.sort(comparePoints);



    var winner = points[points.length-1].name;

    // Points.getEventPoints(event).then(function(points){
    //  points.sort(comparePoints);
    //  var winningPoints = [];
    //   // Check for a tie
    //   points.map(function(point){
    //     console.log(point);
    //     if(point.points==points[0].points){
    //         winningPoints.push(point);
    //     }
    //   });
    //   if(winningPoints.length>1){
    //       $scope.winner = {};
    //       var myPopup = $ionicPopup.show({
    //         templateUrl: 'templates/modals/tieBreaker.html',
    //         title: 'Tie Breaker!',
    //         scope: $scope,
    //         buttons: [
    //           { text: 'Cancel' },
    //           {
    //             text: '<b>Save</b>',
    //             type: 'button-balaned',
    //             onTap: function(e) {
    //               if (!$scope.winner.name) {
    //                 alert("Try again");
    //                 e.preventDefault();
    //               } else {
    //                 winner = $scope.winner.name;
    //                 myPopup.close();
    //               }
    //             }
    //           }
    //         ]
    //       });
    //   }
    //   else{
    //       winner = points[0].name;
    //   }
    // });

    if(winner) {
      firebase.database().ref('events').child(event.$id).child("winner").set(winner);
      firebase.database().ref('events').child(event.$id).child("active").set(false);
    }
  };

  // gets all of the wresters in the firebase to populate the add match dropdowns
  Wrestlers.getAllSingle().then(function(wrestlers){
      $scope.wrestlers = wrestlers;
  })
  Wrestlers.getAllTag().then(function(wrestlers){
      $scope.teams = wrestlers;
  })

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
