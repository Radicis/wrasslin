angular.module('starter').controller('DashCtrl', function($scope, $window, $ionicModal, $ionicLoading, $state, Points, Events, Matches, Votes, Auth, $firebaseObject, $firebaseArray, $firebaseAuth, $ionicPopup) {

  // Pull the full list of active events from the Events service
  $scope.show();

  Events.getRecentActive().then(function(events){
      $scope.notify = 0;
      if(!events[0]){
          console.log("No Event found. Showing last active");
          Events.getLastActive().then(function(lastActive){
              $scope.lastActiveEvent = lastActive;
          });
      }
      else{
          $scope.activeEvent = events[0];
      }
    $scope.hide();
});

    $scope.clearNotifications = function(){
        $scope.notify = 0;
        $state.go("tab.dash");
    }

    var ref = firebase.database().ref();
    var matchRef = ref.child("matches");
    matchRef.on('child_added', function(data){
        $scope.notify = $scope.notify+1;
        //$scope.doRefresh();
    });
    var votesRef = ref.child("votes");
    votesRef.on('child_added', function(data){
        //$scope.doRefresh();
    });


    $scope.getMatchInfo = function(match){
        console.log(match);
        match = Matches.get(match.matchId);
        console.log(match);
    }

    $scope.getVoteInfo = function(vote){
        vote = Votes.get(votes.$id);
    }

  // Directs the user to events page
  $scope.goToEvents = function(){
    $state.go("tab.events");
  }


  // Displays the current event score in a modal
  $scope.showScore = function(eventObj){
    $scope.event = eventObj;
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
  $scope.vote = function(eventObj, match, wrestler){
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
            date: firebase.database.ServerValue.TIMESTAMP,
            matchId: match.$id,
            eventId: eventObj.$id
          };
          Votes.add(newVote);
          //$scope.doRefresh();
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
  $scope.setWinner = function(match, eventObj){
    $scope.match = match;
    $scope.match.noContest = "noContest";
    $scope.winner = {};
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/modals/setWinner.html',
      title: 'Who Won?',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Confirm</b>',
          type: 'button-balanced',
          onTap: function(e) {
            if (!$scope.winner.name) {
              console.log("Try again");
              e.preventDefault();
            }
            else {
              console.log("Match won by:" + $scope.winner.name);
              Matches.setWinner(match, $scope.winner.name);
              if($scope.winner.name!="noContest"){
                $scope.assignPoints(match, eventObj.$id, $scope.winner.name, 1);
              }
              $scope.doRefresh();
              myPopup.close();
            }
          }
        }
      ]
    });
  };

  // Assigns points to winning users
  $scope.assignPoints = function(match, eventObjId, winner, points){
    Votes.getByMatch(match.$id).then(function(matchVotes) {
      matchVotes.forEach(function(vote){
        if(vote.vote==winner){
          Points.getByReference(eventObjId, vote.uid).$loaded().then(function(uPoints){
            if(uPoints.points>0){
              points = uPoints.points + 1;
            }
              var newPoints = {
                uid: vote.uid,
                eventId: eventObjId,
                matchId: match.$id,
                points: points,
                name: vote.name,
                img: vote.img,
              };
              Points.set(eventObjId, vote.uid, newPoints);
          });
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
