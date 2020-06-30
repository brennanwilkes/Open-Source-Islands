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

function setValidMessage(id,message){
	let element = $("#"+id);
	element.attr("oninvalid","this.setCustomValidity('"+message+"')");
	element.attr("onchange","try{setCustomValidity('')}catch(e){}");
	element.attr("oninput","setCustomValidity(' ')");
}

function spawnParticle(event){
	let particle = $("<div class=Particle></div>");
	particle.css("left",Math.random()*99+"vw");
	particle.css("top",Math.random()*99+"vh");
	$("body").prepend(particle)
	setTimeout(function(event){
		particle.remove();
	}, 2000);
}

function changePage(dir){
	if($("form")[0].reportValidity()){
		$("#page"+currentPage).hide();
		currentPage = Math.max(0,Math.min(currentPage+dir,2));
		$("#page"+currentPage).show();
	}
}

var currentPage = 0;

$(document).ready(function(){
	setValidMessage("name","Island names may only contain letters, spaces hyphens, and apostrophes")
	setValidMessage("seed","Island Seeds may only contain digits");

	$("main").css("background-image","url('concept-art/"+concept_art[Math.floor(Math.random()*concept_art.length)]+"')")


	$("#page0").show();
	$("#page1").hide();
	$("#page2").hide();


	setInterval(spawnParticle, 55);

	$("#atoll").change(function() {
		if(this.checked){
			$("#volcano").prop("checked", false);
			$("#motu").prop("checked", true);
		}
	});
	$("#volcano").change(function() {
		if(this.checked){
			$("#atoll").prop("checked", false);
		}
	});
	$("#motu").change(function() {
		if(!this.checked && $("#atoll")[0].checked){
			$("#motu").prop("checked", true);
		}
	});

	$("input[value=next]").click(function(event){
		changePage(1);
	});

	$("input[value=back]").click(function(event){
		changePage(-1);
	});

	document.ontouchmove = function(event){event.preventDefault();};


});
