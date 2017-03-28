<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array

try {
  $table = $conn->query("SELECT l.name AS name, l.aspires_to_throne AS aspires_to_throne
						FROM LeaderGot l, PlaceGot p, CharacterGoT c
						WHERE c.name = 'Sansa Stark' AND p.name = c.place_of_living  AND l.name_group = p.name_group AND  l.since_season = ( 
						SELECT max(l.since_season )
						FROM LeaderGot l, PlaceGot p, CharacterGoT c
						WHERE c.name = 'Sansa Stark' AND p.name = c.place_of_living  AND l.name_group = p.name_group AND since_season < (
						SELECT season FROM UsersGoT WHERE username = 'prof'
						)
						)");
  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => $table]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>