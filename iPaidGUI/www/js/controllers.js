angular.module('starter.controllers', [])
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $state) {
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

        $scope.logout = function () {
            $state.go('login');
        }


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

    .controller('LoginCtrl', function ($scope, $ionicHistory, $state, pouchProfileWrapper) {
        $scope.profile = {email: "mklein@web.de", password: "password"};
        $scope.login = function () {
            pouchProfileWrapper.get($scope.profile.email).then(
                function onSuccess(doc) {
                    var tempPassword = $scope.profile.password;
                    if (doc.password == tempPassword) {
                        console.log('gleich');
                        $scope.profile = doc;
                        $state.go('app.lists');
                    }
                },
                function onError(err) {
                    alert("Email or Password wrong!");
                });


        };

        $scope.register = function () {
            console.log('register');
            $state.go('register');
        };
    })

    .controller('RegisterCtrl', function ($scope, $ionicHistory, $state, pouchProfileWrapper) {
        $scope.profile = {};
        $scope.cancel = function () {
            $state.go('login');
        };

        $scope.register = function () {
            console.log($scope.profile);
            pouchProfileWrapper.add($scope.profile).then(function (res) {
                console.log(res);
            }, function (reason) {
                console.log(reason);
            });

            $state.go('login');
        };
    })

    .controller('ProfileCtrl', function ($scope, $stateParams, $ionicHistory, $state, pouchProfileWrapper) {
        pouchProfileWrapper.get($stateParams.email).then(
            function onSuccess(doc) {
                $scope.profile = doc;
            },
            function onError(err) {
                $scope.profile = null;
            });
    })


    .controller('MyCtrl', function ($scope, $ionicHistory) {
        $scope.myGoBack = function () {
            $ionicHistory.goBack();
        };
    })

    .controller('AdminCtrl', function ($scope, pouchListWrapper) {

        $scope.delDBs = function () {
            pouchListWrapper.removeAll();

        };


    })


    .controller('ListDetailCtrl', function ($scope, $stateParams, pouchListener, pouchPurchWrapper, pouchListWrapper, $ionicModal, $ionicHistory) {


        pouchListWrapper.get($stateParams.listId).then(
            function onSuccess(doc) {
                $scope.list = doc;
            },
            function onError(err) {
                $scope.list = null;
            });

        //Purchases
        $scope.purch = {};
        $scope.purchases = [];
        $scope.purchases = pouchPurchWrapper.all($stateParams.listId);

        $scope.$on('newPurch', function (event, p) {
            var push = true;
            $scope.purchases.forEach(function (entry) {
                if (entry._id == p._id) {
                    push = false;
                }
            });
            $scope.purchases.push(p);

        });


        //New Purchase
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
            $scope.modal.hide();
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
        $scope.lists = pouchListWrapper.all();




        $scope.$on('newList', function (event, l) {
            var push = true;
            $scope.lists.forEach(function (entry) {
                if (entry._id == l._id) {
                    push = false;
                }
            });
            if (push)
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
            pouchListWrapper.add($scope.list).then(function (res) {
                console.log(res);
            }, function (reason) {
                console.log(reason);
            });
            $ionicHistory.goBack();
        };

    })