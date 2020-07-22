<?php
	require "connection.php";

	$pdo = db_connect();

	if(isset($_POST["id"]) && isset($_POST["request"])){

		switch ($_POST["request"]) {
			case "name":
				$req = "name";
				break;
			case "seed":
				$req = "seed";
				break;
			}



		$sql = $pdo->prepare("SELECT ".$req." FROM islands WHERE id=:idParam");
		$sql->bindValue(":idParam", (int)$_POST["id"],PDO::PARAM_INT);
		$sql->execute();

		echo $sql->errorInfo()[0];
		echo $sql->debugDumpParams();


		$res = $sql->fetch(PDO::FETCH_ASSOC);
		echo "name= ".$res[$_POST["request"]];
	}
	else{
		echo die("ERROR");
	}

?>
