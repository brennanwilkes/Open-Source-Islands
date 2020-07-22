<?php
	require "connection.php";

	$pdo = db_connect();



	if(isset($_POST["id"]) && isset($_POST["request"])){

		$sql = $pdo->prepare("SELECT name FROM islands WHERE id=1");
		//$sql->bindParam(":reqParam", $_POST["request"], PDO::PARAM_STR);
		//$sql->bindParam(":idParam", $_POST["id"], PDO::PARAM_STR);
		$sql->execute();


		$res = $sql->fetch(PDO::FETCH_ASSOC);
		echo "name= ".$res[$_POST["request"]];
	}
	else{
		echo 'no';//die("ERROR"));
	}

?>
