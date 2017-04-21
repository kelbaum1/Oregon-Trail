<?php

	$q = $_GET['arg'];
	$date = $_GET['dod'];
	$name = $_GET['name'];
	$mile = $_GET['mile'];
	$msg = $_GET['msg'];
	
	$username = $_GET['usr'];
	$points = $_GET['points'];
	$rating = $_GET['rating'];

	function connect($db)
	{
		$conn = @mysql_connect("studentdb-maria.gl.umbc.edu", "mansha1", "mansha1") or die("Could not connect to MySQL");
		$rs = @mysql_select_db($db, $conn) or die("Could not connect select $db database");
		return $conn;
	}
	
	function executeQuery($sql, $conn) {
		$result = mysql_query($sql, $conn);
		if ($error = mysql_error()) die('Error, query failed with:' . $error);
		return $result;
	}
	
	function parseResult($result, $start_index) {
		while($row = mysql_fetch_row($result)) {
			for($i = $start_index; $i < count($row); $i++) {
				echo $row[$i] . "&emsp;&emsp;";
			}
			echo "<br>";
		}
	}
	
	if(empty($connection)) {
		$connection = connect("mansha1");
	}

	if($q == "getTopScores") {
		$sql = "SELECT * FROM high_score ORDER BY points DESC LIMIT 10";
		$result = executeQuery($sql, $connection);
		parseResult($result, 1);
	}
	if($q == "getTombstones") {
		$sql = "SELECT * FROM tombstones ORDER BY mile";
		$result = executeQuery($sql, $connection);
		parseResult($result, 2);
	}
	if($q == "insertTombstone") {
		$sql = "INSERT INTO tombstones (DOD, name, mile, message) VALUES (" + $date + ", '" + $name + "', " + $mile + ", '" + $msg + "')";
		$result = executeQuery($sql, $connection);
	}
	if($q == "insertScore") {
		$sql = "INSERT INTO high_score (username, points, rating) VALUES ('"+$username+"', "+$points+", '"+$rating+"')";
		$result = executeQuery($sql, $connection);
	}
?>