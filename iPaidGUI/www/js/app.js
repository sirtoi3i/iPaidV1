// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var ang = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services']);


ang.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
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
});

ang.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })

        .state('login', {
            url: "/app/login",
            templateUrl: "templates/login.html",
            controller: 'LoginCtrl'
        })

        .state('register', {
            url: "/register",
            templateUrl: "templates/register.html",
            controller: 'LoginCtrl'
        })

        .state('app.admin', {
            url: "/admin",
            views: {
                'menuContent': {
                    templateUrl: "templates/admin.html",
                    controller: 'AdminCtrl'
                }
            }
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



        /*

         .state('app.list.sub', {
         url: "/sub",
         views: {
         'list_purchases': {
         templateUrl: "templates/list_purchases.html"
         },
         'list_member': {
         templateUrl: "templates/list_member.html"
         },
         'list_statistics': {
         templateUrl: "templates/list_statistics.html"
         }
         }
         })

         .state('app.list.member', {
         url: "/member",
         views: {
         'listContent': {
         templateUrl: "templates/list_member.html"
         }
         }
         })

         .state('app.list.statistics', {
         url: "/statistics",
         views: {
         'listContent': {
         templateUrl: "templates/list_statistics.html"
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

         */



        .state('app.purchaseTitle', {
            url: "/purchaseTitle/:purchaseId",
            views: {
                'menuContent': {
                    templateUrl: "templates/purchaseTitle.html",
                    controller: 'PurchaseDetailCtrl'
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
        .state('app.profile', {
            url: "/profile/:email",
            views: {
                'menuContent': {
                    templateUrl: "templates/profile.html",
                    controller: 'ProfileCtrl'
                }
            }
        })
            .state('app.members', {
                url: "/members",
                views: {
                    'menuContent': {
                        templateUrl: "templates/members.html"
                    }
                }
            });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
