



var app = angular.module("radio", ["ngRoute"]);


app.config(function($routeProvider, $locationProvider) {
    $routeProvider
	    .when("/banners", {
	    	templateUrl:'administration.html',
	    	item_type:'banner'
	    })
	    .when("/shows", {
	    	templateUrl:'administration.html',
	    	item_type:'show'
	    })
	    .when("/residents", {
	    	templateUrl:'administration.html',
	    	item_type:'resident'
	    })
	    .when("/events", {
	    	templateUrl:'administration.html',
	    	item_type:'event'
	    })
	     .when("/schedule", {
	    	templateUrl:'administration.html',
	    	item_type:'schedule'
	    })


	    .when("/login", {
	    	templateUrl:'login.html'
	    })
	    ;
    

    $locationProvider.html5Mode({
        enabled:true
    });
    
});