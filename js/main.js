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
var app = angular.module('GoT_Reference', ["ngRoute"]);

app.config(function($routeProvider) {
   $routeProvider
    .when("/sample", {
        templateUrl: "views/sample_q.html",
        controller: "SampleQController",
        url: ""
    })
    .otherwise({
        templateUrl : "views/coverpage.html",
        url:""
    });
});

app.controller("SampleQController", function($scope, $http){
  $scope.show_loading = false;
  $scope.show_result = false;

  $scope.submit_form = function () {
    $scope.show_loading = true;
    $scope.show_result = false;

    $http.post("php/sample_q.php", {'dad': $scope.dad_name}).then(function success(res){
      $scope.show_loading = false;
      $scope.show_result = true;
      $scope.result = res.data;
    }, function error(res){

    });
  }



});
