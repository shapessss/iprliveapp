



app.controller('banners', function($scope, $http) {

	$http.get('/api/public/banners')
		.then((data)=> {
			$scope.items = data.data.items;

			if (window.innerWidth > 750 && $scope.items.length > 0) {
                add_banner($scope.items); //call from paint.js
                //change height of banner based on webpage
                document.getElementById("banner").setAttribute("style", "height:"+window.innerHeight+"px;")
            }

        
		}, 
		(err)=> {
			console.log(err)
		});

});


app.controller('main_shows', function($scope, $http, individual_clicked) {
	//THIS IS FOR MAIN PAGE , basically limited to featured and latest
	
	
	$http.get('api/public/featured_shows')
		.then((data)=> {
			$scope.featured = data.data.items;
		}, 
		(err)=> {

		});

	$http.get('api/public/latest_shows')
		.then((data)=> {
			$scope.latest = data.data.items;
		}, 
		(err)=> {

		});

	
	$scope.set_show = function(show) {
		individual_clicked.set_show(show);
	}
});


app.controller('all_shows', function($scope, $http, $routeParams, individual_clicked) {
	//THIS IS FOR SHOWS PAGE , basically limited to featured and latest
	
	//if tag then tag page, else /shows
	if ($routeParams.tag) {
		$http.get('api/public/tagged_shows?tag='+$routeParams.tag)
			.then((data)=> {
				console.log(data.data.items);
				$scope.shows = data.data.items;
			}, 
			(err)=> {

			});
	} else {
	
		$http.get('api/public/shows')
			.then((data)=> {
				$scope.shows = data.data.items;
			}, 
			(err)=> {

			});
	}
	
	
	$scope.set_show = function(show) {
		individual_clicked.set_show(show);
	}
});


app.controller('individual_show', function($scope, $http, $routeParams, individual_clicked) {
	let show = individual_clicked.get_show();
	console.log(show);
	if (show == null) {
		$http.get('api/public/show?show_id=' + $routeParams.show_id)
			.then((data)=> {
				if (data.data.items.length > 0) {
					$scope.items = data.data.items[0];
				}
			}, 
			(err)=> {

			});
	} else {
		$scope.items = show;
	}
	
	
});


app.controller('all_residents', function($scope, $http, individual_clicked) {
	$http.get('api/public/residents')
		.then((data)=> {
			$scope.items = data.data.items;
		}, 
		(err)=> {

		});

	$scope.set_resident = function(resident) {
		individual_clicked.set_resident(resident);
	}
});




app.controller('individual_resident', function($scope, $http, $routeParams, individual_clicked) {
	let resident = individual_clicked.get_resident();
	if (resident == null) {
		$http.get('api/public/resident?resident_id=' + $routeParams.resident_id)
			.then((data)=> {
				if (data.data.items.length > 0) {
					$scope.resident = data.data.items[0];
				}
			}, 
			(err)=> {

			});
	} else {
		$scope.resident = resident;
	}	
	document.getElementById("banner").setAttribute("style", "height:" + window.innerHeight * 0.8 + "px;")
});

app.controller('events', function($scope, $http) {
	$http.get('api/public/events')
		.then((data)=> {
			$scope.items = data.data.items;
		}, 
		(err)=> {

		});
});


app.service("individual_clicked", function() {
	let show = null;
	let resident = null;

	let set_show = function(s) {
		show = s;
	}

	let set_resident = function(r) {
		resident = r;
	}


	let get_show = function() {return show}
	let get_resident = function() {return resident}

	return {
		set_show : set_show,
		set_resident : set_resident,
		get_show : get_show, 
		get_resident : get_resident
	}
})







function sort_by_date(items) {
	//returns items ordered by latest to least recent
	let x = items;

	x.sort(function(a, b) {
		ad = new Date(a.date);

		bd = new Date(b.date);
	
		return ad>bd ? 1 : ad<bd ? -1 : 0;
	});
	return x;
}


function sort_by_featured(items) {
	let featured = [];
	let count = 0;
	for (var i of items) {
		if (i.featured) {
			featured.push(i);
			count += 1;
			if (count >= 8) return featured;
		}
	}
	return featured;
	
}