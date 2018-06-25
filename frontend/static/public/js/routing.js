



var app = angular.module("radio", ["ngRoute"]);



app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html"
    })

    .when("/shows", {
        templateUrl : "shows.html"
    })
    .when("/shows/:show_id", {
        templateUrl : "individual-show.html"
    })

    .when("/residents", {
        templateUrl : "residents.html"
    })
    .when("/residents/:resident_id", {
        templateUrl : "individual-resident.html"
    })

    .when("/guests", {
        templateUrl : "guests.html"
    })

    .when("/events", {
        templateUrl : "events.html"
    })

    .when('/tags/:tag', {
        templateUrl: "shows.html"
    })


    .when('/about', {
        templateUrl: "about.html"
    })

    .when('/schedule', {
        templateUrl: "schedule.html"
    })
    ;


    $locationProvider.html5Mode({
        enabled:true
    });
    
});