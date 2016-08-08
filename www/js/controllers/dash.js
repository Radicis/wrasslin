angular.module('starter').controller('DashCtrl', function($scope, Events, Matches, Votes, UserInfo, $firebaseObject, $firebaseArray, $firebaseAuth, $ionicPopup) {

    var ref = firebase.database().ref();
    $scope.userPoints = [];

    $scope.events = Events.getActive();

    $scope.getMatches = function(event){
      var matches = $firebaseArray(ref.child('matches').orderByChild("eventId").equalTo(event.$id));
      var votes = [];
      matches.$loaded().then(function(){
        angular.forEach(matches, function(key){
          $scope.getVotes(key);
        });
        event.matches = matches;
      });
      $scope.getPoints(event);
    };

    $scope.getVotes = function(match){
     var votes = $firebaseArray(ref.child('votes').orderByChild("matchId").equalTo(match.$id));
     votes.$loaded().then(function(){
        match.votes = votes;
     })
    };

    $scope.getPoints = function(event){
      event.userPoints = [];
      Votes.getByEvent(event.$id).then(function(x) {
        angular.forEach(x, function(key){
          var points = 0;
          angular.forEach(event.userPoints, function(key){
            //if(key.uid===????)
          });
          // loop to increment points for each point???
            UserInfo.get(key.uid).then(function(info){
                event.userPoints.push({uid: info[0].uid, name: info[0].name, points: points});
            });
        });
      });
    };

    $scope.vote = function(eventId, matchId, wrestler){
      var uid = firebase.auth().currentUser.uid;
      UserInfo.get(uid).then(function(info){
        var username = info[0].name;
        Votes.getByMatch(matchId).then(function(x) {
           if(Votes.hasUserVoted(uid, x)){
            console.log("Duplicate vote!");
            return false;
          }
          else{
            console.log("Saving vote!");
            firebase.database().ref('votes/').push({
              uid: uid,
              name: username,
              vote: wrestler,
              date: new Date().toISOString(),
              matchId: matchId,
              eventId: eventId
            });
            return true;
          }
        });
      });
    };

    $scope.hasUserVoted = function(match){
        var uid = firebase.auth().currentUser.uid;
        var voted = false;
        angular.forEach(match.votes, function(key){
          if(key.uid===uid){
            voted = true;
          }
        });
      return voted;
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
        // $scope.assignPoints(match, event);
      });
    };

    // $scope.assignPoints = function(match, event){
    //   var votes = match.votes;
    //   angular.forEach(votes, function(key){
    //     console.log(key.vote);
    //     if(key.vote==match.winner){
    //       firebase.database().ref().child("points/").push({
    //         uid: uid,
    //         matchId: match.$id,
    //         eventId: event.$id,
    //         points: 1
    //       });
    //     }
    //   });
    // };

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
