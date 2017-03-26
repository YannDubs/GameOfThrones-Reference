// sidebar stuff

function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("content").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("content").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
}

// Angular Stuff
// Create Angular Module
var app = angular.module('GoT_Reference', ["ngRoute"]);

// Create $page attribute
app.factory('$page', function() {
   var base_title = 'GoT Reference';
   var title = 'GoT Reference';
   return {
     title: function() { return title; },
     setTitle: function(newTitle) {
        if (newTitle === "") {
          title = base_title;
        } else {
          title = base_title + " - " + newTitle;
        }
      }
   };
});

// add $page to the root scope
app.run(function($rootScope, $page){
  $rootScope.$page = $page;
});

// Setup templates for each query
app.config(function($routeProvider) {
   $routeProvider
    // <a href="#sample">link</a>
    .when("/sample", {
        templateUrl: "views/sample_q.html",
        controller: "SampleQController",
        url: ""
    })
    .when("/select_project", {
        templateUrl: "views/select_project.html",
        controller: "SampleQController",
        url: ""
    })
    // add more views here
    // default to the coverpage
    .otherwise({
        templateUrl : "views/coverpage.html",
        controller: "CoverPageController",
        url:""
    });
});

// Controller for CoverPage view
app.controller("CoverPageController", function($scope, $page){
  $page.setTitle(""); // Set title
});

// Controller for SampleQ view
app.controller("SampleQController", function($scope, $http, $page){
  $page.setTitle("Sample"); // Set title

  // default loading div and result table to hidden
  $scope.show_loading = false;
  $scope.show_result = false;

  // submit function
    // <... ng-click="submit_form()">
  $scope.submit_form = function () {
    // TODO: turn the hidden div's into Angular components
      // error component
      // spoiler component
      // result table component

    $scope.show_loading = true; // show loading div
    $scope.show_result = false; // make sure result table is hidden

    // send request to server
    $http.post("php/sample_q.php", {'dad': $scope.dad_name}).then(function success(res){
      // when we get data back

      // TODO: handle this
      // if result
        // if we get a valid result

      $scope.show_loading = false; // hide loading div
      $scope.show_result = true; // show result table
      $scope.result = res.data; // populate result table

      // else if spoiler
        // if we get a spoiler, display the message
      // else if error
        // if we get an error, display the error
      // else
        // we shouldn't get this
        // need to display an error

    }, function error(res){
      // if there was an error establishing connection,
      // display an error
    });
  }

});
