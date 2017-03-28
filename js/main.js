// sidebar stuff

function openNav() {
    document.getElementById("sidebar").style.marginLeft = "0";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("sidebar").style.marginLeft = "-300px";
    document.body.style.backgroundColor = "white";
}

// Angular Stuff
// Create Angular Module
var app = angular.module('GoT_Reference', ["ngRoute","ui.bootstrap"]);

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
        controller: "ExploreGroupController",
        url: ""
    })
    .when("/killed", {
        templateUrl: "views/killed.html",
        controller: "KilledController",
        url: ""
    })
    .when("/leader_of_group", {
        templateUrl: "views/leader_of_group.html",
        controller: "LeaderOfGroupController",
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

app.controller("AdminLoginController", function($scope){

  console.log($scope);

});

app.controller("ContentController", function($scope){

  console.log($scope);

  $scope.alerts = [];

  $scope.postErrorMessage = function(s,d){
    $scope.alerts.push({type: "error", message: s, details: d});
  };

  $scope.postSpoilerMessage = function(s,d){
    $scope.alerts.push({type: "spoiler", message: s, details: d});
  };

  $scope.postInfoMessage = function(s,d){
    $scope.alerts.push({type: "info", message: s, details: d});
  };

  $scope.closeAlert = function(idx){
    $scope.alerts.splice(idx, 1);
  };

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

    var the_scope = $scope;

    // send request to server
    $http.post("php/sample_q.php", {'dad': $scope.dad_name}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.spoiler);
      } else {
          the_scope.postErrorMessage("An unknown error was encountered when running this query");
          console.log(res);
      }

    }, function error(res){
      the_scope.show_loading = false;
      the_scope.postErrorMessage("There was an exception", res.message);
      console.log(res);
    });
  }

});

app.controller("ExploreGroupController", function($scope, $http, $page){
  $page.setTitle("Select Project"); // Set title

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

    var the_scope = $scope;

    // send request to server
    $http.post("php/sample_q.php", {'dad': $scope.dad_name}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.spoiler);
      } else {
          the_scope.postErrorMessage("An unknown error was encountered when running this query");
          console.log(res);
      }

    }, function error(res){
      the_scope.show_loading = false;
      the_scope.postErrorMessage("There was an exception", res);
      console.log(res);
    });
  }

});

app.controller("KilledController", function($scope, $http, $page){
  $page.setTitle("Killed"); // Set title

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

    var the_scope = $scope;

    $http.post("php/killed_q.php", {'character': $scope.character}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.spoiler);
      } else {
          the_scope.postErrorMessage("An unknown error was encountered when running this query");
          console.log(res);
      }

    }, function error(res){
      the_scope.show_loading = false;
      the_scope.postErrorMessage("There was an exception", res);
      console.log(res);
    });
  }

});

app.controller("LeaderOfGroupController", function($scope, $http, $page){
  $page.setTitle("Leader"); // Set title

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
    $http.post("php/leader_of_group_q.php", {'name': $scope.name}).then(function success(res){
      // when we get data back

      if (res.data.result){
          $scope.show_loading = false; // hide loading div
          $scope.show_result = true; // show result table
          $scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          $scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        $scope.postErrorMessage(res.data.spoiler);
      } else {
          $scope.postErrorMessage("An unknown error was encountered when running this query");
          console.log(res);
      }

    }, function error(res){
      the_scope.show_loading = false;
      the_scope.postErrorMessage("There was an exception", res.message);
      console.log(res);
    });
  }

});
