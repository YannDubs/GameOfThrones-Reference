<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array

try {
  $table = $conn->query("SELECT name,year_of_birth,gender,job,first_appearance,name_killer,killed_in_season 
  						FROM CharacterGoT
  						WHERE name_group = :group");

  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => $table]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>