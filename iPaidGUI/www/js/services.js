var remoteDB = {};
var localDB = {};

var dbName = "db5";
angular.module('starter.services', [])

.factory('pouchDB', function () {


        remoteDB = new PouchDB("http://vs245.codepleasure.org:5984/" + dbName);
         localDB = new PouchDB(dbName, {adapter: 'idb'});
        // localDB = new PouchDB(dbName, {adapter: 'websql'});
        localDB.sync(remoteDB, {live: true});
        //PouchDB.debug.disable();
        PouchDB.debug.enable('*');

        return {
            localDB: function () {
                return localDB;
            },
            remoteDB: function () {
                return remoteDB;
            }
        }

    })
    .
    factory('pouchProfileWrapper', function ($q, $rootScope, pouchDB) {


        return {
            register: function (profile) {

                var deferred = $q.defer();

                //Admin Login
                var adminObj = {
                    email: 'admin',
                    password: 'eckball'
                };


                this.login(adminObj).then(
                    function onSuccess(ele) {
                        pouchDB.remoteDB().signup(profile.email, profile.password, {
                            metadata: {
                                email: profile.email,
                                lastName: profile.lastName,
                                firstName: profile.firstName,
                                password: profile.password
                            }
                        }, function (err, res) {
                            $rootScope.$apply(function () {
                                if (err) {
                                    deferred.reject(err)
                                } else {
                                    deferred.resolve(res)
                                }
                            });
                        });
                    },
                    function onError(err) {
                        console.log(err);
                    });


                return deferred.promise;
            }
            ,

            login: function (profile) {
                var ajaxOpts = {
                    ajax: {
                        headers: {
                            Authorization: 'Basic ' + window.btoa(profile.email + ':' + profile.password)
                        }
                    }
                };
                var deferred = $q.defer();
                pouchDB.remoteDB().login(profile.email, profile.password, ajaxOpts, function (err, res) {
                    $rootScope.$apply(function () {
                        if (err) {
                            deferred.reject(err)
                        } else {
                            deferred.resolve(res)
                        }
                    });
                });
                return deferred.promise;
            }
        }

    })


    .
    factory('pouchPurchaseWrapper', function ($q, $rootScope, pouchDB) {

        return {

            add: function (purchase, listID) {
                console.log(purchase);
                var tempPurchaseObj = {
                    _id: new Date().toJSON(),
                    list_id: listID,
                    type: 'purchase',
                    title: purchase.title,
                    date: purchase.date,
                    amount: purchase.amount,
                    face: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png"
                };

                var deferred = $q.defer();
                pouchDB.localDB().post(tempPurchaseObj, function (err, res) {
                    $rootScope.$apply(function () {
                        if (err) {
                            deferred.reject(err)
                        } else {
                            deferred.resolve(res)
                        }
                    });
                });
                return deferred.promise;
            },
            update: function (purchase) {
                var tempPurchaseObj = {
                    _id: purchase._id,
                    _rev: purchase._rev,
                    list_id: purchase.list_id,
                    type: 'purchase',
                    title: purchase.title,
                    date: purchase.date,
                    amount: purchase.amount,
                    face: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png"
                };
                console.log("update purchase: " + purchase);
                var deferred = $q.defer();
                pouchDB.localDB().post(tempPurchaseObj, function (err, res) {
                    $rootScope.$apply(function () {
                        if (err) {
                            deferred.reject(err)
                        } else {
                            deferred.resolve(res)
                        }
                    });
                });
                return deferred.promise;
            },
            all: function (l_id) {
                var lists = [];
                pouchDB.localDB().allDocs({include_docs: true}, function (err, response) {
                    angular.forEach(response.rows, function (value, key) {
                        if (value.doc.type == "purchase" && value.doc.list_id == l_id)
                            lists.push(value.doc);
                    }, console.debug(""));

                });
                return lists;
            },
            get: function (purchaseId) {
                console.log('get purchase');
                return pouchDB.localDB().get(purchaseId, function (err, doc) {
                });

            },
            removeAll: function () {
                //   pouchDB.destroyDBs();
                //  pouchDB.this.des

            },
            remove: function (id) {
                var deferred = $q.defer();
                pouchDB.localDB().get(id, function (err, doc) {
                    $rootScope.$apply(function () {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            pouchDB.localDB().remove(doc, function (err, res) {
                                $rootScope.$apply(function () {
                                    if (err) {
                                        deferred.reject(err)
                                    } else {
                                        deferred.resolve(res)
                                    }
                                });
                            });
                        }
                    });
                });
                return deferred.promise;
            }
        }

    })


    .
    factory('pouchListWrapper', function ($q, $rootScope, pouchDB) {

        return {
            add: function (list) {
                var tempListObj = {
                    _id: new Date().toJSON(),
                    type: 'list',
                    title: list.title,
                    date: list.date,
                    balance: list.balance,
                    icon: list.icon
                };
                console.log(JSON.stringify(tempListObj));
                var deferred = $q.defer();
                pouchDB.localDB().put(tempListObj, function (err, res) {
                    $rootScope.$apply(function () {
                        if (err) {
                            deferred.reject(err)
                        } else {
                            deferred.resolve(res)
                        }
                    });
                });
                return deferred.promise;
            },
            all: function () {


                var lists = [];
                pouchDB.localDB().allDocs({include_docs: true}, function (err, response) {
                    angular.forEach(response.rows, function (value, key) {
                        if (value.doc.type == "list") {
                            lists.push(calculateListView(value.doc));
                        }
                    }, console.debug(""));

                });
                return lists;
            },
            get: function (listId) {
                var deferred = $q.defer();
                pouchDB.localDB().get(listId, function (err, doc) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        console.log(JSON.stringify(doc));
                        deferred.resolve(doc);
                    }
                });
                return deferred.promise;
            },
            removeAll: function () {
                //   pouchDB.destroyDBs();
                //  pouchDB.this.des

            },
            remove: function (id) {
                var deferred = $q.defer();
                pouchDB.localDB().get(id, function (err, doc) {
                    $rootScope.$apply(function () {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            pouchDB.localDB().remove(doc, function (err, res) {
                                $rootScope.$apply(function () {
                                    if (err) {
                                        deferred.reject(err)
                                    } else {
                                        deferred.resolve(res)
                                    }
                                });
                            });
                        }
                    });
                });
                return deferred.promise;
            }
        }

    })

    .factory('pouchListener', function ($rootScope, pouchDB) {


        pouchDB.localDB().changes({
            continuous: true,
            include_docs: true,
            onChange: function (change) {
                console.log("Change: " + JSON.stringify(change));
                if (!change.deleted) {
                    $rootScope.$apply(function () {
                        console.log("broadcast -new-: " + change.doc.type);
                        switch (change.doc.type) {
                            case "list":
                                $rootScope.$broadcast('newList', change.doc);
                                break;
                            case "purchase":
                                $rootScope.$broadcast('newPurch', change.doc);
                                break;
                            default:
                                break;
                        }
                    })
                } else {
                    $rootScope.$apply(function () {
                        console.log("delete something" + JSON.stringify(change));
                        $rootScope.$broadcast('delList', change.id);
                    });
                }
            }
        })
        return null;
    })


