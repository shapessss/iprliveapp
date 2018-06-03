



app.controller('banners', function($scope, $http) {

	$http.get('api/public/banners')
		.then((data)=> {
			$scope.items = data.data.items;
		}, 
		(err)=> {

		});

});


app.controller('shows', function($scope, $http) {
	$http.get('api/public/shows')
		.then((data)=> {
			$scope.items = data.data.items;
		}, 
		(err)=> {

		});
});


app.controller('residents', function($scope, $http) {
	$http.get('api/public/residents')
		.then((data)=> {
			$scope.items = data.data.items;
		}, 
		(err)=> {

		});
});


app.controller('events', function($scope, $http) {
	$http.get('api/public/events')
		.then((data)=> {
			$scope.items = data.data.items;
		}, 
		(err)=> {

		});
});


app.controller('individual_show', function($scope, $http, $routeParams, individual_clicked) {

	let show = individual_clicked.get_resident();
	if (show == null) {
		$http.get('api/public/show?show_id=' + $routeParams.show_id)
			.then((data)=> {
				$scope.items = data.data.items;
			}, 
			(err)=> {

			});
	} else {
		$scope.items = show;
	}

	
});


app.controller('individual_resident', function($scope, $http, $routeParams, individual_clicked) {

	let resident = individual_clicked.get_resident();
	if (resident == null) {
		$http.get('api/public/show?resident_id=' + $routeParams.resident_id)
			.then((data)=> {
				$scope.items = data.data.items;
			}, 
			(err)=> {

			});
	} else {
		$scope.items = resident;
	}

	
});




app.service("individual_clicked", function() {
	let show = null;
	let resident = null;

	let new_show = function(s) {
		show = s;
	}

	let new_resident = function(r) {
		resident = r;
	}


	let get_show = function() return show;
	let get_resident = function() return resident;

	return {
		new_show : new_show,
		new_resident : new_resident,
		get_show : get_show, 
		get_resident : get_resident
	}
})

