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

    .controller('ListsCtrl', function ($scope, Lists) {
        $scope.lists = Lists.all();
        $scope.remove = function (list) {
            Lists.remove(list);
        }
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

    .controller('NewListCtrl', function ($scope, $stateParams, $ionicPopup, $window, $ionicModal, PouchDBListener) {


        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/catChoice.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.icon = "icon ion-ios7-plus-outline cat";
        $scope.returnCat = function ($event) {
            $scope.icon = $event.currentTarget.className;
            list.icon = $scope.icon;
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


        $scope.todos = [];


        $scope.saveList = function (list) {
            console.log("$scope.listTitle");
            console.log(list.title);
            console.log(list.icon);
            localDB.post({list: list});
        };


        $scope.$on('add', function (event, todo) {
            $scope.todos.push(todo);
        });

        $scope.$on('delete', function (event, id) {
            for (var i = 0; i < $scope.todos.length; i++) {
                if ($scope.todos[i]._id === id) {
                    $scope.todos.splice(i, 1);
                }
            }
        });

        $scope.create = function () {
            $ionicPopup.prompt({
                title: 'Enter a new TODO item',
                inputType: 'text'
            })
                .then(function (result) {
                    if (result !== "") {
                        if ($scope.hasOwnProperty("todos") !== true) {
                            $scope.todos = [];
                        }
                        console.log("Result: " + result);
                        localDB.post({titleTBo: result});
                    } else {
                        console.log("Action not completed");
                    }
                });
        };

    })
    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            {title: 'Reggae', id: 1},
            {title: 'Chill', id: 2},
            {title: 'Dubstep', id: 3},
            {title: 'Indie', id: 4},
            {title: 'Rap', id: 5},
            {title: 'Cowbell', id: 6}
        ];
    })
