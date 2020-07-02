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

var currentPage = 0;
var island;
const MAX_PAGE = 4;

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
		if(dir===undefined){
			currentPage = 0;
		}
		else{
			currentPage = Math.max(0,Math.min(currentPage+dir,MAX_PAGE));
		}
		$("#page"+currentPage).show();
	}
}

function compileIsland(){
	let set;
	if($("#seed").val().length > 0){
		set = new IslandSettings($("#seed").val());
	}
	else{
		set = new IslandSettings();
	}

	if($("#name").val().length > 0){
		set.name = $("#name").val();
	}

	set.HAS_MOTU = $("#motu").prop("checked");
	set.HAS_REEF = $("#reef").prop("checked");
	set.IS_ATOLL = $("#atoll").prop("checked");
	set.IS_VOLCANO = $("#volcano").prop("checked");

	set.ISL_PERSIST = parseInt($("#persistence").val())/10;
	set.ISL_LAC = parseInt($("#lacunarity").val())/100;
	set.ISL_SCALE = parseInt($("#scale").val());

	set.HAS_TOWN = ($("#village").prop("checked") ? 0 : 1);
	set.village_size = parseInt($("#village_size").val());
	set.HAS_TREES = $("#trees").prop("checked");
	set.tree_amt = parseInt($("#tree_amt").val())*20;

	set.DEEP_OCEAN = $("#ocean").val();
	set.SHALLOW_OCEAN = $("#shallows").val();
	set.LAND_ONE = $("#ground1").val();
	set.LAND_TWO = $("#ground2").val();
	set.LAND_THREE = $("#ground3").val();
	set.BEACH = $("#beach").val();
	set.ROCK_ONE = $("#rock1").val();
	set.ROCK_TWO = $("#rock2").val();
	set.LAVA_ONE = $("#lava1").val();
	set.LAVA_TWO = $("#lava2").val();
	set.colour_background = $("#background").prop("checked");
	set.time = parseInt($("#time").val());


	island = new Island(set);

	$("#preview_display").prop("src",island.compileStaticImage(true,true));
}

$(document).ready(function(){
	setValidMessage("name","Island names may only contain letters, spaces hyphens, and apostrophes")
	setValidMessage("seed","Island Seeds may only contain digits");

	$("main").css("background-image","url('concept-art/"+concept_art[Math.floor(Math.random()*concept_art.length)]+"')")


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

	$("#lava1").parent().hide();

	let slidertoggle = [["village","villagesize"],["trees","tree_amt"],["volcano","lava1"],["background","ocean"]];
	for(let i=0;i<slidertoggle.length;i++){
		$("#"+slidertoggle[i][0]).change(function() {
			$("#"+slidertoggle[i][1]).parent()[this.checked ? "show" : "hide"]();
		});
	}


	$("#page0").show();
	for(let p=1;p<=MAX_PAGE;p++){
		$("#page"+p).hide();
	}



	$("input[value=next]").click(function(event){
		changePage(1);
	});

	$("input[value=back]").click(function(event){
		changePage(-1);
	});

	$("#edit").click(function(event){
		changePage();
	});

	$("#compile").click(function(event){
		changePage(1);

		setTimeout(function(){
			compileIsland();
			changePage(1);
		},150);
	});


	if(window.matchMedia("only screen and (max-width: 760px)").matches){
		
	}

	//$("input[type=color]").prop("type","text").prop("pattern","^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$").prop("placeholder","#FFFFFF").prop("value","");

	document.ontouchmove = function(event){event.preventDefault();};

});
