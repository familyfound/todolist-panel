
var angular = require('angularjs')
  , todoPanel = require('todolist-panel')
  , copy = require('deep-copy')

  , log = function (){}; //require('domlog');

// log.init();

function rc(){
  var chars = 'WERTYUIOPASDFGHJKLZXCVBNM';
  return chars[parseInt(Math.random() * chars.length)];
}

function randId() {
  var id = '';
  for (var i=0; i<7; i++) {
    if (i===4) id += '-';
    id += rc();
  }
  return id;
}

function randGend() {
  return ['M', 'W'][Math.floor(Math.random() * 2)] + randId();
}

function randStatus() {
  return ['working', 'clean', 'complete'][parseInt(Math.random()*3)];
}

function newFamily(gen, family) {
  spouse = gen + randId();
  family[spouse] = [spouse];
  var kids = Math.floor(Math.random() * 10 + 3);
  for (var i=0; i<kids; i++) {
    family[spouse].push(randGend());
  }
}

function newPerson(gender) {
  var person = copy(gender === 'male' ? man : woman)
    , families = Math.floor(Math.random() * 4) + 1
    , spouse;
  person.familyIds = {};
  person.families = {};
  person.fatherId = 'M' + randId();
  person.motherId = 'W' + randId();
  if (gender === 'male') {
    person.id = 'M' + randId();
    for (var i=0; i<families; i++) {
      newFamily('W', person.familyIds);
    }
  } else {
    person.id = 'W' + randId();
    for (var i=0; i<families; i++) {
      newFamily('M', person.familyIds);
    }
  }
  person.status = randStatus();
  return person;
}

var manId = 'MALE-X3T';

var man = {
  display: {
    name: "Jared Forsyth",
    gender: "Male",
    lifespan: "1599-1634",
    birthDate: "12 July 1599",
    birthPlace: "Mayfield, Iowa"
  },
  id: manId,
  todos: [],
  fatherId: 'MALE-X3T',
  motherId: 'FEM-JKL',
  familyIds: {},
  father: null,
  mother: null
};

var womanId = 'FEM-JKL';

var woman = {
  display: {
    name: "Eliza Jane Harris",
    gender: "Female",
    lifespan: "1599-1650",
    birthDate: "12 May 1599",
    birthPlace: "Mayfield, Iowa"
  },
  id: womanId,
  todos: [],
  fatherId: 'MALE-X3T',
  motherId: 'FEM-JKL',
  familyIds: {},
  father: null,
  mother: null
};

angular.module('test', ['todolist-panel'])
  .factory('ffperson', function () {
    return function (personId, next) {
      setTimeout(function() {
        return next({
          id: personId,
          status: 'working',
          todos: [{
            _id: '12434jJLKFSDf',
            completed: false,
            type: 'General',
            title: 'Fix all my stuff',
            owned: false,
            watching: true
          }, {
            _id: 'QWEIOPERsdfssf',
            completed: true,
            type: 'Find Record',
            title: 'marriage',
            owned: true,
            watching: false
          }]});
      }, 0);
    };
  })
  .factory('ffapi', function () {
    var ffapi = function (name, params, next) {
      log('call made', name, params, next);
      if (name == 'todos/add') {
        setTimeout(function () {
          next({id: '234tre'});
        }, 0);
      }
    };
    ffapi.relation = function (personId, next) {
      // console.log('getting ancestor', personId); //
      setTimeout(function () {
        var base = newPerson(personId[0] === 'M' ? 'male' : 'female');
        return next(base);
      }, 100 + Math.random() * 300);
    };
    return ffapi;
  });
