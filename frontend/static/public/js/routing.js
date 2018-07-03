



var app = angular.module("radio", ["ngRoute"]);



app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
        title:"internetpublicradio"
    })

    .when("/shows", {
        templateUrl : "shows.html",
        title:"internetpublicradio - shows"
    })
    .when("/shows/:show_name", {
        templateUrl : "individual-show.html",
        title:"internetpublicradio - shows"
    })

    .when("/residents", {
        templateUrl : "residents.html",
        title:"internetpublicradio - residents"
    })
    .when("/residents/:resident_name", {
        templateUrl : "individual-resident.html",
        title:"internetpublicradio - residents"
    })

    .when("/guests", {
        templateUrl : "guests.html",
        title:"internetpublicradio - guests"
    })

    .when("/events", {
        templateUrl : "events.html",
        title:"internetpublicradio - events"
    })

    .when('/tags/:tag', {
        templateUrl: "shows.html",
        title:"internetpublicradio - shows"
    })


    .when('/about', {
        templateUrl: "about.html",
        title:"internetpublicradio - about"
    })

    .when('/schedule', {
        templateUrl: "schedule.html",
        title:"internetpublicradio - schedule"
    })
    ;


    $locationProvider.html5Mode({
        enabled:true
    });
    
});


app.run(['$rootScope', '$route', function($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function() {
        document.title = $route.current.title;
    });
}]);