var a;
$(document).ready(function(){
	$("#name").attr("oninvalid","this.setCustomValidity('Island names may only contain letters')");
	$("#seed").attr("oninvalid","this.setCustomValidity('Island Seeds may only contain digits')");
});
