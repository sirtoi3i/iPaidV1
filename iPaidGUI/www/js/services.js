angular.module('starter.services', [])

    .factory('pouchDB', function () {

        var localDB = new PouchDB("db4", {adapter: 'websql'});
        var remoteDB = new PouchDB("http://vs245.codepleasure.org:5984/db4");
        localDB.sync(remoteDB, {live: true});
        PouchDB.debug.disable();
        //  PouchDB.debug.enable('*');
        //
        //this.destroyDBs = function () {
        //    localDB.destroy(function (err, info) {
        //    });
        //    remoteDB.destroy(function (err, info) {
        //    });
        //    return null;
        //};

        return localDB;


    })

    .
    factory('pouchProfileWrapper', function ($q, $rootScope, pouchDB) {

        return {

            add: function (profile) {
                var tempProfileObj = {
                    _id: profile.email,
                    type: 'profile',
                    email: profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    password: profile.password,
                    picture: null
                };

                var deferred = $q.defer();
                console.log(JSON.stringify(tempProfileObj));
                pouchDB.post(tempProfileObj, function (err, res) {
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
                console.log("SCHEINT MAN NIEEEE ZU BRAUCHEN DA IMMER NEW AUFGERUFEN WIRD!?");
                var profiles = [];
                pouchDB.allDocs({include_docs: true}, function (err, response) {

                    angular.forEach(response.rows, function (value, key) {
                        profiles.push(value.doc);
                    }, console.debug(""));

                });
                return profiles;
            },
            get: function (profileId) {

                return pouchDB.get(profileId, function (err, doc) {
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
    factory('pouchPurchWrapper', function ($q, $rootScope, pouchDB) {

        return {

            add: function (purch, listID) {
                var tempPurchObj = {
                    _id: new Date().toJSON(),
                    list_id: listID,
                    type: 'purchase',
                    title: purch.title,
                    date: purch.date,
                    amount: purch.amount,
                    face: "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png"
                };

                var deferred = $q.defer();
                pouchDB.post(tempPurchObj, function (err, res) {
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
            get: function (listId) {
                console.log('get list');
                return pouchDB.get(listId, function (err, doc) {
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
            onChange: function (change) {
                if (!change.deleted) {
                    $rootScope.$apply(function () {
                        pouchDB.get(change.id, function (err, doc) {
                            $rootScope.$apply(function () {
                                if (err) console.log(err);
                                console.log("broadcast -new-: " + doc.type);
                                switch (doc.type) {
                                    case "list":
                                        $rootScope.$broadcast('newList', doc);
                                        break;
                                    case "purchase":
                                        $rootScope.$broadcast('newPurch', doc);
                                        break;
                                    default:
                                        break;
                                }


                            })
                        });
                    })
                } else {
                    $rootScope.$apply(function () {
                        $rootScope.$broadcast('delList', change.id);
                    });
                }
            }
        })
        return null;
    })


