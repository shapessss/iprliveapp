



var app = angular.module("radio", ["ngRoute"]);


app.config(function($routeProvider, $locationProvider) {
    $routeProvider
	    .when("/banners", {
	    	templateUrl:'administration.html',
	    	item_type:'banners'
	    })
	    .when("/shows", {
	    	templateUrl:'administration.html',
	    	item_type:'shows'
	    })
	    ;
    

    $locationProvider.html5Mode({
        enabled:true
    });
    
});