<?php

ini_set('display_errors', 1); // Enable error logging


require_once('db/DBConnector.php'); // import DBConnector
require_once('exception/ExceptionAsJSON.php');
require_once('exception/FailureException.php');


header("Content-type:application/json"); // set file type to json!

$conn = new DBConnector(); // Open a connection to the DB

// gets resulting query array
SELECT COUNT(*) "KILLED",
  LISTAGG(name, ', ') WITHIN GROUP (ORDER BY NAME) "NAMES",
  num "SEASON"
  FROM CHARACTERGOT c RIGHT JOIN SEASONGOT s ON c.killed_in_season = s.num
  WHERE killed_in_season < (SELECT season FROM usersgot WHERE username = 'lotus')
  GROUP BY killed_in_season
  ORDER BY KILLED;
try {
  $table = $conn->query("SELECT killed_in_season
						FROM CharacterGoT
						WHERE killed_in_season IN (SELECT query1.killed_in_season
						FROM (SELECT killed_in_season, Count(*) AS order_count
						      FROM CharacterGoT c
							WHERE c.killed_in_season IS NOT NULL AND c.killed_in_season <  (
								SELECT season FROM UsersGoT WHERE username = 'lotus'
								)
						      GROUP BY c.killed_in_season
						      ) query1,
						     (SELECT max(query2.order_count) AS highest_count
						      FROM (SELECT killed_in_season, Count(*) AS order_count
						            FROM CharacterGoT c
							    WHERE c.killed_in_season IS NOT NULL AND c.killed_in_season <  (
								SELECT season FROM UsersGoT WHERE username = 'lotus'
								)
						            GROUP BY c.killed_in_season) query2) query3
						WHERE query1.order_count = query3.highest_count)");

  // $table = $conn->query("SELECT table_name FROM user_tables");

  // convert PHP array to JSON and output
  echo json_encode(["result" => $table]);

} catch (ExceptionAsJSON $e){
  echo $e->toJSON();
}

?>
