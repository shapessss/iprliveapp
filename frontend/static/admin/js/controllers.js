
app.controller("administration", function($scope, $http, $route) {
	$scope.item_type = $route.current.item_type;

	$scope.edit_template = 'edit_' + $scope.item_type + '.html';
	$scope.add_template = 'add_' + $scope.item_type + '.html';

	$scope.image_template = 'image_lightbox.html';
	$scope.resident_template = 'resident_lightbox.html';
	$scope.show_template = 'show_lightbox.html';


	$scope.add_item = {};
	$scope.edit_item = {};

	//special if shows 
	if ($scope.item_type == 'show') {
		$scope.add_item = {
			tags:[],
			tracks:[],
			residents:[]
		}
		$scope.edit_item = {
			tags:[],
			tracks:[],
			residents:[]
		}
	} else if ($scope.item_type == 'resident') {

		$scope.add_item = {
			shows:[]
		}
		$scope.edit_item = {
			shows:[]
		}
		
	}


	//set up token
	//get token and add to dictionaries

	console.log($scope.item_type)

	$scope.save = function() {
		let url = '/api/admin/add_' + $scope.item_type;
		let data = JSON.stringify($scope.add_item);

		console.log(data);

		$http.post(url, data)
			.then((data)=> {
				let html = `
					<div class = "close_window" onclick="$(this.parentNode).fadeOut('fast');"></div>
					`;

				if (data.data.missingdata) {
					//missing info
					
					$('#message').html($scope.item_type + " " + data.data.missingdata + " cannot be empty" + html);
					
				} else {
					$('#message').html("Successfully added." + html);
					$scope.items.push($scope.add_item);
				}

				console.log(data);

				$('#message').show();
			}, (err)=>{

			});
	}

	$scope.update = function() {
		let url = '/api/admin/edit_' + $scope.item_type;
		let data = JSON.stringify($scope.edit_item);
		$http.post(url, data)
			.then((data)=> {

				let html = `
					<div class = "close_window" onclick="$(this.parentNode).fadeOut('fast');"></div>
					`;

				if (data.data.missingdata) {
					//missing info
					
					$('#message').html($scope.item_type + " " + data.data.missingdata + " cannot be empty" + html);
					
				} else {
					$('#message').html("Successfully updated." + html);
				}



				$('#message').show();

			}, (err)=>{

			});
	}

	$scope.delete = function() {
		let url = '/api/admin/delete_' + $scope.item_type;
		let data = JSON.stringify($scope.edit_item);
		console.log(data);
		$http.post(url, data)
			.then((data)=> {
				
				let html = `
					<div class = "close_window" onclick="$(this.parentNode).fadeOut('fast');"></div>
					`;

				if (data.data.missingdata) {
					//missing info
					
					$('#message').html($scope.item_type + " " + data.data.missingdata + " cannot be empty" + html);
					
				} else {
					$('#message').html("Successfully deleted." + html);
					$scope.items.splice($scope.edit_item.item_index, 1);
				}



				$('#message').show();

			}, (err)=>{

			});
	}


	$scope.choose_relation_data = null;
	$scope.choose_relation_field = null;
	$scope.choose_relation = function(data, field, relation_type) {
		//load images
		//show images
		//update image
		$("#lightbox-images").hide();
		$("#lightbox-residents").hide();
		$("#lightbox-shows").hide();
		document.getElementsByClassName("lightbox")[0].style.display = "block"
		$("#lightbox-" + relation_type).fadeIn('fast');
		$scope.choose_relation_data = data;
		$scope.choose_relation_field = field;
	}

	$scope.select_relation = function(item_id) {
		$scope.choose_relation_data[$scope.choose_relation_field] = item_id;
	}


	//get current object
	$http.get('/api/public/' + $scope.item_type + 's')
		.then((data)=> {
			//convert date if there
			if (data.data.items.length > 0) {
				if (data.data.items[0].date != undefined) {
					for (var d of data.data.items) {
						d.date = new Date(d.date);
					}
					
				}
			}
			
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
	if ($scope.item_type != 'show') {
		$http.get('/api/public/shows')
			.then((data)=> {
				$scope['shows'] = data.data.items;
			}, 
			(err)=> {

			});
	}
	


	//get residents
	if ($scope.item_type != 'resident') {
		$http.get('/api/public/residents')
			.then((data)=> {
				$scope['residents'] = data.data.items;
			}, 
			(err)=> {

			});
	}


	//upload an image
	$("body").on("click", "#image-upload-form", function() {
	    //check if file
	    let form = document.getElementById("image-form");
	    let file = form.getElementsByTagName("input")[0];
	    if (file.files.length < 1) return;

	    let formdata = new FormData();
	    formdata.append("image", file.files[0]);
	    
	    fetch('/api/admin/add_image', {
	        method:'POST',
	        body:formdata
	    }).then(function(res) {
	        return res.json();
	    }).then(function(res) {
	    	
	        $scope.images.push({
	        	image_id:res.image_id,
	        	imagename:res.imagename
	        })
	        $scope.$apply();
	    })

	})



	//loading an edit form with correct data
	$scope.loadEditForm = function(item, index) {
		$scope.edit_item = item;
		$scope.edit_item['item_index'] = index;
	}


	$scope.more_fields = function(data) {
        data.push({})
    }


})

