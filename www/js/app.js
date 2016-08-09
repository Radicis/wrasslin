// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
    .state('tab.login', {
      url: '/login',
      views: {
        'tab-login': {
          templateUrl: 'templates/tab-login.html',
          controller: 'AuthCtrl'
        }
      }
    })
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

    .state('tab.events', {
      url: '/events',
    //   resolve: {
    //       Events: 'Events',
    //       events: function($firebaseArray, Events) {
    //         // load the view, when the data is available
    //         // this is where $loaded() belongs
    //         return $firebaseArray(Events.getall()).$loaded();
    //       }
    //     }
      views: {
        'tab-events': {
          templateUrl: 'templates/tab-events.html',
          controller: 'EventCtrl'
        }
      }
    })

    .state('tab.events-detail', {
      url: '/events/:eventId',
      views: {
        'tab-events': {
          templateUrl: 'templates/tab-event-detail.html',
          controller: 'EventDetailCtrl'
        }
      }
    })


  .state('tab.wrestlers', {
    url: '/wrestlers',
    views: {
      'tab-wrestlers': {
        templateUrl: 'templates/tab-wrestlers.html',
        controller: 'WrestlersCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
