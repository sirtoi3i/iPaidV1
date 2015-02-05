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

    .controller('AdminCtrl', function ($scope, pouchWrapper) {

        $scope.delDBs = function () {
            pouchWrapper.removeAll();

        };


    })


    .controller('ListDetailCtrl', function ($scope, $stateParams, pouchPurchWrapper, pouchListWrapper, $ionicModal, $ionicHistory) {
        $scope.purch = {};
        pouchListWrapper.get($stateParams.listId).then(
            function onSuccess(doc) {
                $scope.list = doc;
            },
            function onError(err) {
                $scope.list = null;
            });


        $scope.purchases = [];

        $scope.$on('newPurch', function (event, purch) {
            $scope.purchases.push(purch);

        });


        $ionicModal.fromTemplateUrl('templates/newPurchase.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });


        $scope.closePurchase = function () {
            $scope.modal.hide();
        };


        $scope.newPurchase = function () {
            $scope.modal.show();
        };


        $scope.savePurchase = function () {

            pouchPurchWrapper.add($scope.purch, $stateParams.listId).then(function (res) {
                console.log(res);
            }, function (reason) {
                console.log(reason);
            });
            $ionicHistory.goBack();
            $scope.modal.show();
        };


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


    .controller('ListsCtrl', function ($scope, pouchListener, pouchListWrapper) {


        $scope.remove = function (id) {
            pouchListWrapper.remove(id).then(function (res) {
//      console.log(res);
            }, function (reason) {
                console.log(reason);
            })
        };

        $scope.lists = [];

        $scope.$on('newList', function (event, l) {
            $scope.lists.push(l);
        });

        $scope.$on('delList', function (event, id) {
            for (var i = 0; i < $scope.lists.length; i++) {
                if ($scope.lists[i]._id === id) {
                    $scope.lists.splice(i, 1);
                }
            }
        });


    })

    .controller('NewListCtrl', function ($scope, pouchListener, pouchListWrapper, $stateParams, $ionicHistory, $ionicModal) {

        //CAT Modal
        $ionicModal.fromTemplateUrl('templates/catChoice.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });


        $scope.list = {};
        $scope.list.icon = "icon ion-ios7-plus-outline cat";
        $scope.returnCat = function ($event) {
            $scope.list.icon = $event.currentTarget.className;
            $scope.modal.hide();
        }

        $scope.closeCat = function () {
            $scope.modal.hide();
        };

        $scope.openCat = function () {
            $scope.modal.show();
        };


        $scope.saveList = function () {
            pouchListWrapper.add($scope.list.title, '01.09.2013', '125,00', $scope.list.icon).then(function (res) {
                console.log(res);
            }, function (reason) {
                console.log(reason);
            });
            $ionicHistory.goBack();
        };

    })