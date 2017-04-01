<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array

try {

  $conn->send("DELETE FROM SeasonGoT WHERE num = 4");

  $table = [];
  
  echo json_encode(["result" => []]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>
