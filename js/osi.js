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
var pageHistory = new Array();

var island;

const HOMEPAGE = 1;
const GENERATOR = 2;
const GALLERY = 7;
const GALLERYPREVIEW = 8;
const DOCS = 9;
const DEVNOTES = 10;
const SOURCES = 11;
const ABOUT = 12;
const MAX_PAGE = 12;

/*
	https://stackoverflow.com/a/7768006

	Got this regex safari detector from stack overflow. Hope its ok.
	Apparently safari decides that if you apply any styling to an HTML5
	input type=color element, it just hides it completely!! What are those
	"geniuses" at apple thinking??? So much time wasted on this bug.

	I'm pretty well versed in regex, but only in the scope of using SED/GREP in unix world, and
	I don't have a clue what this is doing, so I've given up trying to write my own.
*/
const SAFARI = (/^((?!chrome|android).)*safari/i.test(navigator.userAgent));


function setValidMessage(id,message){
	let element = $("#"+id);
	element.attr("oninvalid","this.setCustomValidity('"+message+"')");
	element.attr("onchange","try{setCustomValidity('')}catch(e){}");
	element.attr("oninput","setCustomValidity(' ')");
}

function spawnParticle(e){
	let particle = $("<div class=Particle></div>");
	particle.css("left",Math.random()*window.innerWidth*0.95+"px");
	particle.css("top",Math.random()*window.innerHeight*0.95+"px");
	$("body").prepend(particle)
	setTimeout(function(e){
		particle.remove();
	}, 2000);
}

function changePage(page){
	if(page===undefined){
		page = pageHistory.pop();
	}
	else{
		stackPage();
	}

	$(".page:nth-child("+currentPage+")").fadeOut();
	currentPage = page;
	$(".page:nth-child("+currentPage+")").fadeIn();
}

function turnPage(dir){
	if($("form")[0].reportValidity()){
		changePage(currentPage+dir);
	}
}

function stackPage(){
	pageHistory.push(currentPage);
	if(pageHistory.length > 3){
		pageHistory.shift();
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


	let boolCheck = [
		["motu","HAS_MOTU"],
		["reef","HAS_REEF"],
		["atoll","IS_ATOLL"],
		["volcano","IS_VOLCANO"],
		["trees","HAS_TREES"],
		["background","colour_background"]
	];
	for(let i=0;i<boolCheck.length;i++){
		set[boolCheck[i][1]] = $("#"+boolCheck[i][0]).prop("checked");

	}

	set.ISL_PERSIST = parseInt($("#persistence").val())/10;
	set.ISL_LAC = parseInt($("#lacunarity").val())/100;
	set.ISL_SCALE = parseInt($("#scale").val());

	set.HAS_TOWN = ($("#village").prop("checked") ? 0 : 1);
	set.village_size = parseInt($("#village_size").val());
	set.tree_amt = parseInt($("#tree_amt").val())*20;

	let valsCheck = [
		["name","name"],
		["ocean","DEEP_OCEAN"],
		["shallows","SHALLOW_OCEAN"],
		["ground1","LAND_ONE"],
		["ground2","LAND_TWO"],
		["ground3","LAND_THREE"],
		["beach","BEACH"],
		["rock1","ROCK_ONE"],
		["rock2","ROCK_TWO"],
		["lava1","LAVA_ONE"],
		["lava2","LAVA_TWO"]
	];
	let tempLookup;
	for(let i=0;i<valsCheck.length;i++){
		tempLookup = $("#"+valsCheck[i][0]).val();
		if(tempLookup.length > 0){
			set[valsCheck[i][1]] = tempLookup;
		}
	}


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
	$("#backgroundDisplay .lighting").css("background-image","url('concept-art/"+bgkimg+"-lighting.png')")
	$("#backgroundDisplay .baselayer").css("background-image","url('concept-art/"+bgkimg+".png')")


	$("form").append("<div class=page id=backgroundPage></div>");


	if(Math.abs($("body").height() - window.innerHeight) > 1){
		$("body").height(window.innerHeight);
		$("body").width(window.innerWidth);

		$(".page").css("max-width",window.innerHeight * 0.675);
		$(".page").width(window.innerWidth * 0.9);
		$(".page").height(window.innerWidth * 1.2);
		$(".page").css("max-height",window.innerHeight * 0.9);

	}



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


	let slidertoggle = [["village","villagesize"],["trees","tree_amt"],["volcano","lava1"],["background","ocean"]];
	for(let i=0;i<slidertoggle.length;i++){
		$("#"+slidertoggle[i][0]).change(function() {
			$("#"+slidertoggle[i][1]).parent()[this.checked ? "show" : "hide"]();
		});
	}













	setUpButtonClicks();




	$("form").submit(function(e){
		$("<input />")
			.attr("type", "hidden")
			.attr("name", "imageData")
			.attr("value", $("#preview_display").attr("src"))
			.appendTo(this);
		return true;
	});


	if(!SAFARI){
		$("input[type=color]").css("border","0").css("width","40%").css("height","90%");
	}
});


