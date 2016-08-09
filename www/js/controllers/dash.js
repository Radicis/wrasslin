angular.module('starter').controller('DashCtrl', function($scope, Events, Matches, Votes, Auth, $firebaseObject, $firebaseArray, $firebaseAuth, $ionicPopup) {

    var ref = firebase.database().ref();
    $scope.userPoints = [];

    $scope.events = Events.getActive();

    $scope.getMatches = function(event){
      Events.getMatches(event).then(function(x){
          event.matches = x;
          angular.forEach(event.matches, function(match){
               Matches.getVotes(match).then(function(x){
                   match.votes = x;
               });
          });
      });
      event.userPoints = Events.getPoints(event);
    };

    $scope.vote = function(eventId, matchId, wrestler){
      var uid = firebase.auth().currentUser.uid;
      Auth.get(uid).then(function(info){
        console.log(uid);
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
              img: info[0].photo,
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
