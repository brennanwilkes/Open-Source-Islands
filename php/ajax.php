<?php

	//Create connection
	require "connection.php";
	$pdo = db_connect();

	if(isset($_POST["id"]) && isset($_POST["request"])){

		//This is required to avoid PDO auto-quoting. I know its ugly but c'est la vie
		$attrs = array("seed", "name", "colour_background", "deep_ocean", "shallow_ocean", "land_one", "land_two", "land_three", "beach", "rock_one", "rock_two", "lava_one", "lava_two", "sunset", "has_motu", "has_reef", "is_volcano", "is_atoll", "has_town", "has_trees", "tree_amt", "village_size", "isl_persist", "isl_lac", "isl_scale");

		$req = NULL;
		for ($i = 0; $i < count($attrs); $i++){

			//Pick selected attribute
			if($attrs[$i]==$_POST["request"]){
				$req = $attrs[$i];
			}
		}

		//If requested attribute is not in list, exit immediately.
		//This can't be done via a prepared statement because of auto-quoting errors
		if(is_null($req)){
			die("ERROR");
		}
		else{

			//Get requested attribute from database
			$sql = $pdo->prepare("SELECT ".$req." FROM islands WHERE id=:idParam");
			$sql->bindValue(":idParam", (int)$_POST["id"],PDO::PARAM_INT);
			$sql->execute();
			$res = $sql->fetch(PDO::FETCH_ASSOC);

			//Return it
			echo $res[$_POST["request"]];
		}
	}
	else{
		die("ERROR");
	}

?>
