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



});
