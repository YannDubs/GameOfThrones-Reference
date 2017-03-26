<?php
ini_set('display_errors', 1); // Enable error logging
//include ('OCI.inc');
class DBConnector {
	private $conn;

  // new DBConnector - constructor for DB connection
	public function __construct($db, $host = 'localhost', $port = 3306, $user = 'root', $pass = 'root') {
		$db = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = dbhost.ugrad.cs.ubc.ca)(PORT = 1522)))(CONNECT_DATA=(SID=ug)))";
		if ($c=oci_connect("ora_d1u0b", "a70387162", $db)) {
		echo "Successfully connected to Oracle.\n";
		          //OCILogoff($c);
		} else {
		//$err = OCIError();
		  echo "Oracle Connect Error " ;//. $err['message'];
		}


	}



  // TODO: have a spoiler and error handler

  // $conn->query("SELECT ....") = [] - parses a query
	public function query($q) {
		// escape checking here to prevent injections
		$res = $this->conn->query($q);

    $table = [];

    while ($row = $res->fetch_assoc()) {

      $table[] = $row;

    }

    $res->free_result();

    return $table;

	}

  // this automatically frees the connection. You do not need to call explicitly
	public function __destruct() {
		$this->conn->close();
	}

}

?>
