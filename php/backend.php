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
		echo "<img src=concept-art/Aru.png>";
	}

?>
