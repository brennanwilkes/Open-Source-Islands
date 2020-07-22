<?php
	if(isset($_POST["id"]) && isset($_POST["mode"])){
		$idreq = $_POST["id"];
		$md = $_POST["mode"];

	}
	else{
		die(json_encode(array("message"=>"ERROR","code"=>422)));
	}

?>
