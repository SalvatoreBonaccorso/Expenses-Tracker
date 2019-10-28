var app = angular.module('expensesApp', ['ngRoute']);

// implementing Routes
app.config(function ($routeProvider) {
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
		.otherwise({
			redirectTo: "/"
		});
});


app.controller('ExpensesViewController', ['$scope', function ($scope) {
    $scope.expenses = [
        { description: 'food', amount: 10, date: '2019-10-01' },
        { description: 'tickets', amount: 11, date: '2019-10-02' },
        { description: 'food', amount: 12, date: '2019-10-03' },
        { description: 'phone edit', amount: 13, date: '2019-10-04' },
        { description: 'bills', amount: 14, date: '2019-10-05' },
        { description: 'food', amount: 15, date: '2019-10-06' }
    ]
}]);

app.controller('ExpenseViewController', ['$scope', function ($scope) {
    $scope.someText = 'The world is round';
}]);