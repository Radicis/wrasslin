angular.module('starter').controller('DashCtrl', function($scope, $window, Points, Events, Matches, Votes, Auth, $firebaseObject, $firebaseArray, $firebaseAuth, $ionicPopup) {

    var ref = firebase.database().ref();
    $scope.userPoints = [];

    $scope.events = Events.getActive();

    $scope.doRefresh = function() {
       $scope.events = Events.getActive();
       $scope.$broadcast('scroll.refreshComplete');
    };

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
            firebase.database().ref('votes/').push({
              uid: uid,
              name: username,
              img: userInfo[0].photo,
              vote: wrestler,
              date: new Date().toISOString(),
              matchId: match.$id,
              eventId: event.$id
            });
            $scope.doRefresh();
            return true;
          }
        });
      });
    };

    $scope.hasUserVoted = function(match){
        var uid = firebase.auth().currentUser.uid;
        return Votes.hasUserVoted(match.votes, uid);
    };

    $scope.setWinner = function(match, event){
      $scope.match = match;
      $scope.winner = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/setWinner.html',
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
                myPopup.close();
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        console.log("Match won by:" + $scope.winner.name);
        var matchRef = firebase.database().ref().child("matches").child(match.$id);
        matchRef.update({winner: $scope.winner.name, active: false});
        $scope.assignPoints(match, event, $scope.winner.name, 1);
        $scope.doRefresh();
      });
    };

    $scope.assignPoints = function(match, event, winner, points){
        Votes.getByMatch(match.$id).then(function(matchVotes) {
            matchVotes.forEach(function(vote){
                var pointsRef = vote.uid + event.$id;
                if(vote.vote==winner){
                    Points.getByReference(pointsRef).$loaded().then(function(uPoints){
                        if(uPoints.points>0){
                            points = uPoints.points + points;
                        }
                        firebase.database().ref('points').child(pointsRef).set({
                            uid: vote.uid,
                            eventId: event.$id,
                            matchId: match.$id,
                            points: points,
                        });
                    })
                }
        });
    });
}
    /*
       * if given group is the selected group, deselect it
       * else, select the given group
       */
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
