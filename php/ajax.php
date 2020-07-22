<?php
	require "connection.php";

	//$pdo = db_connect();



	if(isset($_POST["id"]) && isset($_POST["request"])){

		//$sql = $pdo->prepare("SELECT :reqParam FROM islands WHERE id=:idParam");
		//$sql->bindParam(":reqParam", $_POST["request"], PDO::PARAM_STR);
		//$sql->bindParam(":idParam", $_POST["id"], PDO::PARAM_STR);
		//$sql->execute();


		echo "did it work";
	}
	else{
		die("ERROR"));
	}

?>
