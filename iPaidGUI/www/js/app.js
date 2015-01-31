// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.lists', {
    url: "/lists",
    views: {
      'menuContent': {
        templateUrl: "templates/lists.html",
        controller: 'ListsCtrl'
      }
    }
  })
  
  
   .state('app.newList', {
    url: "/newList",
    views: {
      'menuContent': {
        templateUrl: "templates/newList.html",
        controller: 'NewListCtrl'
      }
    }
  })
  
  .state('app.list', {
    url: "/lists/:listId",
    views: {
      'menuContent': {
        templateUrl: "templates/list.html",
        controller: 'ListDetailCtrl'
      }
    }
  })
  
   .state('app.newPurchase', {
    url: "/newPurchase",
    views: {
      'menuContent': {
        templateUrl: "templates/newPurchase.html"
      }
    }
  })
  
      .state('app.purchaseTitle', {
        url: "/purchaseTitle",
        views: {
            'menuContent': {
                templateUrl: "templates/purchaseTitle.html"
            }
        }
    })
  
  .state('app.purchase', {
    url: "/purchases/:purchaseId",
    views: {
      'menuContent': {
        templateUrl: "templates/purchase.html",
        controller: 'PurchaseDetailCtrl'
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })
  
      .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent': {
          templateUrl: "templates/profile.html"
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/lists');
});
