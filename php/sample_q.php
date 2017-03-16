<?php

require_once('DBConnector.php'); // import DBConnector

header("Content-type:application/json"); // set file type to json!

$postdata = file_get_contents("php://input"); // get POST input (will be JSON from our UI)
$params = json_decode($postdata); // Decode the JSON into something PHP can handle

// TODO: sterilize the arguments

$conn = new DBConnector('304_db'); // Open a connection to the DB

// gets resulting query array
$table = $conn->query("SELECT * FROM `ChildOf` WHERE name_father NOT LIKE '$params->dad'");

// convert PHP array to JSON and output
echo json_encode($table);

?>
