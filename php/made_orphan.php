<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array

try {
  $table = $conn->query("SELECT DISTINCT character.name_killer AS killer, child.name AS child ".
						"FROM ChildrenGot child, CharacterGoT character ".
						"WHERE character.name IN (child.name_father, child.name_mother) AND character.name_killer IS NOT NULL AND character.killed_in_season < ( ".
						"SELECT season FROM UsersGoT WHERE username = :userN ".
						")" , ['userN' => 'guest']); 

  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => $table]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>
