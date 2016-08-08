angular.module('starter').controller('DashCtrl', function($scope, Events, UserInfo, $firebaseObject, $firebaseArray, $firebaseAuth, $ionicPopup) {

    var ref = firebase.database().ref();
    $scope.userPoints = [];

    $scope.events = Events.getActive();

    $scope.getMatches = function(event){
      event.matches = $firebaseArray(ref.child('matches').orderByChild("eventId").equalTo(event.$id));
      $scope.getPoints(event);
    };

    $scope.getPoints = function(event){
      event.userPoints = [];
      var eventRef = ref.child("events").child(event.$id);
      var points = $firebaseArray(eventRef.child("points"));
      points.$loaded().then(function(x) {
        angular.forEach(points, function(key, val){
            UserInfo.get(key.uid).then(function(info){
                console.log(info[0]);
                console.log("name: " + info[0].name);
                event.userPoints.push({name: info[0].name, points: key.points});
            });
        });
      });
    };

    $scope.vote = function(matchId, wrestler){
      var uid = firebase.auth().currentUser.uid;
      var matchRef = firebase.database().ref().child("matches").child(matchId);
      var votes = matchRef.child('votes');
      var currentVotesRef = votes.orderByChild('uid').equalTo(uid);
      var currentVotes = $firebaseArray(currentVotesRef);
      currentVotes.$loaded().then(function(x) {
        if(currentVotes.length>0){
          console.log("Duplicate");
          return false;
        }
        else{
          votes.push({uid: uid, vote: wrestler});
        }
      });
    };

    $scope.hasVoted = function(matchId){
        var uid = firebase.auth().currentUser.uid;
        var matchRef = firebase.database().ref().child("matches").child(matchId);
        var votes = matchRef.child('votes');
        var currentVotesRef = votes.orderByChild('uid').equalTo(uid);
        var currentVotes = $firebaseArray(currentVotesRef);
        currentVotes.$loaded().then(function(x) {
          if(currentVotes.length>0){
            return false;
          }
          return true;
        });
    }

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
        $scope.assignPoints(match, event);
      });
    };

    $scope.assignPoints = function(match, event){
      var eventRef = firebase.database().ref().child("events").child(event.$id);
      var votes = match.votes;
      var winningVotes = [];
      angular.forEach(votes, function(key, val){
        if(key.vote==match.winner){
          winningVotes.push(key.uid);
        }
      });

      var currentPoints = $firebaseArray(eventRef.child("points"));
      var newPoints = [];

        for(var i=0; i<winningVotes.length;i++) {
          eventRef.child('points').push({
            uid: winningVotes[i],
            points: 1
          });
        }
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
