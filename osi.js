let concept_art = [
	"Atalia-Nanai",
	"Hokulele-Kekoa",
	"Kainano-Taualai",
	"Kuilei-Inoke",
	"Murihau",
	"Rangi-Karauna",
	"Tamah-Talatonu",
	"Tama-Ropata",
	"Aru"
];

var currentPage = 0;
var island;
const MAX_PAGE = 6;

function setValidMessage(id,message){
	let element = $("#"+id);
	element.attr("oninvalid","this.setCustomValidity('"+message+"')");
	element.attr("onchange","try{setCustomValidity('')}catch(e){}");
	element.attr("oninput","setCustomValidity(' ')");
}

function spawnParticle(e){
	let particle = $("<div class=Particle></div>");
	particle.css("left",Math.random()*99+"vw");
	particle.css("top",Math.random()*99+"vh");
	$("body").prepend(particle)
	setTimeout(function(e){
		particle.remove();
	}, 2000);
}

function changePage(page){
	$("#page"+currentPage).hide();
	currentPage = Math.max(0,Math.min(page,MAX_PAGE));
	$("#page"+currentPage).show();
}

function turnPage(dir){
	if($("form")[0].reportValidity()){
		changePage(currentPage+dir);
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

	if($("#ocean").val().length > 0){
		set.DEEP_OCEAN = $("#ocean").val();
	}
	if($("#shallows").val().length > 0){
		set.SHALLOW_OCEAN = $("#shallows").val();
	}
	if($("#ground1").val().length > 0){
		set.LAND_ONE = $("#ground1").val();
	}
	if($("#ground2").val().length > 0){
		set.LAND_TWO = $("#ground2").val();
	}
	if($("#ground3").val().length > 0){
		set.LAND_THREE = $("#ground3").val();
	}
	if($("#beach").val().length > 0){
		set.BEACH = $("#beach").val();
	}
	if($("#rock1").val().length > 0){
		set.ROCK_ONE = $("#rock1").val();
	}
	if($("#rock2").val().length > 0){
		set.ROCK_TWO = $("#rock2").val();
	}
	if($("#lava1").val().length > 0){
		set.LAVA_ONE = $("#lava1").val();
	}
	if($("#lava2").val().length > 0){
		set.LAVA_TWO = $("#lava2").val();
	}

	set.colour_background = $("#background").prop("checked");
	set.time = parseInt($("#time").val());


	island = new Island(set);

	try{
		$("#preview_display").prop("src",island.compileStaticImage(true,true));
	}
	catch(e) {
		alert("Island images cannot be generated with trees and villages when the page is being loaded from a local file. This is due to browser security messures. Either generate without trees and villages, or checkout the deployment at https://brennanwilkes.github.io/Open-Source-Islands/")
		return false;
	}
	return true;
}

$(document).ready(function(){
	setValidMessage("name","Island names may only contain letters, spaces hyphens, and apostrophes")
	setValidMessage("seed","Island Seeds may only contain digits");

	let bgkimg = concept_art[Math.floor(Math.random()*concept_art.length)];
	$("#backgroundDisplay").css("background-image","url('concept-art/"+bgkimg+"-lighting.png')")
	$("#isl").css("background-image","url('concept-art/"+bgkimg+".png')")


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


	$("input[type=button], input[type=submit], button").click(function(e){
		$(this).blur();
	});


	$("input[value=next]").click(function(e){
		turnPage(1);
	});

	$("input[value=back]").click(function(e){
		turnPage(-1);
	});

	$("#edit").click(function(e){
		$("#seed").val(island.replicable_seed);
		changePage(1);
	});

	$(".home").click(function(e){
		changePage(0);
	});

	$("#generator").click(function(e){
		changePage(1);
	});

	$("#about").click(function(e){
		changePage(6);
	});

	$("#compile, #recompile").click(function(e){
		turnPage(this.id==="compile" ? 1 : -1);
		if(this.id==="recompile"){
			$("#seed").val("");
		}
		setTimeout(function(){
			if(compileIsland()){
				turnPage(1);
			}
			else{
				changePage(1);
			}
		},150);
	});

	$("#save").click(function(e){
		island.saveImage($("#village").prop("checked"),true);
	});


	/*
		https://stackoverflow.com/questions/5899783/detect-safari-using-jquery

		Got this regex safari detector from stack overflow. Hope its ok, as its a little bit
		outside the scope of the course. Apparently safari decides that if you apply any styling
		to an HTML5 input type=color element, it just hides it completely!! What are those "geniuses"
		at apple thinking??? So much time wasted on this bug.

		I'm pretty well versed in regex, but only in the scope of using SED/GREP in unix world, and
		I don't have a clue what this is doing, so I've given up trying to write my own.
	*/
	if(!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)){
		$("input[type=color]").css("border","0").css("width","40%").css("height","90%");
	}
});
