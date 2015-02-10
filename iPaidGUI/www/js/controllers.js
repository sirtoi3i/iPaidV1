angular.module('starter.controllers', ["chart.js"]).controller('AppCtrl', function ($scope, $ionicModal, $timeout, $state) {
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

    .controller('LoginCtrl', function ($scope, $ionicHistory, $state, pouchProfileWrapper, $ionicPopup) {


        $scope.profile = {email: 'mklein@web.de', password : 'password' };
        $scope.login = function () {


            pouchProfileWrapper.login($scope.profile).then(
                function onSuccess(ele) {
                    console.log(ele);
                    $state.go('app.lists');
                },
                function onError(err) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login',
                        template: err.message
                    });
                    alertPopup.then(function (res) {

                    });
                    console.log(err);
                });


        };

        $scope.switch_register = function () {
            console.log('register');
            $state.go('register');
        };


        $scope.cancel = function () {
            $state.go('login');
        };

        $scope.register = function () {
            pouchProfileWrapper.register($scope.profile).then(
                function onSuccess(ele) {
                    console.log(ele);
                    $state.go('login');
                },
                function onError(err) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login',
                        template: err.message
                    });
                    alertPopup.then(function (res) {

                    });
                    console.log(err);
                });
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


    .controller('ListDetailCtrl', function ($scope, $stateParams, pouchListener, pouchPurchaseWrapper, pouchListWrapper, $ionicModal, $ionicPopup) {
        //Get List
        pouchListWrapper.get($stateParams.listId).then(
            function onSuccess(doc) {
                $scope.list = doc;
            },
            function onError(err) {
                $scope.list = null;
            });

        //Provide Templates
        $scope.templates = ['templates/list_purchases.html', 'templates/list_member.html', 'templates/list_statistics.html', 'templates/list_settings.html'];
        $scope.template = $scope.templates[1];

//Member
        $scope.members = [{
            "email": "tborlinghaus@gmail.com",
            "firstName": "Tobias",
            "lastName": "Borlinghaus",
            "balance": 87.34,
            "face": "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
            "_id": "2015-02-0sd6T14:37:53.926Z",
            "_rev": "3-e674eae815e299105191dc2276aa6086"
        }, {
            "email": "mklein@gmail.com",
            "firstName": "Michel",
            "lastName": "Klein",
            "balance": -71.59,
            "face": "https://avatars3.githubusercontent.com/u/11214?v=3&s=460",
            "_id": "2015-02-06T09:0ads2:08.919Z",
            "_rev": "2-bb42c549db523b7edba82f855e2f1e38"
        }, {
            "email": "dclasen@gmail.com",
            "firstName": "Daniel",
            "lastName": "Clasen",
            "balance": -23.19,
            "face": "https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg",
            "_id": "2015-02-06T12:19:39.as305Z",
            "_rev": "3-c960631fac433830bd6ce43f8370032f"
        }, {
            "email": "mmimi@gmail.com",
            "firstName": "Mimi",
            "lastName": "Kornau",
            "balance": 7.44,
            "face": "https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg",
            "_id": "2015-02-06T14:dssad:53.926Z",
            "_rev": "3-e674eae815e299105191dc2276aa6086"
        }];
        // confirm dialog
        $scope.showConfirm = function (member) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Remove Member',
                template: 'Are you sure you want to remove ' + member.name + ' from this list?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('Yes, I am');
                    for (var i = 0; i < $scope.members.length; i++) {
                        if ($scope.members[i]._id === member._id) {
                            $scope.members.splice(i, 1);
                        }
                    }
                } else {
                    console.log('No, I am not');
                }
            });
        };


        //Member Ende
        //Purchases Begin
        $scope.purchase = {date: new Date()};
        $scope.purchases = [];
        $scope.purchases = pouchPurchaseWrapper.all($stateParams.listId);

        $scope.$on('newPurch', function (event, p) {
            var push = true;
            $scope.purchases.forEach(function (entry) {
                if (entry._id == p._id) {
                    push = false;
                }
            });
            $scope.purchases.push(p);

        });
        $scope.testVar={};
        $scope.testVar="TEST";


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
            console.log("Date: " + $scope.purchase.date + " for purchase: " + $scope.purchase.title + " for list: " + $stateParams.listId);
            pouchPurchaseWrapper.add($scope.purchase, $stateParams.listId).then(function (res) {
                console.log(res);
            }, function (reason) {
                console.log(reason);
            });
            $scope.modal.hide();
        };


        //Statistics Start
        $scope.chart = {};
        $scope.chart.type = 'Line';
        $scope.chart.series = ["Tobi", "Michel", "Daniel"];
        $scope.chart.labels = ["February", "March", "April", "May", "June", "July"];
        $scope.chart.data = [[59, 80, 81, 56, 55],
            [28, 48, 40, 19, 27], [65, -80, -81, -56, -55], [25, -39, -61, -86, -15]];
        $scope.chart.legend = true;
        $scope.chart.options = {
            animationSteps: 120
        };


        $scope.chart.series = [];
        $scope.chart.labels = ["February", "March", "April", "May", "June", "July"];

        var i = 0;
        $scope.members.forEach(function (entry) {
            $scope.chart.series.push(entry.name);
            console.log($scope.chart.data[i]);
            $scope.chart.data[i].push(entry.balance);
            i++;
        });


        //Statistics End


        $scope.$on('delList', function (event, id) {
            for (var i = 0; i < $scope.purchases.length; i++) {
                if ($scope.purchases[i]._id === id) {
                    $scope.purchases.splice(i, 1);
                }
            }
        });


    })

    .controller('UsersCtrl', function ($scope, Users) {
        $scope.users = Users.all();
    })

    .controller('UserDetailCtrl', function ($scope, $stateParams, Users) {
        $scope.user = Users.get($stateParams.userId);
    })


    .controller('PurchaseDetailCtrl', function ($scope, $stateParams, $state, pouchListener, pouchPurchaseWrapper, $ionicHistory) {
        console.log("load Purchase");
        pouchPurchaseWrapper.get($stateParams.purchaseId).then(
            function onSuccess(doc) {
                $scope.purchase = doc;
                console.log(doc);
            },
            function onError(err) {
                $scope.purchase = null;
                console.log("cannot found purchase for id" + $stateParams.purchaseId);
            });

        $scope.setTitle = function (title) {
            $scope.purchase.title = title;
        };

        $scope.updateTitle = function (title) {
            $scope.purchase.title = title;
            pouchPurchaseWrapper.update($scope.purchase).then(function (res) {
                console.log(res);
            }, function (reason) {
                console.log(reason);
            });
            $ionicHistory.goBack();
        };

        $scope.updatePurchase = function (purchase) {
            pouchPurchaseWrapper.update(purchase).then(function (res) {
                console.log(res);
            }, function (reason) {
                console.log(reason);
            });
            $ionicHistory.goBack();
        };

        $scope.deletePurchase = function (purchase) {
            pouchPurchaseWrapper.remove(purchase._id).then(function (res) {
                console.log(res);
            }, function (reason) {
                console.log(reason);
            });
            $state.go('app.list', {listId: purchase.list_id});
        }

        $scope.$on('newPurch', function (event, p) {
            if ($scope.purchase._id == p._id) {
                console.log("Selected Purchase updated");
                $scope.purchase = p;
            }
        });

        $scope.amountCalc = {
            buttonCap: 'Everybody',
            part1Count: 0,
            part1Amount: 0,
            part2Count: 0,
            part2Amount: 0,
            part3Count: 0,
            part3Amount: 0,
            part4Count: 0,
            part4Amount: 0
        };
        $scope.everybody = function (amount, participants) {
            console.log("Amount: " + amount + ", Participants: " + participants);
            if ($scope.amountCalc.buttonCap == 'Everybody') {
                $scope.amountCalc.buttonCap = 'Nobody';
                $scope.amountCalc.part1Count = 1;
                $scope.amountCalc.part2Count = 1;
                $scope.amountCalc.part3Count = 1;
                $scope.amountCalc.part4Count = 1;
                $scope.amountCalc.part1Amount = round(amount / participants);
                $scope.amountCalc.part2Amount = round(amount / participants);
                $scope.amountCalc.part3Amount = round(amount / participants);
                $scope.amountCalc.part4Amount = round(amount / participants);
            } else {
                $scope.amountCalc.buttonCap = 'Everybody';
                $scope.amountCalc.part1Count = 0;
                $scope.amountCalc.part2Count = 0;
                $scope.amountCalc.part3Count = 0;
                $scope.amountCalc.part4Count = 0;
                $scope.amountCalc.part1Amount = 00, 00;
                $scope.amountCalc.part2Amount = 00, 00;
                $scope.amountCalc.part3Amount = 00, 00;
                $scope.amountCalc.part4Amount = 00, 00;
            }
            function round(x) {
                Ergebnis = Math.round(x * 100) / 100;
                return Ergebnis;
            }
        }

        $scope.incrementParticipant = function (amount, participant) {
            $scope.amountCalc.buttonCap = 'Nobody';
            var count = $scope.amountCalc.part1Count + $scope.amountCalc.part2Count + $scope.amountCalc.part3Count + $scope.amountCalc.part4Count;
            if (participant == 1) {
                $scope.amountCalc.part1Count++;
            } else if (participant == 2) {
                $scope.amountCalc.part2Count++;
            } else if (participant == 3) {
                $scope.amountCalc.part3Count++;
            } else if (participant == 4) {
                $scope.amountCalc.part4Count++;
            }
            count++;
            $scope.amountCalc.part1Amount = round((amount / count) * $scope.amountCalc.part1Count);
            $scope.amountCalc.part2Amount = round((amount / count) * $scope.amountCalc.part2Count);
            $scope.amountCalc.part3Amount = round((amount / count) * $scope.amountCalc.part3Count);
            $scope.amountCalc.part4Amount = round((amount / count) * $scope.amountCalc.part4Count);

            function round(x) {
                Ergebnis = Math.round(x * 100) / 100;
                return Ergebnis;
            }

        }
    })

    /* .controller('amountCalcCtrl', function ($scope) {
     $scope.amountCalc = {buttonCap:'Everybody', part1Count : 0, part1Amount: 0, part2Count : 0, part2Amount: 0, part3Count : 0, part3Amount: 0, part4Count : 0, part4Amount: 0 };
     $scope.everybody = function (amount, participants) {
     console.log("Amount: " + amount + ", Participants: " + participants);
     if( $scope.amountCalc.buttonCap == 'Everybody') {
     $scope.amountCalc.buttonCap = 'Nobody';
     $scope.amountCalc.part1Count = 1;
     $scope.amountCalc.part2Count = 1;
     $scope.amountCalc.part3Count = 1;
     $scope.amountCalc.part4Count = 1;
     $scope.amountCalc.part1Amount = round(amount/participants);
     $scope.amountCalc.part2Amount = round(amount/participants);
     $scope.amountCalc.part3Amount = round(amount/participants);
     $scope.amountCalc.part4Amount = round(amount/participants);
     } else {
     $scope.amountCalc.buttonCap = 'Everybody';
     $scope.amountCalc.part1Count = 0;
     $scope.amountCalc.part2Count = 0;
     $scope.amountCalc.part3Count = 0;
     $scope.amountCalc.part4Count = 0;
     $scope.amountCalc.part1Amount = 00,00;
     $scope.amountCalc.part2Amount = 00,00;
     $scope.amountCalc.part3Amount = 00,00;
     $scope.amountCalc.part4Amount = 00,00;
     }
     function round(x) { Ergebnis = Math.round(x * 100) / 100 ; return Ergebnis; }
     }

     $scope.incrementParticipant = function (amount, participant) {
     $scope.amountCalc.buttonCap = 'Nobody';
     var count = $scope.amountCalc.part1Count + $scope.amountCalc.part2Count + $scope.amountCalc.part3Count + $scope.amountCalc.part4Count;
     if(participant == 1) {
     $scope.amountCalc.part1Count++;
     } else  if(participant == 2) {
     $scope.amountCalc.part2Count++;
     }else  if(participant == 3) {
     $scope.amountCalc.part3Count++;
     }else  if(participant == 4) {
     $scope.amountCalc.part4Count++;
     }
     count++;
     $scope.amountCalc.part1Amount = round((amount/count)*$scope.amountCalc.part1Count);
     $scope.amountCalc.part2Amount = round((amount/count)*$scope.amountCalc.part2Count);
     $scope.amountCalc.part3Amount = round((amount/count)*$scope.amountCalc.part3Count);
     $scope.amountCalc.part4Amount = round((amount/count)*$scope.amountCalc.part4Count);

     function round(x) { Ergebnis = Math.round(x * 100) / 100 ; return Ergebnis; }

     }

     })*/

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