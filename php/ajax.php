<?php
	require "connection.php";

	$pdo = db_connect();

	if(isset($_POST["id"]) && isset($_POST["request"])){

		$sql = $pdo->prepare("SELECT :reqParam FROM islands WHERE id=:idParam");
		$sql->bindValue(":reqParam", $_POST["request"],PDO::PARAM_STR);
		$sql->bindValue(":idParam", $_POST["id"],PDO::PARAM_INT);
		$sql->execute();
		echo $sql->errorInfo();

		$res = $sql->fetch(PDO::FETCH_ASSOC);
		echo "name= ".$res[$_POST["request"]];
	}
	else{
		echo die("ERROR");
	}

?>
