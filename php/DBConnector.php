<?php
ini_set('display_errors', 1); // Enable error logging

class DBConnector {
	private $conn;

	public function __construct($db, $host = 'localhost', $port = 3306, $user = 'root', $pass = 'root') {
		$this->conn = new mysqli($host, $user, $pass, $db, $port);
	}


	public function query($q) {
		// escape checking here to prevent injections
		$res = $this->conn->query($q);

    // TODO: Turn result into array...

    $table = [];

    while ($row = $res->fetch_assoc()) {

      $table[] = $row;

    }

    $res->free_result();

    return $table;

	}

	public function __destruct() {
		$this->conn->close();
	}

}

?>
