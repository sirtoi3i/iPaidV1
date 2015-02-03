angular.module('starter.services', [])

    .factory('pouchDB', function () {
        var localDB = new PouchDB("todos");
        var remoteDB = new PouchDB("http://vs245.codepleasure.org:5984/todos");
        localDB.sync(remoteDB, {live: true});


        this.destroyDBs = function () {
            localDB.destroy(function (err, info) {
            });
            remoteDB.destroy(function (err, info) {
            });
            return null;
        };

        return localDB;


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
                console.log(JSON.stringify(tempPurchObj));
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
            all: function () {
                console.log("SCHEINT MAN NIEEEE ZU BRAUCHEN DA IMMER NEW AUFGERUFEN WIRD!?");
                var lists = [];
                pouchDB.allDocs({include_docs: true}, function (err, response) {

                    angular.forEach(response.rows, function (value, key) {
                        lists.push(value.doc);
                    }, console.debug(""));

                });
                return lists;
            },
            get: function (listId) {

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
            add: function (t, d, b, i) {
                var tempListObj = {
                    _id: new Date().toJSON(),
                    type: 'list',
                    title: t,
                    date: d,
                    balance: b,
                    icon: i
                };

                var deferred = $q.defer();

                pouchDB.post(tempListObj, function (err, res) {
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
                var lists = [];
                pouchDB.allDocs({include_docs: true}, function (err, response) {

                    angular.forEach(response.rows, function (value, key) {
                        lists.push(value.doc);
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
                                $rootScope.$broadcast('newList', doc);
                                $rootScope.$broadcast('newPurch', doc);
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


