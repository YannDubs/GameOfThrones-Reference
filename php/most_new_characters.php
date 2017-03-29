<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array

try {
  $table = $conn->query("SELECT name, first_appearance
						FROM CharacterGoT
						WHERE first_appearance= (SELECT query1.first_appearance
						FROM (SELECT first_appearance, Count(*) AS order_count
						      FROM CharacterGoT c
						      GROUP BY c.first_appearance) query1,
						     (SELECT max(query2.order_count) AS highest_count
						      FROM (SELECT first_appearance, Count(*) AS order_count
						            FROM CharacterGoT c
						            GROUP BY c.first_appearance) query2) query3
						WHERE query1.order_count = query3.highest_count)");

  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => $table]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>