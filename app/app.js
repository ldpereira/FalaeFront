var app = angular.module('myApp', ['ngRoute']);

//Config route
app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/_login.html',
			controller: 'LoginCtrl as ctrl'
		})
		.when('/dashboard', {
			templateUrl: 'views/_dashboard.html',
			controller: 'DashBoardCtrl as ctrl'
		})
		.when('/group', {
			templateUrl: 'views/_group.html',
			controller: 'GroupCtrl as ctrl'
		})
		.when('/mygroups', {
			templateUrl: 'views/_mygroups.html',
			controller: 'MyGroupsCtrl as ctrl'
		})
		.when('/chat/:groupID', {
			templateUrl: 'views/_chat.html',
			controller: 'ChatCtrl as ctrl'
		})
		.when('/report', {
			templateUrl: 'views/_report.html',
			controller: 'ReportCtrl as ctrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);