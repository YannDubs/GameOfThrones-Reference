<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

try {
  $table = $conn->query("SELECT COUNT(c.killed_in_season) AS KILLED,  LISTAGG(c.name, ', ') WITHIN GROUP (ORDER BY c.name) AS NAMES,  s.num AS SEASON  
  						FROM CHARACTERGOT c RIGHT JOIN SEASONGOT s ON c.killed_in_season = s.num  
  						WHERE s.num < (SELECT season FROM usersgot WHERE username = 'lotus') 
  						 GROUP BY s.num");

  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => $table]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>
