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

var currentPage = 1;
var island;
const MAX_PAGE = 10;
var expandedImage = false;

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
	$(".page:nth-child("+currentPage+")").fadeOut();
	currentPage = page;
	$(".page:nth-child("+currentPage+")").fadeIn();
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


	$("form").append("<div class=page id=backgroundPage></div>");



	setInterval(spawnParticle, 55);


	let galimgs = $("#gal div").children();
	let ran;
	let threes = 0;
	let last = false;
	for(let i=0;i<galimgs.length;i++){
		ran = Math.random();
		if(ran < 0.35 && (i-threes)%3 === 0 && !last && i > 3){
			$(galimgs[i]).css("grid-column","auto / span 3");
			$(galimgs[i]).css("grid-row","auto / span 3");
			threes++;
			last = true;
		}
		else if(ran < 0.65 &&(i-threes)%3 != 2){
			$(galimgs[i]).css("grid-column","auto / span 2");
			$(galimgs[i]).css("grid-row","auto / span 2");
			i+=2;
			last = false;
		}
		else{
			last = false;
		}
	}
	$("#gal div").children().click(function(e){
		changePage(10);
		$("#gallery-preview img").attr("src",$(this).attr("src"))
		$("#gallery-preview h1")[0].innerHTML = "TEST TEST"
	});


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



	for(let p=1;p<=MAX_PAGE;p++){
		$(".page:nth-child("+p+")").hide();
	}
	$(".page:nth-child(1)").show();


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
		changePage(2);
	});

	$(".home").click(function(e){
		changePage(1);
	});

	$("#generator").click(function(e){
		changePage(2);
	});

	$("#gallery").click(function(e){
		changePage(7);
		let div = $("#gal div");
		div.scrollTop(div.height());
		div[0].scrollTo({top: 0, behavior: "smooth"});

	});
	$("#back").click(function(e){
		changePage(7);
	});

	$("#documentation").click(function(e){
		changePage(8);
	});

	$("#about").click(function(e){
		changePage(9);
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
				changePage(2);
			}
		},600);
	});

	$("#save").click(function(e){
		island.saveImage($("#village").prop("checked"),true);
	});

	$("#save-copy").click(function(e){
		downloadStaticPNG($("#gallery-preview img").attr("src"),$("#gallery-preview h1")[0].innerHTML);
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
