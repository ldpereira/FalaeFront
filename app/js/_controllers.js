"use strict";

var app = app || angular.module('myApp', ["google-chart"]);

app
	.controller('LoginCtrl', ['$location', 'UserService', '$http', function ($location, UserService, $http) {

		var vm = this;

		//public methods
		vm.login = login;
		vm.createUser = createUser;

		activate();

		function activate() {
			//init my user
			vm.myUser = {};
			vm.errorMessage = "";
		}

		function login(myUser) {
			UserService.login(myUser.name, myUser.password).then(function success(response) {
				localStorage.setItem("owner", response.data.User.username);
				$location.path("/dashboard");
			}, function error(response) {
				if (!response.data) {
					vm.errorMessage = "Usuário ou senha inválidos.";
				} else {
					vm.errorMessage = response.data.message;
				}
			});
		}

		function createUser(myUser) {
			UserService.postUser(myUser.name, myUser.password).then(function success(response) {
				console.log(response);
			}, function error(response) {
				console.log(response);
			});
			$location.path("/dashboard");
		}
	}])

	.controller('DashBoardCtrl', ['$location', 'GroupService', function ($location, GroupService) {

		var vm = this;

		//public methods
		vm.myGroups = myGroups;
		vm.relatorios = relatorios;

		activate();

		function activate() {
			//init
			vm.groups = {};

			GroupService.getGroups().then(function success(response) {
				vm.groups = getArray(response.data);
			}, function error(err) {
				console.log(err);
			});
		}

		function myGroups() {
			$location.path("/mygroups");
		}

		function relatorios() {
			$location.path("/report");
		}

		function getArray(map) {
			var arr = [];

			for (var key in map) {
				if (map.hasOwnProperty(key)) {
					arr.push(map[key].group);
				}
			}

			return arr;
		}

	}])

	.controller('MyGroupsCtrl', ['$location', 'GroupService', function ($location, GroupService) {

		var vm = this;

		//public methods
		vm.createGroup = createGroup;
		vm.deleteGroups = deleteGroups;

		activate();

		function activate() {
			//init
			vm.groups = {};
			var userLoged = localStorage.getItem("owner");
			GroupService.getMyGroups(userLoged).then(function success(response) {
				vm.groups = getArray(response.data);
			}, function error(err) {
				console.log(err);
			});
		}

		function createGroup() {
			$location.path("/group");
		}

		function deleteGroups() {
			var groupId = [];

			if (vm.groups.length > 0) {
				vm.groups.forEach(function (group) {
					if (group.select) {
						GroupService.deleteGroup(group.id).then(function success(response) {
							console.log(response.data);
							vm.mensagem = response.data;
						}, function error(err) {
							console.log(err);
						});
					}
				});
			}

			setTimeout(function () {
				activate();
			}, 1000);
		}

		function getArray(map) {
			var arr = [];

			for (var key in map) {
				if (map.hasOwnProperty(key)) {
					arr.push(map[key].group);
				}
			}

			return arr;
		}

	}])

	.controller('GroupCtrl', ['$location', 'GroupService', 'UserService', function ($location, GroupService, UserService) {

		var vm = this;

		//public methods
		vm.createGroup = createGroup;


		activate();

		function activate() {
			//init
			vm.myGroup = {};
			vm.users = {};

			UserService.getUsers().then(function success(response) {
				vm.users = getArray(response.data);
			}, function error(err) {
				console.log(err);
			});
		}

		function createGroup(myGroup) {
			var userLoged = localStorage.getItem("owner");
			var usersSelected = getUsersSelected(vm.users);

			GroupService.postGroup(myGroup.name, myGroup.description, userLoged, usersSelected).then(function success(response) {
				console.log(response.data);
				vm.mensagem = response.data;
			}, function error(response) {
				console.log(response.data);
				vm.errorMessage = response.data.message;
			});

			$location.path("/mygroups");
		}

		function getUsersSelected(users) {
			var arr = []

			if (users) {
				users.forEach(function (user) {
					if (user.select) {
						delete user.select;
						arr.push(user);
					}
				});
			}

			return arr;
		}

		function getArray(map) {
			var arr = [];

			for (var key in map) {
				if (map.hasOwnProperty(key)) {
					arr.push(map[key]);
				}
			}

			return arr;
		}

	}])

	.controller("ChatCtrl", ['$location', '$routeParams', 'ChatService', function ($location, $routeParams, ChatService) {
		var vm = this;

		vm.groupID = $routeParams.groupID;

		function activate() {
			vm.chat = {
				message: "",
				groupID: "",
				user: localStorage.getItem("owner")
			}

			ChatService.getMessages(vm.groupID).then(function success(response) {
				vm.messages = getArrayMessage(response.data);
			}, function error(err) {
				console.log(err);
			});

			ChatService.getContacts(vm.groupID).then(function success(response) {
				vm.contacts = getArray(response.data);
			}, function error(err) {
				console.log(err);
			});
		}

		activate();

		vm.sendMessage = function sendMessage(message) {
			var userLoged = localStorage.getItem("owner");
			ChatService.sendMessage(vm.groupID, message, userLoged).then(function success(response) {
				console.log(response.data);
				vm.messages.push(response.data.message);
			}, function error(response) {
				console.log(response.data);
				vm.errorMessage = response.data.message;
			});

			$location.path("/chat/" + vm.groupID);
		}

		function getArrayMessage(map) {
			var arr = [];

			for (var key in map) {
				if (map.hasOwnProperty(key)) {
					arr.push(map[key].message);
				}
			}

			return arr;
		}
		function getArray(map) {
			var arr = [];

			for (var key in map) {
				if (map.hasOwnProperty(key)) {
					arr.push(map[key]);
				}
			}

			return arr;
		}
	}])

	.controller('ReportCtrl', ['ReportService', function (ReportService) {
		var vm = this;
		vm.activate = activate;

		google.load('visualization', '1.0', { 'packages': ['corechart', 'table'], 'callback': draw });

		function getArray(map) {
			var arr = [];
			for (var key in map) { if (map.hasOwnProperty(key)) { arr.push(map[key]); } }
			return arr;
		}

		function activate() {
			ReportService.getUsuariosGrupos().then(function success(response) {
				vm.usuariosGrupos = getArray(response.data);
			}, function error(err) {
				console.log(err);
			});

			ReportService.getMensagensGrupos().then(function success(response) {
				vm.mensagensGrupos = getArray(response.data);
			}, function error(err) {
				console.log(err);
			});

			ReportService.getMensagensUsuarios().then(function success(response) {
				vm.mensagensUsuarios = getArray(response.data);
			}, function error(err) {
				console.log(err);
			});
		}

		function drawUsuariosGrupos($scope) {
			var mensagens = [];
			if (vm.usuariosGrupos) {
				for (var key in vm.usuariosGrupos) {
					if (vm.usuariosGrupos.hasOwnProperty(key)) {
						var arr = vm.usuariosGrupos[key].reportUserGroup;
						mensagens.push([arr.nomeGrupo, arr.quantidade]);
					}
				}
				var data = new google.visualization.DataTable();
				data.addColumn('string', 'Grupo');
		        data.addColumn('number', 'Quantidade de usuários');
				data.addRows(mensagens);

				var options = {showRowNumber: true, width: '600px', height: '300px'};
				var div = document.getElementById('chart_UsuariosGrupos');
				var chart = new google.visualization.Table(div);
				chart.draw(data, options);
			}
		}

		function drawMensagensGrupos() {
			var mensagens = [];
			mensagens.push(["Mensagens", "Grupos"]);
			if (vm.mensagensGrupos) {
				for (var key in vm.mensagensGrupos) {
					if (vm.mensagensGrupos.hasOwnProperty(key)) {
						var arr = vm.mensagensGrupos[key].reportMensagem;
						mensagens.push([arr.nomeGrupo, arr.quantidade]);
					}
				}
				var data = new google.visualization.arrayToDataTable(mensagens);
				var options = {
					title: 'Mensagens/Grupos',
					hAxis: { title: 'Grupos' },
					vAxis: { title: 'Mensagens' }
				};
				var div = document.getElementById('chart_MensagensGrupos');
				var chart = new google.visualization.ColumnChart(div);
				chart.draw(data, options);
			}
		}

		function drawMensagensUsuarios() {
			var mensagens = [];
			mensagens.push(["Mensagens", "Usuários"]);

			if (vm.mensagensUsuarios) {
				for (var key in vm.mensagensUsuarios) {
					if (vm.mensagensUsuarios.hasOwnProperty(key)) {
						var arr = vm.mensagensUsuarios[key].reportMensagem;
						mensagens.push([arr.nomeGrupo, arr.quantidade]);
					}
				}
				var data = new google.visualization.arrayToDataTable(mensagens);
				var options = {
					title: 'Mensagens/Usuários',
					pieHole: 0.4
				};
				var div = document.getElementById('chart_MensagensUsuários');
				var chart = new google.visualization.PieChart(div);
				chart.draw(data, options);
			}
		}

		function draw() {
			drawUsuariosGrupos();
			drawMensagensGrupos();
			drawMensagensUsuarios();
		}

		activate();

	}]);