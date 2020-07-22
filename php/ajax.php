<?php
	if(isset($_POST["id"]) && isset($_POST["request"])){
		$id = $_POST["id"];
		$req = $_POST["mode"];

		$sql = "SELECT ? FROM islands WHERE id=?";
		$pdo->prepare($sql)->execute([$req,$id]);
		echo $pdo->fetch();
	}
	else{
		die(json_encode(array("message"=>"ERROR","code"=>422)));
	}

?>
