



var app = angular.module("radio", ["ngRoute"]);



app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html"
    })
    ;


    $locationProvider.html5Mode({
        enabled:true
    });
    
});