<?php

ini_set('display_errors', 1); // Enable error logging

require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array

try {
  $table = $conn->query("SELECT name
						FROM GroupGot g
						WHERE NOT EXISTS (
						(SELECT c.name FROM CharacterGoT c WHERE c.name_group = g.name)
						MINUS
						(SELECT name FROM CharacterGoT WHERE name_killer IS NOT NULL))");

  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => $table]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>