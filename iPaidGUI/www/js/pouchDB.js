var localDB = new PouchDB("todos");
var remoteDB = new PouchDB("http://vs245.codepleasure.org:5984/todos");
localDB.sync(remoteDB, {live: true});
//
//PouchDB.destroy("http://vs245.codepleasure.org:5984/todos").then(function () {
//  console.debug("database destroyed");
//}).catch(function (err) {
//  // error occurred
//});
//
//PouchDB.destroy("todos").then(function () {
//    console.debug("database destroyed");
//}).catch(function (err) {
//    // error occurred
//});
//


ang.factory("PouchDBListener", ['$rootScope', function($rootScope) {

    localDB.changes({
        continuous: true,
        onChange: function(change) {
            if (!change.deleted) {
                $rootScope.$apply(function() {
                    localDB.get(change.id, function(err, doc) {
                        $rootScope.$apply(function() {
                            if (err) console.log(err);
                            $rootScope.$broadcast('add', doc);
                        })
                    });
                })
            } else {
                $rootScope.$apply(function() {
                    $rootScope.$broadcast('delete', change.id);
                });
            }
        }
    });

    return true;

}]);



