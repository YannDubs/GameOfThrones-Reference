<?php

require_once('DBConnector.php'); // import DBConnector

header("Content-type:application/json"); // set file type to json!

// $dad = $_GET['dad']; // get argument from url

$postdata = file_get_contents("php://input");
$params = json_decode($postdata);

// var_dump($params);

// sterilize the arguments

$conn = new DBConnector('304_db');

$table = $conn->query("SELECT * FROM `ChildOf` WHERE name_father NOT LIKE '$params->dad'");

sleep(5);

echo json_encode($table);

?>
