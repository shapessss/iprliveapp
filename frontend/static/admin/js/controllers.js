
app.controller("administration", function($scope, $http, $route) {
	$scope.item_type = $route.current.item_type;

	$scope.edit_template = 'edit_' + $scope.item_type + '.html'
	$scope.add_template = 'add_' + $scope.item_type + '.html'

	$http.get('/api/public/' + $scope.item_type)
		.then((data)=> {
			$scope.items = data.data.items;
		}, 
		(err)=> {

		});
})

