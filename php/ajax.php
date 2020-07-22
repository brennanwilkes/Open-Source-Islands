<?php
	if(isset($_POST["id"], $_POST["mode"])){
		$idreq = $_POST["id"];
		$md = $_POST["mode"];
	}
	else{
		die({
			message: "ERROR",
			code: 422
		});
	}

?>
