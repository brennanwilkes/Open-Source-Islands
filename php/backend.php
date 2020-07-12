<?php
	require "access/config.php";

	function db_connect() {
		try {
			$pdo = new PDO("mysql:host=".constant("DBHOST").";dbname=".constant("DBNAME"),constant("DBUSER"),constant("DBPASS"));
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			return $pdo;
		}
		catch (PDOException $e)
		{
			die($e->getMessage());
		}
	}

	function get_images(){
		global $pdo;


		//$sql = "DESCRIBE islands";
		//$result = $pdo->query($sql);
		//while ($row = $result->fetch()){
		//	echo "<span>".$row[0]."</span>";
		//}

		echo "<img src=concept-art/Aru.png><img src=concept-art/Atalia-Nanai.png><img src=concept-art/Hokulele-Kekoa.png><img src=concept-art/Kainano-Taualai.png><img src=concept-art/Murihau.png>";
	}

	function handle_submit(){
		global $pdo;

		//setup sql statement
/*

		$sql = "INSERT INTO islands (seed, name, colour_background, deep_ocean, shallow_ocean, land_one, land_two, land_three, beach, rock_one, rock_two, lava_one, lava_two, village, sunset, has_motu, has_reef, is_volcano, has_town, has_trees, tree_amt, isl_persist, isl_lac, isl_scale, image_data, submission_date, filename) VALUES (:seedVAL, :nameVAL, :colour_backgroundVAL, :deep_oceanVAL, :shallow_oceanVAL, :land_oneVAL, :land_twoVAL, :land_threeVAL, :beachVAL, :rock_oneVAL, :rock_twoVAL, :lava_oneVAL, :lava_twoVAL, :villageVAL, :sunsetVAL, :has_motuVAL, :has_reefVAL, :is_volcanoVAL, :has_townVAL, :has_treesVAL, :tree_amtVAL, :isl_persistVAL, :isl_lacVAL, :isl_scaleVAL, :image_dataVAL, :submission_dateVAL, :filenameVAL) ";
		$statement = $pdo->prepare($sql);

		//bind values
		$statement->bindValue(":seedVAL",);
		$statement->bindValue(":nameVAL",);
		$statement->bindValue(":colour_backgroundVAL",);
		$statement->bindValue(":deep_oceanVAL",);
		$statement->bindValue(":shallow_oceanVAL",);
		$statement->bindValue(":land_oneVAL",);
		$statement->bindValue(":land_twoVAL",);
		$statement->bindValue(":land_threeVAL",);
		$statement->bindValue(":beachVAL",);
		$statement->bindValue(":rock_oneVAL",);
		$statement->bindValue(":rock_twoVAL",);
		$statement->bindValue(":lava_oneVAL",);
		$statement->bindValue(":lava_twoVAL",);
		$statement->bindValue(":villageVAL",);
		$statement->bindValue(":sunsetVAL",);
		$statement->bindValue(":has_motuVAL",);
		$statement->bindValue(":has_reefVAL",);
		$statement->bindValue(":is_volcanoVAL",);
		$statement->bindValue(":has_townVAL",);
		$statement->bindValue(":has_treesVAL",);
		$statement->bindValue(":tree_amtVAL",);
		$statement->bindValue(":isl_persistVAL",);
		$statement->bindValue(":isl_lacVAL",);
		$statement->bindValue(":isl_scaleVAL",);
		$statement->bindValue(":image_dataVAL",);
		$statement->bindValue(":submission_dateVAL",);
		$statement->bindValue(":filenameVAL",);

		$statement->bindValue(':dateVAL', date('Y-m-d'));
		$statement->bindValue(':moodVAL', $_POST['mood']);
		$statement->bindValue(':emailVAL', $_POST['email']);
		$statement->bindValue(':commentTextVAL', $_POST['comment']);

		//execute
		$statement->execute();
*/
	}

?>
