<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array

try {
  $table = $conn->query("SELECT query1.gender AS gender, query1.deathCount / query2.totalCount AS average_death
						FROM
						(SELECT gender, COUNT(*) AS deathCount
						FROM CharacterGoT
						WHERE killed_in_season IS NOT NULL
						GROUP BY gender) query1,
						(SELECT gender, COUNT(*) AS totalCount
						FROM CharacterGoT
						GROUP BY gender) query2
						WHERE query1.gender = query2.gender");

  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => $table]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>
