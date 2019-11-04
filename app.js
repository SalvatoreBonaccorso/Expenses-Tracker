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
app.factory('Expenses', function () {
	var service = {};

	// the id will be a unique identifier,it could come from a server
	service.entries = [
		{ id: 1, description: 'food', amount: 10, date: '2019-10-01' },
		{ id: 2, description: 'tickets', amount: 11, date: '2019-10-02' },
		{ id: 3, description: 'food', amount: 12, date: '2019-10-03' },
		{ id: 4, description: 'phone edit', amount: 13, date: '2019-10-04' },
		{ id: 5, description: 'bills', amount: 14, date: '2019-10-05' },
		{ id: 6, description: 'food', amount: 15, date: '2019-10-06' }
	];

	// apply to every element.date the function fot the formatted a valid date
	// convert strings to date objects
	service.entries.forEach(function (element) {
		element.date = myHelpers.stringToDateObj(element.date);
	});

	// new method for assign a newId 
	service.getNewId = function () {
		if (service.newId) {
			service.newId++;
		}
		else {
				// find the largest id value using underscore.js
				// documentation for .max: http://underscorejs.org/#max
				var entryMaxId = _.max(x, function (entry) {
					return entry.id;
				});
			service.newId = entryMaxId.id + 1;
		}
		return service.newId;
	};

	service.save = function (entry) {
		entry.id = service.getNewId();
		service.entries.push(entry);
	}

	return service;
})

// listing of all expenses
app.controller('ExpensesViewController', ['$scope', 'Expenses', function ($scope, Expenses) {
	$scope.expenses = Expenses.entries;
}]);

// create or edit an expense
app.controller('ExpenseViewController', ['$scope', '$routeParams', '$location', 'Expenses', function ($scope, $routeParams, $location, Expenses) {
	if (!$routeParams.id) {
		$scope.expense = { id: 7, description: 'something', amount: 19, date: new Date() };
	}

	$scope.save = function () {
		Expenses.save($scope.expense);
		$location.path('/');
	}
}]);