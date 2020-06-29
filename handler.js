
function setValidMessage(id,message){
	let element = $("#"+id);
	element.attr("oninvalid","this.setCustomValidity('"+message+"')");
	element.attr("onchange","try{setCustomValidity('')}catch(e){}");
	element.attr("oninput","setCustomValidity(' ')");
}

$(document).ready(function(){
	setValidMessage("name","Island names may only contain letters, spaces hyphens, and apostrophes")
	setValidMessage("seed","Island Seeds may only contain digits");



});
