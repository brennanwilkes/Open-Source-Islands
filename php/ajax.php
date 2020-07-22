<?php
	require "connection.php";

	$pdo = db_connect();

	if(isset($_POST["id"]) && isset($_POST["request"])){


		//This is required to avoid PDO auto-quoting. I know its ugly but c'est la vie
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


		$res = $sql->fetch(PDO::FETCH_ASSOC);
		echo $res[$_POST["request"]];
	}
	else{
		echo die("ERROR");
	}

?>
