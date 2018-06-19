



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


app.controller('shows', function($scope, $http) {
	$http.get('api/public/shows')
		.then((data)=> {
			let shows = data.data.items;

			//if desktop
			//make shows multiple of 3
			
			$scope.latest = sort_by_date(shows); //filter by date and get latest
			$scope.featured = sort_by_featured(shows);
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
	console.log("INDIVIDUAL SHOW CONTROLLER")
	let show = individual_clicked.get_resident();
	console.log(show);
	if (show == null) {
		$http.get('api/public/show?show_id=' + $routeParams.show_id)
			.then((data)=> {
				console.log(data);
				$scope.items = data.data.items;
			}, 
			(err)=> {

			});
	} else {
		$scope.items = show;
	}
	console.log($scope.items);
	
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


	let get_show = function() {return show}
	let get_resident = function() {return resident}

	return {
		new_show : new_show,
		new_resident : new_resident,
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