<?php
	require_once("connection.php");

	$pdo = db_connect();



	if(isset($_POST["id"]) && isset($_POST["request"])){
		$id = $_POST["id"];
		$req = $_POST["mode"];

		$sql = "SELECT ? FROM islands WHERE id=?";
		$pdo->prepare($sql)->execute([$req,$id]);
		echo "suc"
	}
	else{
		die("ERROR"));
	}

?>
