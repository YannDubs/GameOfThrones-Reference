<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array

try {

  $scpt = file_get_contents("../sql/gameOfThrones.sql");

  $scpt = preg_replace('/\/\*.*?\*\//s', '', $scpt);
  $scpt = preg_replace('/^---.*$/m', '', $scpt);

  $conn->send($scpt);

  $table = [];
  // //$table = $conn->query("SELECT username, isModerator, season ".
	// 					"FROM UsersGoT ".
	// 					"WHERE username = :userN AND password = :passW");

  // A new user can create an account

  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => []]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>
