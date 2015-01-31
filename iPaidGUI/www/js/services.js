angular.module('starter.services', [])

.factory('Lists', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
      var lists = [{
        "doc": {
          "id": 0,
          "title": "Kaffee",
          "date": "01.09.2013",
          "balance": "125,00",
          "icon": "icon ion-coffee cat activated",
          "balanceClass": "",
          "purchases": [
            {
              "userId": 0,
              "face": "https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png",
              "title": "Groceries",
              "date": "10.10.2014",
              "amount": "32,50"
            },
            {
              "userId": 1,
              "face": "https://avatars3.githubusercontent.com/u/11214?v=3&s=460",
              "title": "Fuel",
              "date": "09.10.2014",
              "amount": "55,00"
            },
            {
              "userId": 2,
              "face": "https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg",
              "title": "Lunch",
              "date": "08.10.2014",
              "amount": "20,00"
            }
          ]
        }
      },
        {
          "doc": {
            "id": 1,
            "title": "Hennef",
            "date": "01.08.2012",
            "balance": "20,00",
            "icon": "icon ion-ios7-home",
            "balanceClass": ""
          }
        },
        {
          "doc": {
            "id": 2,
            "title": "Jungs",
            "date": "12.12.2014",
            "balance": "-45,50",
            "icon": "icon ion-ios7-football",
            "balanceClass": "negativBalance"
          }
        }
      ];

  return {
    all: function() {
      return lists;
    },
    remove: function(list) {
      lists.splice(lists.indexOf(list), 1);
    },
    get: function(listId) {
      for (var i = 0; i < lists.length; i++) {
        if (lists[i].id === parseInt(listId)) {
          return lists[i];
        }
      }
      return null;
    }
      
  }
})

/**
 * A simple example service that returns some data.*/
.factory('Users', function() {
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var users = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return users;
    },
    get: function(userId) {
      // Simple index lookup
      return users[userId];
    }
  }
});
