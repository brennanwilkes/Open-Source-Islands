<?php
	require "connection.php";

	$pdo = db_connect();



	if(isset($_POST["id"]) && isset($_POST["request"])){

		$sql = $pdo->prepare("SELECT name FROM islands WHERE id=1");
		//$sql->bindValue(":reqParam", $_POST["request"]);
		//$sql->bindValue(":idParam", $_POST["id"],PDO::PARAM_INT);
		$sql->execute();


		$res = $sql->fetch(PDO::FETCH_ASSOC);
		echo "name= ".$res[$_POST["request"]];
	}
	else{
		echo 'no';//die("ERROR"));
	}

?>
