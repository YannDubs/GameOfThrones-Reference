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
        controller: "SelectController",
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
        templateUrl: "views/newest_characters.html",
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

app.controller("SettingsController", function($scope, $http){
  $scope.loading = false;
  $scope.selected_season = $scope.account.SEASON;

  $scope.updateSeason = function(){
    $scope.loading = true;
    var the_scope = $scope;

    $http.post("php/change_season.php", {'newseason': $scope.selected_season, "currentuser": $scope.account.USERNAME}).then(function success(res){
      // when we get data back
      the_scope.loading = false;
      if (res.data.result){
        the_scope.account.SEASON = the_scope.selected_season;
        the_scope.postInfoMessage("You've successfully updated your season to season " + the_scope.selected_season);
      } else if (res.data.spoiler){
          the_scope.postSpoilerMessage(res.data.spoiler);
      } else if (res.data.error){
        the_scope.postErrorMessage(res.data.error);
      } else {
          the_scope.postErrorMessage("An unknown error was encountered when running this query");
          console.log(res);
      }
    }, function error(res){
      the_scope.loading = false;
      the_scope.postErrorMessage("There was an exception", res.message);
      console.log(res);
    });
  };
});

app.controller("AdminLoginController", function($scope, $http){

  $scope.submit_login_form = function () {
    var the_scope = $scope;
    $scope.loading = true;
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
      the_scope.postErrorMessage("There was an exception", res.message);
      console.log(res);
    });
  }

});


var group="";
var selectedAttribute=[false,false,false,false,false,false,false];
app.controller("SelectController", function($scope,$http,$page){
   $scope.show_result = false;
   $scope.show_loading = false;
   $scope.submit_form = function() {
        $scope.show_loading = true; // show loading div
        $scope.show_result = false; // make sure result table is hidden
      if($scope.group !="Arryn"
          && $scope.group != "Baelish"
          && $scope.group != "Baratheon"
          && $scope.group != "Greyjoy"
          && $scope.group != "Lannister"
          && $scope.group != "Nights Watch"
          && $scope.group != "Stark"
          && $scope.group != "Tully"
          && $scope.group != "Tyrell"){
          $scope.postErrorMessage("Please select a group!");
      }
      else{
        if($scope.attribute.value1 =="YES"){
          selectedAttribute[0] = true;
        }
        if($scope.attribute.value2=="YES"){
          selectedAttribute[1] = true;
        }
        if($scope.attribute.value3=="YES"){
          selectedAttribute[2] = true;
        }
        if($scope.attribute.value4=="YES"){
          selectedAttribute[3] = true;
        }
        if($scope.attribute.value5=="YES"){
          selectedAttribute[4] = true;
        }
        if($scope.attribute.value6=="YES"){
          selectedAttribute[5] = true;
        }
        if($scope.attribute.value7=="YES"){
          selectedAttribute[6] = true;
        }
        if(nothingSelected()){
          $scope.postErrorMessage("Please select at least one attribute");
        }
        else{
          //Selection is ok
          group=$scope.group;

          $http.post("php/select_project_q.php", {'selectedGroup': group}).then(function success(res){

            if (res.data.result){
              $scope.show_loading = false; // hide loading div
              $scope.show_result = true; // show result table
              $scope.table=mapResultToTable(res.data.result);
              selectedAttribute=[false,false,false,false,false,false,false];
              group="";
              // $scope.result = res.data.result; // populate result table
            } else if (res.data.spoiler){
                the_scope.postSpoilerMessage(res.data.spoiler);
            } else if (res.data.error){
              the_scope.postErrorMessage(res.data.error);

            } else {
              the_scope.postErrorMessage("An unknown error was encountered when running this query", res.data);
            }

          }, function error(res){
           //Reinitialize variables
            selectedAttribute=[false,false,false,false,false,false,false];
            group="";
            the_scope.show_loading = false;
            the_scope.postErrorMessage("There was an exception", res.message);
            console.log(res);

          });

        }

      }
   };
});

function nothingSelected(){
  for(var b of selectedAttribute){
    if(b){
      return false;
    }
  }
  return true;
}
function mapResultToTable(r){
    if (r.length == 0) {
      return {header: [], rows: []};
    }
    var allHeaders = Object.keys(r[0]);
    var headers =[];
    for(var i=0 ; i<allHeaders.length; i++){
      if(selectedAttribute[i]){
        headers.push(allHeaders[i]);
      }
    }
    var rows = [];
    for (var v of r){
      var row = []
      for (var i = 0; i< allHeaders.length; i++){
            if(selectedAttribute[i]){
                if(v[allHeaders[i]]==null){
                  row.push("Unknown");
                }
                else{
                  row.push(v[allHeaders[i]]);
                }

            }
      }
      rows.push(row);
    }
    return {header: headers, entries: rows};

}

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
  $page.setTitle("Owner of place"); // Set title

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
    $http.post("php/owner_of_place.php", {'character': $scope.character}).then(function success(res){
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
  $page.setTitle("Age of death"); // Set title

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

app.controller("FirstAppearanceController", function($scope, $http, $page){
  $page.setTitle("First appearance"); // Set title

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
  $page.setTitle("Gender death"); // Set title

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
  $page.setTitle("Killed young"); // Set title

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
  $page.setTitle("Made Orphan"); // Set title

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
  $page.setTitle("Most Episode"); // Set title

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
  $page.setTitle("Most killed"); // Set title

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
  $page.setTitle("Newest Character"); // Set title

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
    $http.post("php/newest_characters.php", {'character': $scope.character}).then(function success(res){
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
  $page.setTitle("Youngest child"); // Set title

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
