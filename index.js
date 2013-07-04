
var angular = require('angularjs')
  , request = require('superagent')
  , promise = require('promise')
  // angular directives
  , fan = require('fan')
  , newTodo = require('new-todo')
  , todoList = require('todo-list')
  // angular factories
  , ffapi = require('ffapi')
  , bootstrap = require('ng-bootstrap')
  // settings
  , settings = require('settings')('panel')

  , defaultSettings = require('./settings')
  , template = require('./template');

settings.config(defaultSettings);

function tpldiv(template) {
  var div = document.createElement('div');
  div.innerHTML = template;
  return div.firstElementChild;
}

function inject(personId) {
  if (document.getElementById('FamilyFoundSection')) {
    return;
  }
  var div = tpldiv(template)
    , parentDiv = document.querySelector('#ancestorPage .details-content')
    , insertBefore = settings.get('display.insertBefore');
  div.querySelector('#FamilyFound').setAttribute('data-person-id', personId);
  if (insertBefore === 'last') {
    bootstrap.last(div, parentDiv, 'todolist-panel');
  } else {
    bootstrap(div, parentDiv, 'todolist-panel',
              parentDiv.querySelector('#' + insertBefore));
  }
}

function parseArgs(args) {
  return [].concat(args.split('&').map(function(a){
    return a.split('=');
  })).reduce(function (rest, one) { rest[one[0]] = one[1]; return rest; });
}

function hashChange() {
  if (location.hash.indexOf('#view=ancestor') === 0) {
    setTimeout(function () {
      var items = parseArgs(location.hash.slice(1));
      if (!items.person) return;
      inject(items.person);
    }, 100);
  }
}

var loadPeople = function (get, base, scope, gens) {
  if (gens <= 0) {
    base.hideParents = true;
    return null;
  }
  base.hideParents = false;
  if (base.fatherId) {
    get(base.fatherId, function (data, cached) {
        base.father = data;
        loadPeople(get, base.father, scope, gens - 1);
        if (!cached) scope.$digest();
      });
  }
  if (base.motherId) {
    get(base.motherId, function (data, cached) {
        base.mother = data;
        loadPeople(get, base.mother, scope, gens - 1);
        if (!cached) scope.$digest();
      });
  }
  Object.keys(base.familyIds).forEach(function (spouseId) {
    if (!base.families[spouseId]) base.families[spouseId] = [null];
    for (var i=0; i<base.familyIds[spouseId].length; i++) {
      base.families[spouseId].push(null);
      get(base.familyIds[spouseId][i], function (i, data, cached) {
        base.families[spouseId][i] = data;
        if (!cached) scope.$digest();
      }.bind(null, i));
    }
  });
};

var app = angular.module('todolist-panel', ['new-todo', 'todo-list', 'fan', 'ffapi'])

  .controller('FamilyFoundCtrl', function ($scope, $attrs, ffperson, ffapi) {
    $scope.personId = $attrs.personId;
    window.addEventListener('hashchange', function () {
      var params = parseArgs(location.hash.slice(1));
      if (params.person !== $scope.personId) {
        $scope.personId = params.person;
        ffperson($scope.personId, function (person) {
          $scope.todos = person.todos;
          $scope.status = person.status;
          $scope.$digest();
        });
        $scope.rootPerson = false;
        ffapi.relation($scope.personId, function (person, cached) {
          $scope.rootPerson = person;
          loadPeople(ffapi.relation, person, $scope, 5);
          if (!cached) $scope.$digest();
        });
        $scope.$digest();
      }
    });
    $scope.status = null;
    ffperson($attrs.personId, function (person) {
      $scope.todos = person.todos;
      $scope.status = person.status;
      $scope.$digest();
    });
    $scope.$watch('status', function (value, old) {
      if (value === old || !old) return;
      ffapi('person/status', {status: value, id: $scope.personId});
    });
    $scope.fanConfig = {
      gens: 6,
      links: false,
      width: 240,
      height: 170,
      center: {x: 120, y: 120},
      ringWidth: 20,
      doubleWidth: false,
      tips: true,
      onNode: function (el, person) {
        el.on('click', function () {
          window.location.hash = '#view=ancestor&person=' + person.id;
        });
      }
    };
    $scope.rootPerson = false;
    ffapi.relation($attrs.personId, function (person, cached) {
      $scope.rootPerson = person;
      loadPeople(ffapi.relation, person, $scope, 5);
      if (!cached) $scope.$digest();
    });
  });

module.exports = {
  attach: function (window) {
    window.addEventListener('hashchange', hashChange);
    hashChange();
  },
  inject: inject,
  app: app
};
