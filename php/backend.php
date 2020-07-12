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
		echo "<img src=concept-art/Aru.png><img src=concept-art/Atalia-Nanai.png><img src=concept-art/Hokulele-Kekoa.png><img src=concept-art/Kainano-Taualai.png><img src=concept-art/Murihau.png><img src=concept-art/Rangi-Karauna.png><img src=concept-art/Tamah-Talatonu.png><img src=concept-art/Tama-Ropata.png><img src=concept-art/Aru.png><img src=concept-art/Atalia-Nanai.png><img src=concept-art/Hokulele-Kekoa.png><img src=concept-art/Kainano-Taualai.png><img src=concept-art/Murihau.png><img src=concept-art/Rangi-Karauna.png><img src=concept-art/Tamah-Talatonu.png><img src=concept-art/Tama-Ropata.png><img src=concept-art/Aru.png><img src=concept-art/Atalia-Nanai.png><img src=concept-art/Hokulele-Kekoa.png><img src=concept-art/Kainano-Taualai.png><img src=concept-art/Murihau.png><img src=concept-art/Rangi-Karauna.png><img src=concept-art/Tamah-Talatonu.png><img src=concept-art/Tama-Ropata.png>";
	}

?>
