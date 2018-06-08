
app.controller("administration", function($scope, $http, $route) {
	$scope.item_type = $route.current.item_type;

	$scope.edit_template = 'edit_' + $scope.item_type + '.html';
	$scope.add_template = 'add_' + $scope.item_type + '.html';

	$scope.image_template = 'image_lightbox.html';
	$scope.resident_template = 'resident_lightbox.html';
	$scope.show_template = 'show_lightbox.html';


	$scope.add_item = {
		tags:[],
		tracks:[],
		residents:[],
		shows:[]
	};
	$scope.edit_item = {
		tags:[],
		tracks:[],
		residents:[],
		shows:[]
	};


	//set up token
	//get token and add to dictionaries

	//validate jwt

	function validate() {
		let url = '/api/admin/add_banner';
		let config = {
			method:'POST',
			url:url,
			headers:{
				"Authorization":"Bearer " + getToken()
			},
			data:{}
		}

		$http(config)
			.then((data)=> {
				console.log("successfuly auth")
			}, (err)=> {
				if (err.status >= 300 & err.status < 400) {
					window.location.href = err.data;
				}
			})
	}

	validate();




	$scope.save = function() {
		let url = '/api/admin/add_' + $scope.item_type;
		let config = {
			method:'POST',
			url:url,
			headers:{
				"Authorization":"Bearer " + getToken()
			},
			data:$scope.add_item
		}

		$http(config)
			.then((data)=> {
				let html = `
					<div class = "close_window" onclick="$(this.parentNode).fadeOut('fast');"></div>
					`;

				if (data.data.missingdata) {
					//missing info
					
					$('#message').html($scope.item_type + " " + data.data.missingdata + " cannot be empty" + html);
					
				} else {
					$('#message').html("Successfully added." + html);
					let i = $scope.add_item;
					i[data.data.item_type] = data.data.item_id;
					$scope.items.push(i);
					$('.add').fadeOut();
				}

				console.log(data);

				$('#message').show();
			}, (err)=>{
				if (err.status >= 300 & err.status < 400) {
					window.location.href = err.data;
				}
			});
	}

	$scope.update = function() {

		let url = '/api/admin/edit_' + $scope.item_type;
		

		let config = {
			method:'POST',
			url:url,
			headers:{
				"Authorization":"Bearer " + getToken()
			},
			data:$scope.edit_item
		}

		$http(config)
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
				if (err.status >= 300 & err.status < 400) {
					window.location.href = err.data;
				}
			});
	}

	$scope.delete = function() {
		let url = '/api/admin/delete_' + $scope.item_type;

		let config = {
			method:'POST',
			url:url,
			headers:{
				"Authorization":"Bearer " + getToken()
			},
			data:$scope.edit_item
		}
		
		$http(config)
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
					$('.edit').fadeOut();
				}



				$('#message').show();

			}, (err)=>{
				if (err.status >= 300 & err.status < 400) {
					window.location.href = err.data;
				}
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
		//if shows or residents then its an array
		if ($scope.choose_relation_field == 'residents') {
			$scope.choose_relation_data[$scope.choose_relation_field].push({
				'resident_id':item_id
			});
		} else if ($scope.choose_relation_field == 'shows') {
			$scope.choose_relation_data[$scope.choose_relation_field].push({
				'show_id':item_id
			});
		} else {
			//else image which is singular
			$scope.choose_relation_data[$scope.choose_relation_field] = item_id;
		}
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
			console.log("items here")
			console.log(data.data.items);
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
	        body:formdata,
			headers:{
				"Authorization":"Bearer " + getToken()
			}
	    }).then(function(res) {
	    	if (res.status != 200) {
	    		return res.text();
	    	} else {
	    		return res.json();
	    	}
	        
	    }).then(function(res) {
	    	console.log(res);
	    	if (res.image_id == undefined) {
	    		window.location.href = res;
	    	}


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



function editItem(e) {
	$('.edit').fadeIn();
	$('.add').fadeOut();
	$('.item').removeClass("selected")
	e.classList.add("selected");
}








app.controller("login", function($scope, $http) {

	$scope.validate = function() {
		console.log('validate')
		let data = {
			username:$scope.username,
			password:$scope.password
		}
		let jdata = JSON.stringify(data);
		$http.post('/api/admin/login', jdata)
			.then(
				(data)=> {
					console.log(data)
					window.localStorage.setItem('token', data.data.token);
					window.location.href = '/admin/banners';
				},
				(err)=> {
					console.log(err)
				});
	}
});




function getToken() {
	return window.localStorage.getItem('token');
}