function setUpButtonClicks(){
	let buttonMap = [
		["#documentation",DOCS],
		["#about",ABOUT],
		["#devnotes",DEVNOTES],
		["#sources",SOURCES],
		["input[value=back]",undefined],
		[".home",HOMEPAGE],
		["#generator",GENERATOR],
		["#edit",GENERATOR]
	];

	for(let i=0;i<buttonMap.length;i++){
		$(buttonMap[i][0]).click(function(e){
			changePage(buttonMap[i][1]);
		});
	}

	$("input[type=button], input[type=submit], button").click(function(e){
		$(this).blur();
	});


	$("input[value=next]").click(function(e){
		turnPage(1);
	});

	$("#gal div").children().click(imageClickEvent);
	


	let complexEvents = [
		["#compile, #recompile",compileEvent],
		["#save",saveEvent],
		["#gallery",galleryEvent],
		["#copy",copyEvent]
	];

	for(let i=0;i<complexEvents.length;i++){
		$(complexEvents[i][0]).click(complexEvents[i][1]);
	}

}

function imageClickEvent(e){
	changePage(GALLERYPREVIEW);

	let selected = $(this);
	let attrs = selected.prop("attributes");
	let preview = $("#gallery-preview img");

	$.each(attrs, function() {
		if(this.name !== "style"){
			preview.attr(this.name, this.value);
		}
	});

	$("#gallery-preview h1")[0].innerHTML = preview.attr("islname");
}

function copyEvent(e){
	let img = $("#gallery-preview img");

	let valsSet = [
		["seed","islseed"],
		["name","islname"],
		["ocean","isldeep_ocean"],
		["shallows","islshallow_ocean"],
		["ground1","islland_one"],
		["ground2","islland_two"],
		["ground3","islland_three"],
		["beach","islbeach"],
		["rock1","islrock_one"],
		["rock2","islrock_two"],
		["lava1","isllava_one"],
		["lava2","isllava_two"]
	];

	for(let i=0;i<valsSet.length;i++){
		$("#"+valsSet[i][0]).val(img.attr(valsSet[i][1]));
	}

	let boolsSet = [
		["motu","islhas_motu"],
		["reef","islhas_reef"],
		["volcano","islis_volcano"],
		["atoll","islis_atoll"],
		["village","islhas_town"],
		["trees","islhas_trees"],
		["colour_background","islcolour_background"]
	];

	for(let i=0;i<boolsSet.length;i++){
		$("#"+boolsSet[i][0]).prop("checked",img.attr(boolsSet[i][1])==="1");
	}

	$("#time").val(parseInt(img.attr("islsunset")))
	$("#tree_amt").val(parseInt(img.attr("isltree_amt")))
	$("#village_size").val(parseInt(img.attr("islvillage_size")))
	$("#persistence").val(parseFloat(img.attr("islisl_persist")))
	$("#lacunarity").val(parseFloat(img.attr("islisl_lac")))
	$("#scale").val(parseFloat(img.attr("islisl_scale")))

	changePage(GENERATOR);
}

function galleryEvent(e){
	changePage(GALLERY);
	let div = $("#gal div");
	div.scrollTop(div.height());
	let amt = div.height();

	let scrollTimer = setInterval(function(){
		amt -= div.height()/50;
		if(amt<=0){
			div[0].scrollTo({top: 0});
			clearInterval(scrollTimer);
		}
		else{
			div[0].scrollTo({top: amt})
		}
	},5);
}

function saveEvent(e){
	island.saveImage($("#village").prop("checked"),true);
}

function compileEvent(e){
	turnPage(this.id==="compile" ? 1 : -1);
	if(this.id==="recompile"){
		$("#seed").val("");
		$("#name").val("");
	}
	setTimeout(function(){
		if(compileIsland()){
			turnPage(1);
			$("#seed").val(island.replicable_seed);
			$("#name").val(island.name);
		}
		else{
			changePage(GENERATOR);
		}
	},600);
}
