var app = angular.module('expensesApp', ['ngRoute']);

// helper to convert an object javascript into a valid mysql date 
// Example input.date (2014-10-01) output.date (Wed Oct 01 2014 00:00:00 GMT+0200)
var myHelpers = {
	//from http://stackoverflow.com/questions/2280104/convert-javascript-to-date-object-to-mysql-date-format-yyyy-mm-dd
	dateObjToString: function (dateObj) {
		var year, month, day;
		year = String(dateObj.getFullYear());
		month = String(dateObj.getMonth() + 1);
		if (month.length == 1) {
			month = "0" + month;
		}
		day = String(dateObj.getDate());
		if (day.length == 1) {
			day = "0" + day;
		}
		return year + "-" + month + "-" + day;
	},
	stringToDateObj: function (string) {
		return new Date(string.substring(0, 4), string.substring(5, 7) - 1, string.substring(8, 10));
	}
};


// define routes for the app, each route define a template and a controller
app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: 'views/expenses.html',
			controller: "ExpensesViewController"
		})
		.when("/expenses", {
			templateUrl: 'views/expenses.html',
			controller: "ExpensesViewController"
		})
		.when("/expenses/new", {
			templateUrl: 'views/expensesForm.html',
			controller: "ExpenseViewController"
		})
		.when("/expenses/edit/:id", {
			templateUrl: 'views/expensesForm.html',
			controller: "ExpenseViewController"
		})
		.otherwise({
			redirectTo: "/"
		});
}]);
// you can access the factory from the console by doing:
// angular.element(document.body).injector().get('Expenses')
app.factory('Expenses', function ($http) {
	var service = {};

	// the id will be a unique identifier,it could come from a server
	service.entries = [];

	// take a file json from the server
	$http.get('data/get_all.json')
	/* 	.then(function (data) {
			service.entries = data; */
			.then(function successCallback(response) {
				console.log(response);
				service.entries = response;
			// apply to every element.date the function fot the formatted a valid date
			// convert strings to date objects
			/* service.entries.forEach(function (element) {
				element.date = myHelpers.stringToDateObj(element.date);
			}) */	
				
			},function errorCallback(response){
				alert(response.statusText);
			});

	// new method for assign a newId 
/* 	service.getNewId = function () {

		// if we already have one, increase by 1
		if (service.newId) {
			service.newId++;
		}
		else {
			// find the largest id value using underscore.js
			// documentation for .max: http://underscorejs.org/#max
			var entryMaxId = _.max(service.entries, function (entry) {
				return entry.id;
			});
			service.newId = entryMaxId.id + 1;
		}
		return service.newId;
	}; */

	service.getById = function (id) {
		return _.find(service.entries, function (entry) {
			return entry.id == id;
		});
	}

	service.save = function (entry) {

		var toUpdate = service.getById(entry.id);

		if (toUpdate) {
			$http.post('data/update.json',entry)
			.then(function successCallback(response) {
				if(response.then){
					_.extend(toUpdate, entry)
				}
			},function errorCallback(response){
				alert(response.statusText);		
			});
		}
		else {
			/* entry.id = service.getNewId();
			service.entries.push(entry); */
			$http.post('data/create.json',entry)
			.then(function successCallback(response) {
				console.log(response.newId);
				entry.id = response.newId;
				service.entries.push(entry);
			},function errorCallback(response){
				alert(response.statusText);
			});
		}
	}

	service.remove = function (entry) {
		service.entries = _.reject(service.entries, function (element) {
			return element.id == entry.id;
		});
	};

	return service;
})

// listing of all expenses
app.controller('ExpensesViewController', ['$scope', 'Expenses', function ($scope, Expenses) {
	$scope.expenses = Expenses.entries;

	$scope.remove = function (expense) {
		Expenses.remove(expense);
	};

	$scope.$watch(function () {
		return Expenses.entries
	},
		function (entries) {
			$scope.expenses = entries;
		});
}]);

// create or edit an expense
app.controller('ExpenseViewController', ['$scope', '$routeParams', '$location', 'Expenses', function ($scope, $routeParams, $location, Expenses) {

	// the expense will either be a new one or existing one if we are editing
	if (!$routeParams.id) {
		$scope.expense = { date: new Date() };
	}
	else {
		//clone makes a copy of an object,so we don't modify the real object before clicking Save
		$scope.expense = _.clone(Expenses.getById($routeParams.id));
	}

	// push the expense to the array of expenses. Duplicate entries will thow error unless 
	// adding "track by $index" to the 
	$scope.save = function () {
		Expenses.save($scope.expense);
		$location.path('/');
	}

	app.directive('sbExpense', function () {
		return {
			restrict: 'E',
			templateUrl: 'views/expense.html'
		}
	})
}]);