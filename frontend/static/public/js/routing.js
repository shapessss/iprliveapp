



var app = angular.module("radio", ["ngRoute"]);



app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html"
    })
    .when("/shows/:show_id", {
        templateUrl : "individual-show.html"
    });


    $locationProvider.html5Mode({
        enabled:true
    });
    
});