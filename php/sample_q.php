<?php

require_once('DBConnector.php'); // import DBConnector

header("Content-type:application/json"); // set file type to json!

$postdata = file_get_contents("php://input");
$params = json_decode($postdata);

// sterilize the arguments

$conn = new DBConnector('304_db');

$table = $conn->query("SELECT * FROM `ChildOf` WHERE name_father NOT LIKE '$params->dad'");


echo json_encode($table);

?>
