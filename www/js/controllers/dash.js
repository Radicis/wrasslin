angular.module('starter').controller('DashCtrl', function($scope, $window,$ionicModal,$ionicLoading, $state, Points, Events, Matches, Votes, Auth, $firebaseObject, $firebaseArray, $firebaseAuth, $ionicPopup) {

  // Pull the full list of active events from the Events service
  $scope.show();
  Events.getActive().then(function(events){
      $scope.events = events;
      $scope.hide();
      console.log(events);
  })

  // Refreshes the scope in the case where the update is in memory and not in firebase
  $scope.doRefresh = function() {
      $scope.show();
      Events.getActive().then(function(events){
          $scope.events = events;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.hide();
      });
  };

  // Directs the user to events page
  $scope.goToEvents = function(){
      $state.go("tab.events");
  }

  // Populates the event object (in memory) with its related matches, votes and points
  $scope.getEventInfo = function(event){
    event.userPoints = {};
    Events.getMatches(event).then(function(matches){
      event.matches = matches;
      angular.forEach(event.matches, function(match){
        Matches.getVotes(match).then(function(votes){
          match.votes = votes;
        });
      });
    });
    Points.getEventPoints(event).then(function(points){
      event.userPoints = points;
    });
    $scope.hide();
  };

  // Displays the current event score in a modal
  $scope.showScore = function(event){
    $scope.doRefresh();
    $scope.event = event;
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/modals/showScore.html',
      title: 'Scores',
      scope: $scope,
      buttons: [
        { text: 'Close' }
      ]
    });
  };

  // Allows the user to vote on a match
  $scope.vote = function(event, match, wrestler){
    var uid = firebase.auth().currentUser.uid;
    Auth.get(uid).then(function(userInfo){
      var username = userInfo[0].name;
      Votes.getByMatch(match.$id).then(function(x) {
        if(Votes.hasUserVoted(x, uid)){
          console.log("User has already voted.");
          return false;
        }
        else{
          var newVote = {
            uid: uid,
            name: username,
            img: userInfo[0].photo,
            vote: wrestler,
            date: new Date().toISOString(),
            matchId: match.$id,
            eventId: event.$id
        };
          Votes.add(newVote)
          $scope.doRefresh();
          return true;
        }
      });
    });
  };

  // Determines if the currently logged in user has already votes on the match
  $scope.hasUserVoted = function(match){
    var uid = firebase.auth().currentUser.uid;
    return Votes.hasUserVoted(match.votes, uid);
  };

  // Updates the match with a winning wrestler, assigns points to winning users
  $scope.setWinner = function(match, event){
    $scope.match = match;
    $scope.winner = {};
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/modals/setWinner.html',
      title: 'Who Won?',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Confirm</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.winner.name) {
              alert("Try again");
              e.preventDefault();
            } else {
              console.log("Match won by:" + $scope.winner.name);
              Matches.setWinner(match, $scope.winner.name);
              $scope.assignPoints(match, event, $scope.winner.name, 1);
              $scope.doRefresh();
              myPopup.close();
            }
          }
        }
      ]
    });
  };

  // Assigns points to winning users
  $scope.assignPoints = function(match, event, winner, points){
    Votes.getByMatch(match.$id).then(function(matchVotes) {
      matchVotes.forEach(function(vote){
        var pointsRef = vote.uid + event.$id;
        if(vote.vote==winner){
          Points.getByReference(pointsRef).$loaded().then(function(uPoints){
            if(uPoints.points>0){
              points = uPoints.points + points;
            }
            var newPoints = {
              uid: vote.uid,
              eventId: event.$id,
              matchId: match.$id,
              points: points,
           };
            Points.set(pointsRef, newPoints);
          })
        }
      });
    });
  }

  // Accordian functions
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };



})
