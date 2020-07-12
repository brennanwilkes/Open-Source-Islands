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


		$sql = "DESCRIBE islands";
		$result = $pdo->query($sql);
		while ($row = $result->fetch()){
			echo "<span>".$row[0]."</span>";
		}

		echo "<img src=concept-art/Aru.png><img src=concept-art/Atalia-Nanai.png><img src=concept-art/Hokulele-Kekoa.png><img src=concept-art/Kainano-Taualai.png><img src=concept-art/Murihau.png>";
	}

	function handle_submit(){
		global $pdo;

		//setup sql statement
		/*
		$sql = "INSERT INTO islands () VALUES (:) ";
		$statement = $pdo->prepare($sql);

		//bind values
		$statement->bindValue(':dateVAL', date('Y-m-d'));
		$statement->bindValue(':moodVAL', $_POST['mood']);
		$statement->bindValue(':emailVAL', $_POST['email']);
		$statement->bindValue(':commentTextVAL', $_POST['comment']);

		//execute
		$statement->execute();
		*/
	}

?>
