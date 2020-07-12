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


		$sql = "SELECT filename FROM islands ORDER BY submission_date";
		$result = $pdo->query($sql);
		while ($row = $result->fetch()){
			echo "<img src=".file_get_contents($row[0], FILE_USE_INCLUDE_PATH)."></img>";
		}

		//echo "<img src=concept-art/Aru.png><img src=concept-art/Atalia-Nanai.png><img src=concept-art/Hokulele-Kekoa.png><img src=concept-art/Kainano-Taualai.png><img src=concept-art/Murihau.png>";
	}

	function handle_submit(){
		global $pdo;

		//setup sql statement


		$sql = "INSERT INTO islands (seed, name, colour_background, deep_ocean, shallow_ocean, land_one, land_two, land_three, beach, rock_one, rock_two, lava_one, lava_two, sunset, has_motu, has_reef, is_volcano, is_atoll, has_town, has_trees, tree_amt, isl_persist, isl_lac, isl_scale, submission_date, filename) VALUES (:seedVAL, :nameVAL, :colour_backgroundVAL, :deep_oceanVAL, :shallow_oceanVAL, :land_oneVAL, :land_twoVAL, :land_threeVAL, :beachVAL, :rock_oneVAL, :rock_twoVAL, :lava_oneVAL, :lava_twoVAL, :sunsetVAL, :has_motuVAL, :has_reefVAL, :is_volcanoVAL, :is_atollVAL, :has_townVAL, :has_treesVAL, :tree_amtVAL, :isl_persistVAL, :isl_lacVAL, :isl_scaleVAL, :submission_dateVAL, :filenameVAL) ";
		$statement = $pdo->prepare($sql);

		//bind values
		$statement->bindValue(":seedVAL",$_POST["seed"]);
		$statement->bindValue(":nameVAL",$_POST["name"]);
		$statement->bindValue(":colour_backgroundVAL",isset($_POST["background"]) ? 1 : 0);
		$statement->bindValue(":deep_oceanVAL",$_POST["ocean"]);
		$statement->bindValue(":shallow_oceanVAL",$_POST["shallows"]);
		$statement->bindValue(":land_oneVAL",$_POST["ground1"]);
		$statement->bindValue(":land_twoVAL",$_POST["ground2"]);
		$statement->bindValue(":land_threeVAL",$_POST["ground3"]);
		$statement->bindValue(":beachVAL",$_POST["beach"]);
		$statement->bindValue(":rock_oneVAL",$_POST["rock1"]);
		$statement->bindValue(":rock_twoVAL",$_POST["rock2"]);
		$statement->bindValue(":lava_oneVAL",$_POST["lava1"]);
		$statement->bindValue(":lava_twoVAL",$_POST["lava2"]);
		$statement->bindValue(":sunsetVAL",$_POST["time"]);
		$statement->bindValue(":has_motuVAL",isset($_POST["motu"]) ? 1 : 0);
		$statement->bindValue(":has_reefVAL",isset($_POST["reef"]) ? 1 : 0);
		$statement->bindValue(":is_volcanoVAL",isset($_POST["volcano"]) ? 1 : 0);
		$statement->bindValue(":is_atollVAL",isset($_POST["atoll"]) ? 1 : 0);
		$statement->bindValue(":has_townVAL",isset($_POST["village"]) ? 1 : 0);
		$statement->bindValue(":has_treesVAL",isset($_POST["trees"]) ? 1 : 0);
		$statement->bindValue(":tree_amtVAL",$_POST["tree_amt"]);
		$statement->bindValue(":isl_persistVAL",$_POST["persistence"]);
		$statement->bindValue(":isl_lacVAL",$_POST["lacunarity"]);
		$statement->bindValue(":isl_scaleVAL",$_POST["scale"]);
		$statement->bindValue(":submission_dateVAL",date('Y-m-d'));
		$statement->bindValue(":filenameVAL","filler");

		//execute
		$statement->execute();

		$id = $pdo->lastInsertId();
		$fn = "gallery/".$id.".png";
		$sql = "UPDATE islands SET filename=? WHERE id=?";
		$pdo->prepare($sql)->execute([$fn, $id]);

		$myfile = fopen($fn, "w") or die("Unable to open file!");
		fwrite($myfile, $_POST["imageData"]);
		fclose($myfile);



		//echo "<div id=status>RAN</div>";


	}

?>
