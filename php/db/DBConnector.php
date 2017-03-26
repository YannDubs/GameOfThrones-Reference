<?php
ini_set('display_errors', 1); // Enable error logging

require_once('exception/SpoilerException.php');
require_once('exception/FailureException.php');

class DBConnector {
	private $conn;

  // new DBConnector - constructor for DB connection
	public function __construct() {
		$db = "(DESCRIPTION=(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = dbhost.ugrad.cs.ubc.ca)(PORT = 1522)))(CONNECT_DATA=(SID=ug)))";
		if (!$this->conn=oci_connect("ora_d1u0b", "a70387162", $db)){
			$err = oci_error();
		  throw new FailureException ( "Oracle Connect Error" . $err['message'] );
		}
	}

  // $conn->query("SELECT ....") = [] - parses a query
	public function query($query, $defaults = []) {

		preg_match_all("/:\w+/", $query, $keys); // get list of placeholders (pattern)

    $keys = array_map(function($v) { // transform to keys
      return substr($v, 1);
    }, $keys[0]);

    $doesntexist = array_diff(array_keys($defaults), $keys); // extranious defaults

    if (count($doesntexist)){
      throw new FailureException("Extra defaults ( ". implode(", ", $doesntexist) ." ) not defined in query \"". $query ."\"");
    }

    $postdata = file_get_contents("php://input"); // get POST input (will be JSON from our UI)
    $params = json_decode($postdata, true); // Decode the JSON into something PHP can handle

		if (is_array($params)){
			$need_defaults = array_diff_key($defaults, $params); // see if we can insert any supplied defaults

	    $params = array_merge($params, $need_defaults);

	    $missing = array_diff($keys, array_keys($params));

	    if (count($missing)){
				throw new FailureException("Missing values for ( ". implode(", ", $missing) ." ) in query \"". $query ."\"");
	    }

			$stmt = oci_parse($this->conn, $query);

			foreach($params as $k=>$v){
				oci_bind_by_name($stmt, ":".$k, $params[$k]);
			}

			oci_execute($stmt);

			$ret = [];

			while (($row = oci_fetch_array($stmt, OCI_ASSOC + OCI_RETURN_NULLS)) != false) {
				var_dump($row);
    		$ret[] = $row;
			}

			oci_free_statement($stmt);

			return $ret;

		} else {
			throw new FailureException("POST-ed JSON data could not be parsed");
		}
	}


  // this automatically frees the connection. You do not need to call explicitly
	public function __destruct() {
		oci_close($this->conn);
	}

}

?>
