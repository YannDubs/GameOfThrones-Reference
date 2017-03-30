<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array

try {
  $table = $conn->query("SELECT characterParent.name AS parent,characterChild.name AS child, characterChild.year_of_birth - characterParent.year_of_birth AS difference
						FROM ChildrenGot child, CharacterGoT characterParent, CharacterGoT characterChild
						WHERE characterParent.name IN (child.name_father, child.name_mother) AND characterChild.name = child.name AND ( characterChild.year_of_birth - characterParent.year_of_birth ) = (
						SELECT  MIN(characterChild.year_of_birth - characterParent.year_of_birth) AS min
						FROM ChildrenGot child, CharacterGoT characterParent, CharacterGoT characterChild
						WHERE characterParent.name IN (child.name_father, child.name_mother) AND characterChild.name = child.name
						)");
  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => $table]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>
