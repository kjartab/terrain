// user.js

var MD = MD || {};


MD.user = (function () {
	
	function init() {
	
	}
	
	
	function updateUsers(usersArray) {
		for (var i=0; i<usersArray; i++) {

			console.log(usersArray[i]);
		}
	}
	
	function getUsers(callback) {
	
		
		
		$.ajax({
			type: "GET",
			url: 'http://trdfme01.miljodirektoratet.no/fmedatastreaming/Naturbase_import_testdatabase/brukere.fmw?token=' + token ,
			crossDomain: true,
			success: function (data) {
				updateUsers(data);
				console.log(data);
			},
			error: function (data) {
				alert(data);
			}
		});		
	
	
	
	
	
		
	}
	
	

})();



MD.workspace = (function () {

	var _repository;
	var _workspace;

	function init(repository, workspace, $div) {
		_repository = repository;
		_workspce = workspace;
	}
	
	function getWorkspace(token) {
	
	}
	
	function uploadData() {
		
	}
	
	

})();