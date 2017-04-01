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
    .when("/group_infos", {
        templateUrl: "views/select_project.html",
        controller: "GroupInfosController",
        url: ""
    })
    .when("/dead_character", {
        templateUrl: "views/dead_character.html",
        controller: "DeadCharacterController",
        url: ""
    })
    .when("/group_leader", {
        templateUrl: "views/leader_of_group.html",
        controller: "GroupLeaderController",
        url: ""
    })
    .when("/place_owner", {
        templateUrl: "views/owner_of_place.html",
        controller: "PlaceOwnerController",
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
    .when("/gender_death_stats", {
        templateUrl: "views/gender_deaths.html",
        controller: "GenderDeathStatsController",
        url: ""
    })
    .when("/child_killers", {
        templateUrl: "views/child_killer.html",
        controller: "ChildKillersController",
        url: ""
    })
    .when("/orphan_makers", {
        templateUrl: "views/made_orphan.html",
        controller: "OrphanMakersController",
        url: ""
    })
    .when("/most_appearances", {
        templateUrl: "views/most_episodes.html",
        controller: "MostAppearancesController",
        url: ""
    })
    .when("/bloody_season", {
        templateUrl: "views/bloody_season.html",
        controller: "BloodySeasonController",
        url: ""
    })
    .when("/most_new_characters", {
        templateUrl: "views/most_new_characters.html",
        controller: "MostNewCharactersController",
        url: ""
    })
    .when("/young_parents", {
        templateUrl: "views/young_parents.html",
        controller: "YoungParentsController",
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


app.controller("GroupInfosController", function($scope,$http,$page){
  $page.setTitle("Goup infos"); // Set title
   $scope.show_result = false;
   $scope.show_loading = false;
   $scope.selectedAttribute = [];

   $scope.mapResultToTable = function(r){
    if (r.length == 0) {
      return {header: [], rows: []};
    }
    var allHeaders = Object.keys(r[0]);
    var headers =[];
    for(var i=0 ; i<allHeaders.length; i++){
      if($scope.selectedAttribute[i]){
        headers.push(allHeaders[i]);
      }
    }
    var rows = [];
    for (var v of r){
      var row = []
      for (var i = 0; i< allHeaders.length; i++){
            if($scope.selectedAttribute[i]){
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

   $scope.nothingSelected = function(){
    for(var b of $scope.selectedAttribute){
      if(b){
        return false;
      }
    }
    return true;
  }


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
        if($scope.nothingSelected()){
          $scope.postErrorMessage("Please select at least one attribute");
        }
        else{
          //Selection is ok
          var group=$scope.group;

          var the_scope = $scope;

          $http.post("php/select_project_q.php", {'selectedGroup': group}).then(function success(res){

            if (res.data.result){
              the_scope.show_loading = false; // hide loading div
              the_scope.show_result = true; // show result table

              the_scope.table= the_scope.mapResultToTable(res.data.result);

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

      }
   };
});



app.controller("ContentController", function($scope){

  console.log($scope);

  $scope.alerts = [];
  $scope.account = undefined;

  $scope.SQLPrettify = function(q) { // takes a query and turns it into an array that angular will like;
    var keywords = ["SELECT", "FROM", "WHERE", "HAVING", "AND", "OR"];
    var q_parts = [];

    var indent = 0;
    var s = 0;
    for (var i = 0; i<q.length; i++){
      var c = q.charAt(i);
      if (c === "("){
        i++;
        q_parts.push({str: q.slice(s,i), indent: indent});
        indent++;
        s = i;
      }else if (c === ")"){
        q_parts.push({str: q.slice(s,i), indent: indent});
        indent--;
        s = i;
      }
    }

    q_parts.push({str: q.slice(s,i), indent: indent});

    for (var keyword of keywords) {

      q_parts = q_parts.reduce(function(acc,cur){
        var i = 1;
        var idx = [0];

        var v;
        while ((v = cur.str.indexOf(keyword, i)) > 0) {
          idx.push(v);
          i = v + 1;
        }

        idx.push(cur.str.length);

        for (var s = 0; s < idx.length - 1; s++){
          var c = cur.str.slice(idx[s], idx[s+1]).trim();
          if (c.length > 0)
            acc.push({str: c, indent: cur.indent})
        }

        return acc;

      }, []);

    }
    console.log(q_parts);
    return q_parts;
  };

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



app.controller("DeadCharacterController", function($scope, $http, $page){
  $page.setTitle("Dead Character"); // Set title

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

    $http.post("php/dead_character.php", {'character': $scope.character}).then(function success(res){
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

app.controller("GroupLeaderController", function($scope, $http, $page){
  $page.setTitle("Group Leader"); // Set title

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

app.controller("PlaceOwnerController", function($scope, $http, $page){
  $page.setTitle("Place Owner"); // Set title

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
  $scope.queries = "SELECT  s.approx_year - c.year_of_birth AS age " +
            "FROM CharacterGoT c, SeasonGot s " +
            "WHERE c.name = :character AND s.num = c.killed_in_season AND c.killed_in_season < ( " +
            "SELECT season FROM UsersGoT WHERE username = 'prof')";

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

app.controller("GenderDeathStatsController", function($scope, $http, $page){
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
    $http.post("php/gender_deaths.php", {}).then(function success(res){
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

app.controller("ChildKillersController", function($scope, $http, $page){
  $page.setTitle("Child killer"); // Set title

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
      
    if(isNaN($scope.age)){
      $scope.postErrorMessage("Please enter a Number !");
      return;
    }
    else if($scope.age % 1 != 0){
      $scope.postErrorMessage("Please enter an integer");
      return;
    }
    else if($scope.age < 0){
      $scope.postErrorMessage("Please enter a positive integer");
      return;
    }
    $scope.show_loading = true; // show loading div
    $scope.show_result = false; // make sure result table is hidden

    var the_scope = $scope;

    // send request to server
    $http.post("php/child_killer.php", {'age': $scope.age}).then(function success(res){
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

app.controller("OrphanMakersController", function($scope, $http, $page){
  $page.setTitle("Orphan maker"); // Set title

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
    $http.post("php/made_orphan.php", {}).then(function success(res){
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

app.controller("MostAppearancesController", function($scope, $http, $page){
  $page.setTitle("Most Appearances"); // Set title

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
    $http.post("php/most_episodes.php", {}).then(function success(res){
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

function mostKilledJsonProcessing(r){
    if (r.length == 0) {
      return {seasons: [], names: []};
    }
    var distinctSeasons=[];
    var headers = Object.keys(r[0]);
    for (var v of r){
      var season=v[headers[1]];
      if(!contains(distinctSeasons,season)){
        distinctSeasons.push(season);
      }
    }
    var namesAssociated=[];
    for(var i=0;i<distinctSeasons.length;i++){
      namesAssociated[i]=[];
    }
    for (var v of r){
      var season=v[headers[1]];
      namesAssociated[getIndex(distinctSeasons,season)].push(v[headers[0]]);
    }
    alert(namesAssociated[0]);
    alert(namesAssociated[1]);
    alert(distinctSeasons);
    return {seasons: distinctSeasons, names: namesAssociated};
}
function getIndex(array,element){
  for(var i=0; i< array.length;i++){
    alert
    if(array[i]==element){
      return i;
    }
  }
  return -1;
}
function contains(array,element){
  for(var e of array){
    if(e==element){
      return true;
    }
  }
  return false;
}
//
// app.controller("MostKilledController", function($scope, $http, $page){
//   $page.setTitle("Most killed"); // Set title

app.controller("BloodySeasonController", function($scope, $http, $page){
  $page.setTitle("Bloody season"); // Set title

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
    $http.post("php/bloody_season.php", {}).then(function success(res){
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
  $page.setTitle("Most new Characters"); // Set title

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
    //Delete content in {} if no objects needed
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

app.controller("YoungParentsController", function($scope, $http, $page){
  $page.setTitle("Young parents"); // Set title

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
    $http.post("php/young_parents.php", {}).then(function success(res){
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
