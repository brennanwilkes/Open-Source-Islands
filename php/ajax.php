<?php
	require_once("connection.php");

	$pdo = db_connect();



	if(isset($_POST["id"]) && isset($_POST["request"])){
		$query = $pdo->query("SELECT :req FROM islands WHERE id=:id");
		$query->bindParam(":req", $_POST["id"], PDO::PARAM_STR); //assuming it is a string
		$query->bindParam(":id", $_POST["request"], PDO::PARAM_STR); //assuming it is a string
		$query->execute();
		$result = $query->fetchAll(); //make the select

		echo "did it work"
	}
	else{
		die("ERROR"));
	}

?>
