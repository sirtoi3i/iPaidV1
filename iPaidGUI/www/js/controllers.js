angular.module('starter.controllers', [])
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };


        $ionicModal.fromTemplateUrl('templates/newPurchase.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closePurchase = function () {
            $scope.modal.hide();
        };

        // Open the purchase modal
        $scope.newPurchase = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })
    .controller('MyCtrl', function ($scope, $ionicHistory) {
        $scope.myGoBack = function () {
            $ionicHistory.goBack();
        };
    })

    .controller('AdminCtrl', function ($scope) {

        $scope.delDBs = function () {

            localDB.destroy(function (err, info) {
            });
            remoteDB.destroy(function (err, info) {
            });
        };


    })

    .controller('ListsCtrl', function ($scope, Lists) {
        $scope.lists = [];

        localDB.allDocs({include_docs: true}, function (err, response) {

            angular.forEach(response.rows, function (value, key) {
                $scope.lists.push(value.doc);
            }, console.debug(""));

        });

        //console.debug(JSON.stringify(Lists.all()));
        //$scope.lists=Lists.all();

        $scope.$on('add', function (event, list) {
            console.debug("add");
            console.debug(JSON.stringify(list));
            $scope.lists.push(list);
        });

    })

    .controller('ListDetailCtrl', function ($scope, $stateParams, Lists) {
        $scope.list = Lists.get($stateParams.listId);
    })

    .controller('UsersCtrl', function ($scope, Users) {
        $scope.users = Users.all();
    })

    .controller('UserDetailCtrl', function ($scope, $stateParams, Users) {
        $scope.user = Users.get($stateParams.userId);
    })


    .controller('PurchaseDetailCtrl', function ($scope, $stateParams, Lists) {
        $scope.list = Lists.get($stateParams.purchaseId);
    })

    .controller('NewListCtrl', function ($scope, $stateParams, $ionicPopup, $ionicHistory, $window, $ionicModal, PouchDBListener) {
        $scope.lists = [];
        $scope.list = [];
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/catChoice.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.list.icon = "icon ion-ios7-plus-outline cat";
        $scope.returnCat = function ($event) {
            $scope.list.icon = $event.currentTarget.className;

            $scope.modal.hide();
        }

        // Triggered in the login modal to close it
        $scope.closeCat = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.openCat = function () {
            $scope.modal.show();
        };


        $scope.saveList = function () {
            var listObj = {
                _id: "tobi" + "list" + new Date().toJSON(),
                title: $scope.list.title,
                date: '01.09.2013',
                balance: '125,00',
                icon: $scope.list.icon
            };

            localDB.put(listObj);
            $ionicHistory.goBack();
        };

        $scope.$on('add', function (event, list) {
            $scope.lists.push(list);
        });

        $scope.$on('delete', function (event, id) {
            for (var i = 0; i < $scope.lists.length; i++) {
                if ($scope.lists[i]._id === id) {
                    $scope.lists.splice(i, 1);
                }
            }
        });


    })