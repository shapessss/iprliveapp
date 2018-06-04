
app.controller("administration", function($scope, $http, $route) {
	$scope.item_type = $route.current.item_type;

	$scope.edit_template = 'edit_' + $scope.item_type + '.html';
	$scope.add_template = 'add_' + $scope.item_type + '.html';

	$scope.image_template = 'image_lightbox.html';
	$scope.resident_template = 'resident_lightbox.html';
	$scope.show_template = 'show_lightbox.html';


	$scope.add_item = {};
	$scope.edit_item = {};
	//set up token
	//get token and add to dictionaries



	$scope.save = function() {
		let url = '/api/admin/add_' + $scope.item_type;
		let data = JSON.stringify($scope.add_item);
		$http.post(url, data)
			.then((data)=> {

			}, (err)=>{

			});
	}

	$scope.update = function() {
		let url = '/api/admin/edit_' + $scope.item_type;
		let data = JSON.stringify($scope.edit_item);
		$http.post(url, data)
			.then((data)=> {

			}, (err)=>{

			});
	}

	$scope.delete = function() {
		let url = '/api/admin/delete_' + $scope.item_type;
		let data = JSON.stringify($scope.edit_item);
		$http.post(url, data)
			.then((data)=> {

			}, (err)=>{

			});
	}


	$scope.choose_relation_data = null;
	$scope.choose_relation_field = null;
	$scope.choose_relation = function(data, field, relation_type) {
		//load images
		//show images
		//update image
		console.log(document.getElementsByClass("lightbox"))
		document.getElementsByClass("lightbox")[0].style.display = "block"
		$("#lightbox-" + relation_type).fadeIn('fast');
		$scope.choose_relation_data = data;
		$scope.choose_relation_field = field;
	}


	//get current object
	$http.get('/api/public/' + $scope.item_type + 's')
		.then((data)=> {
			$scope.items = data.data.items;
		}, 
		(err)=> {

		});

	//get images
	$http.get('/api/admin/images')
		.then((data)=> {
			$scope['images'] = data.data.items;
		}, 
		(err)=> {

		});


	//get shows
	$http.get('/api/public/shows')
		.then((data)=> {
			$scope['shows'] = data.data.items;
		}, 
		(err)=> {

		});


	//get residents
	$http.get('/api/public/residents')
		.then((data)=> {
			$scope['residents'] = data.data.items;
		}, 
		(err)=> {

		});
})

