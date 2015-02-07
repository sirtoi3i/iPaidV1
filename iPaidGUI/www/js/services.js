var remoteDB = {};
var localDB = {};

var dbName = "db5"
angular.module('starter.services', [])

    .factory('pouchDB', function () {
        //var localDB = new PouchDB("db4", {adapter: 'idb'});
        localDB = new PouchDB(dbName, {adapter: 'websql'});
        localDB.sync(remoteDB, {live: true});
        //PouchDB.debug.disable();
        PouchDB.debug.enable('*');
        return localDB;
    })
    .factory('couchDB', function () {
        var pouchOpts = {
            skipSetup: true
        };

        remoteDB = new PouchDB("http://vs245.codepleasure.org:5984/" + dbName, pouchOpts);
        return remoteDB;
    })

    .
    factory('pouchProfileWrapper', function ($q, $rootScope, couchDB) {


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
                        couchDB.signup(profile.email, profile.password, {
                            metadata: {
                                email: 'robin@boywonder.com',
                                birthday: '1932-03-27T00:00:00.000Z',
                                likes: ['acrobatics', 'short pants', 'sidekickin']
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
                couchDB.login(profile.email, profile.password, ajaxOpts, function (err, res) {
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
                pouchDB.post(tempPurchaseObj, function (err, res) {
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
                pouchDB.post(tempPurchaseObj, function (err, res) {
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
                pouchDB.allDocs({include_docs: true}, function (err, response) {
                    angular.forEach(response.rows, function (value, key) {
                        if (value.doc.type == "purchase" && value.doc.list_id == l_id)
                            lists.push(value.doc);
                    }, console.debug(""));

                });
                return lists;
            },
            get: function (purchaseId) {
                console.log('get purchase');
                return pouchDB.get(purchaseId, function (err, doc) {
                });

            },
            removeAll: function () {
                //   pouchDB.destroyDBs();
                //  pouchDB.this.des

            },
            remove: function (id) {
                var deferred = $q.defer();
                pouchDB.get(id, function (err, doc) {
                    $rootScope.$apply(function () {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            pouchDB.remove(doc, function (err, res) {
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
                pouchDB.put(tempListObj, function (err, res) {
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
                pouchDB.allDocs({include_docs: true}, function (err, response) {
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
                pouchDB.get(listId, function (err, doc) {
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
                pouchDB.get(id, function (err, doc) {
                    $rootScope.$apply(function () {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            pouchDB.remove(doc, function (err, res) {
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


        pouchDB.changes({
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


