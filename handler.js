
function setValidMessage(id,message){
	let element = $("#"+id);
	element.attr("oninvalid","this.setCustomValidity('"+message+"')");
	element.attr("onchange","try{setCustomValidity('')}catch(e){}");
	element.attr("oninput","setCustomValidity(' ')");
}

let concept_art = [
	"Tangaroa-Ainalani-Wikolia.png",
	"Tangaroa-Atalia-Nanai.png",
	"Tangaroa-Hualani-Among.png",
	"Tangaroa-Kawene.png",
	"Tangaroa-Laumidi.png",
	"Tangaroa-Poivai.png",
	"Tangaroa-Tau.png",
	"Tangaroa-Timoteo-Savali.png",
];

$(document).ready(function(){
	setValidMessage("name","Island names may only contain letters, spaces hyphens, and apostrophes")
	setValidMessage("seed","Island Seeds may only contain digits");

	let bod = $("body");

	bod.css("background-image","url('art/"+concept_art[Math.floor(Math.random()*concept_art.length)]+"')")
	bod.css("background-position",(Math.random() < 0.5 ? "-30" : "130")+"% "+Math.floor(Math.random()*30-15)+"vw")

});
