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
    .when("/owner_of_place", {
        templateUrl: "views/owner_of_place.html",
        controller: "OwnerOfPlaceController",
        url: ""
    })
    .when("/age_of_death", {
        templateUrl: "views/age_of_death.html",
        controller: "AgeOfDeathController",
        url: ""
    })
    .when("/change_season", {
        templateUrl: "views/change_season.html",
        controller: "ChangeSeasonController",
        url: ""
    })
    .when("/first_appearance", {
        templateUrl: "views/first_appearance.html",
        controller: "FirstAppearanceController",
        url: ""
    })
    .when("/gender_deaths", {
        templateUrl: "views/gender_deaths.html",
        controller: "GenderDeathsController",
        url: ""
    })
    .when("/killed_young", {
        templateUrl: "views/killed_young.html",
        controller: "KilledYoungController",
        url: ""
    })
    .when("/made_orphan", {
        templateUrl: "views/made_orphan.html",
        controller: "MadeOrphanController",
        url: ""
    })
    .when("/most_episodes", {
        templateUrl: "views/most_episodes.html",
        controller: "MostEpisodesController",
        url: ""
    })
    .when("/most_killed", {
        templateUrl: "views/most_killed.html",
        controller: "MostKilledController",
        url: ""
    })
    .when("/most_new_characters", {
        templateUrl: "views/most_new_characters.html",
        controller: "MostNewCharactersController",
        url: ""
    })
    .when("/youngest_child", {
        templateUrl: "views/youngest_child.html",
        controller: "youngestChildController",
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

app.controller("AdminLoginController", function($scope, $http){

  $scope.submit_login_form = function () {
    var the_scope = $scope;
    $http.post("php/login_q.php", {'userN': $scope.username_field, 'passW': $scope.password_field}).then(function success(res){
      // when we get data back
      if (res.data.result){
          if (res.data.result.length !== 1){
            the_scope.postErrorMessage("Invalid username or password");
          } else {
            the_scope.login(res.data.result[0]);
          }
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);
      } else {
          the_scope.postErrorMessage("An unknown error was encountered when running this query", res.data);
      }
    }, function error(res){
      the_scope.show_loading = false;
      the_scope.postErrorMessage("There was an exception", res.message);
      console.log(res);
    });
  }

});

var name=false;
var year_of_birth=false;
var gender=false;
var job=false;
var first_appearance=false;
var killer=false;
var killed_in_season=false;
var emptyCounts=0;
var group="";
var toSelect="";
app.controller("SelectController", function($scope){ 
   $scope.submit_form = function() {
      if($scope.group !="arryn"
          && $scope.group != "baelish"
          && $scope.group != "baratheon"
          && $scope.group != "greyjoy"
          && $scope.group != "lannister"
          && $scope.group != "nightswatch"
          && $scope.group != "stark"
          && $scope.group != "tully"
          && $scope.group != "tyrell"){
          $scope.postErrorMessage("Please select a group!");
      }
      else{
        if($scope.attribute.value1 =="YES"){
          name=true;
          toSelect+="name,";
        }
        else{
          emptyCounts++;
          name=false;
        }
        if($scope.attribute.value2=="YES"){
          year_of_birth=true;
          toSelect+="year_of_birth,";
        }
        else{
          year_of_birth=false;
          emptyCounts++;
        }
        if($scope.attribute.value3=="YES"){
          gender=true;
          toSelect+="gender,";
        }
        else{
          gender=false;
          emptyCounts++;
        }
        if($scope.attribute.value4=="YES"){
          job=true;
          toSelect+="job,";
        }
        else{
          job=false;
          emptyCounts++;
        }
        if($scope.attribute.value5=="YES"){
          first_appearance=true;
          toSelect+="first_appearance,";
        }
        else{
          first_appearance=false;
          emptyCounts++;
        }
        if($scope.attribute.value6=="YES"){
          killer=true;
          toSelect+="killer,";
        }
        else{
          killer=false;
          emptyCounts++;
        }
        if($scope.attribute.value6=="YES"){
          killed_in_season=true;
          toSelect+="killed_in_season,";
        }
        else{
          killed_in_season=false;
          emptyCounts++;
        }
        if(emptyCounts==7){
          $scope.postErrorMessage("Please select at least one attribute");
          emptyCounts=0;
        }else{
          
          group=$scope.group;
          if(toSelect==""){
            $scope.postErrorMessage("Please select at least one attribute");
          }
          //remove last coma of toSelect string
          toSelect = toSelect.slice(0, -1);
          alert(group);
          alert(toSelect);
          //Reinitialize variables
          emptyCounts=0;
          toSelect="";
          group="";
        }
        
      }  
   };
});


app.controller("ContentController", function($scope){

  console.log($scope);

  $scope.alerts = [];
  $scope.account = undefined;

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

  $scope.login = function(acct){
    $scope.account = acct;
    $scope.postInfoMessage("You have successfully Logged In", (acct.ISMODERATOR == true)?"You are a moderator. You can have permissions to edit the data.":undefined);
  };

  $scope.logout = function(){
    $scope.account = undefined;
    $scope.postInfoMessage("You have successfully Logged Out");
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
    the_scope.postErrorMessage("There was a problem.");

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

      } else {
          the_scope.postErrorMessage("An unknown error was encountered when running this query", res.data);
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
        the_scope.postErrorMessage(res.data.error);

      } else {
          the_scope.postErrorMessage("An unknown error was encountered when running this query",res.data);
      }

    }, function error(res){
      the_scope.show_loading = false;
      the_scope.postErrorMessage("There was an exception", res.message);
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
        the_scope.postErrorMessage(res.data.error);

      } else {
          the_scope.postErrorMessage("An unknown error was encountered when running this query", res.data);
      }

    }, function error(res){
      the_scope.show_loading = false;
      the_scope.postErrorMessage("There was an exception", res.message);
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

    var the_scope = $scope;

    // send request to server
    $http.post("php/leader_of_group_q.php", {'name': $scope.name}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);
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

app.controller("OwnerOfPlaceController", function($scope, $http, $page){
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
    $http.post("php/owner_of_place.php", {'place': $scope.place}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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

app.controller("AgeOfDeathController", function($scope, $http, $page){
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
    $http.post("php/age_of_death_q.php", {'character': $scope.character}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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

app.controller("ChangeSeasonController", function($scope, $http, $page){
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
    $http.post("php/change_season.php", {'season': $scope.season}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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

app.controller("FirstAppearanceController", function($scope, $http, $page){
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
    $http.post("php/first_appearance.php", {'character': $scope.character}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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

app.controller("GenderDeathsController", function($scope, $http, $page){
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
    $http.post("php/gender_deaths.php", {'character': $scope.character}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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

app.controller("KilledYoungController", function($scope, $http, $page){
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
    $http.post("php/killed_young.php", {'character': $scope.character}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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

app.controller("MadeOrphanController", function($scope, $http, $page){
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
    $http.post("php/made_orphan.php", {'character': $scope.character}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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

app.controller("MostEpisodesController", function($scope, $http, $page){
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
    $http.post("php/most_episodes.php", {'character': $scope.character}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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

app.controller("MostKilledController", function($scope, $http, $page){
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
    $http.post("php/most_killed.php", {'character': $scope.character}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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

app.controller("MostNewCharactersController", function($scope, $http, $page){
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
    $http.post("php/most_new_characters.php", {'character': $scope.character}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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

app.controller("youngestChildController", function($scope, $http, $page){
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
    $http.post("php/youngest_child.php", {'character': $scope.character}).then(function success(res){
      // when we get data back

      if (res.data.result){
          the_scope.show_loading = false; // hide loading div
          the_scope.show_result = true; // show result table
          the_scope.result = res.data.result; // populate result table
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);

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


