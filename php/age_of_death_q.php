<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array

try {
  $table = $conn->query("SELECT  s.approx_year - c.year_of_birth AS age
						FROM CharacterGoT c, SeasonGot s
						WHERE c.name = :character AND s.num = c.killed_in_season AND c.killed_in_season < (
						SELECT season FROM UsersGoT WHERE username = 'prof'
						)" );

  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => $table]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>