var app = angular.module('myApp');
var prefix = "http://localhost:8080/FalaeWS/service/";

app.factory('UserService', ['$http', function ($http) {

	var service = {
		login: login,
		getUsers: getUsers,
		postUser: postUser
	};

	function login(user, pass) {
		return $http.get(prefix + 'login/' + user + '/' + pass);
	}

	function getUsers() {
		return $http.get(prefix + 'getUsers');
	}

	function postUser(name, password) {
		return $http.get(prefix + 'postUser/' + name + '/' + password);
	}

	return service;
}])

	.factory('GroupService', ['$http', function ($http) {

		var service = {
			getGroups: getGroups,
			getMyGroups: getMyGroups,
			postGroup: postGroup,
			deleteGroup: deleteGroup
		};

		function getGroups() {
			return $http.get(prefix + 'getGroups');
		}

		function getMyGroups(owner) {
			return $http.get(prefix + 'getMyGroups/' + owner);
		}

		function postGroup(name, description, owner, users) {
			return $http.get(prefix + 'postGroup/' + name + '/' + owner + '/' + description);
		}

		function deleteGroup(name) {
			return $http.get(prefix + 'deleteGroup/' + name);
		}

		return service;
	}])

	.factory('ChatService', ['$http', function createChatService($http) {

		var service = {
			getMessages: getMessages,
			getContacts: getContacts,
			sendMessage: sendMessage
		};

		function getMessages(group) {
			return $http.get(prefix + 'getMessages/' + group);
		}

		function getContacts(group) {
			return $http.get(prefix + 'getContacts/' + group);
		}

		function sendMessage(group, message, user) {
			return $http.get(prefix + 'sendMessage/' + group + "/" + user + "/" + message);
		}

		return service;
	}])

	.factory('ReportService', ['$http', function createReportService($http) {
		/** Obtém estatísticas de usuários por grupo. */
		function getUsuariosGrupos() { return $http.get(prefix + 'getUsuariosGrupos'); }

		/** Obtém estatísticas de mensagens por grupo. */
		function getMensagensGrupos() { return $http.get(prefix + 'getMensagensGrupos'); }

		function getMensagensUsuarios() { return $http.get(prefix + 'getMensagensUsuarios'); }

		return {
			getUsuariosGrupos: getUsuariosGrupos,
			getMensagensGrupos: getMensagensGrupos,
			getMensagensUsuarios: getMensagensUsuarios
		}
	}]);