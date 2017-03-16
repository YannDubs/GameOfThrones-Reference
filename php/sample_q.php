<?php

require_once('DBConnector.php');

header("Content-type:application/json");

$conn = new DBConnector('304_db');

$table = $conn->query("SELECT * FROM `ChildOf`");

echo json_encode($table);

?>
