<?php
	if(isset($_POST["id"]) && isset($_POST["request"])){
		$id = $_POST["id"];
		$req = $_POST["mode"];

		$sql = "SELECT :req FROM islands WHERE id=:id";

		$reponse = $pdo->query($sql);
		$reponse->bindParam(':req', $req, PDO::PARAM_STR);
		$reponse->bindParam(':id', $id, PDO::PARAM_STR);
		$reponse->execute();
		$result = $reponse->fetchAll(); //make the select
		echo $result;





	}
	else{
		die(json_encode(array("message"=>"ERROR","code"=>422)));
	}

?>
