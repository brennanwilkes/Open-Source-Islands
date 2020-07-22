/**
	@namespace osi
	@since 19/07/2020
	@version 1.0
	@author Brennan Wilkes
	@author 100322326
*/

//JSDOCS generation command
//jsdoc -d documentation/ js/island-generator/island.js js/osi.js js/island-generator/name_list.js

//-------------------------------------CONSTANTS AND GLOBALS------------------------------------------

/**
	List of concept art file names
	@type {string[]}
	@memberof osi
*/
var concept_art = [
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

/**
	Variable to keep track of which page index is currently displayed
	@type {number}
	@memberof osi
*/
var currentPage = 1;

/**
	Array of the most recent visted pages. Used for "back" functionality
	@type {number}
	@memberof osi
*/
var pageHistory = new Array();

/**
	Storage for generated {@link Island} object
	@type {object}
	@memberof osi
*/
var island;

/**
	Homepage index enum
	@type {number}
	@memberof osi
	@constant
*/
const HOMEPAGE = 1;

/**
	Generator index enum
	@type {number}
	@memberof osi
	@constant
*/
const GENERATOR = 2;

/**
	Gallery index enum
	@type {number}
	@memberof osi
	@constant
*/
const GALLERY = 7;

/**
	Gallery preview image index enum
	@type {number}
	@memberof osi
	@constant
*/
const GALLERYPREVIEW = 8;

/**
	Documentation page index enum
	@type {number}
	@memberof osi
	@constant
*/
const DOCS = 9;

/**
	Dev notes index enum
	@type {number}
	@memberof osi
	@constant
*/
const DEVNOTES = 10;

/**
	Sources index enum
	@type {number}
	@memberof osi
	@constant
*/
const SOURCES = 11;

/**
	About index enum
	@type {number}
	@memberof osi
	@constant
*/
const ABOUT = 12;

/*
	https://stackoverflow.com/a/7768006

	Got this regex safari detector from stack overflow. Hope its ok.
	Apparently safari decides that if you apply any styling to an HTML5
	input type=color element, it just hides it completely!! What are those
	"geniuses" at apple thinking??? So much time wasted on this bug.

	I'm pretty well versed in regex, but only in the scope of using SED/GREP in unix world, and
	I don't have a clue what this is doing, so I've given up trying to write my own.
*/
/**
	Safari regex detector
	@type {boolean}
	@memberof osi
	@constant
*/
const SAFARI = (/^((?!chrome|android).)*safari/i.test(navigator.userAgent));


//------------------------------------GENERAL PURPOSE FUNCTIONS--------------------------------------


/**
	Sets an elements HTML5 validation message using a neat JS trick
	@param {string} id of element to search for
	@param {string} message to set
	@memberof osi
*/
function setValidMessage(id,message){
	let element = $("#"+id);
	element.attr("oninvalid","this.setCustomValidity('"+message+"')");
	element.attr("onchange","try{setCustomValidity('')}catch(e){}");
	element.attr("oninput","setCustomValidity(' ')");
}

/**
	Spawns a random particle to the screen with random coordinates and deletes it after two seconds
	@memberof osi
*/
function spawnParticle(){

	//Create particle div element
	let particle = $("<div class=Particle></div>");

	//Set random coordinates
	particle.css("left",Math.random()*window.innerWidth*0.95+"px");
	particle.css("top",Math.random()*window.innerHeight*0.95+"px");

	//Add particle to DOM
	$("body").prepend(particle)

	//Delete particle after two seconds
	setTimeout(function(e){
		particle.remove();
	}, 2000);
}

/**
	Changes directly to a requested page
	@param {number} page Page index to change to
	@memberof osi
*/
function changePage(page){

	if(page===undefined){

		//"back" mode. Set page to last visited page
		page = pageHistory.pop();
	}
	else{

		//Add current page to the stack
		stackPage();
	}

	//Exit current page
	$(".page:nth-child("+currentPage+")").fadeOut();

	//Update tracker
	currentPage = page;

	//Move to next page
	$(".page:nth-child("+currentPage+")").fadeIn();
}

/**
	Runs HTML5 form validation, then calls {@link changePage}
	@param {number} dir forward or backwards / direction to turn
	@memberof osi
*/
function turnPage(dir){

	//Check form validity
	if($("form")[0].reportValidity()){

		//Move forward/backward
		changePage(currentPage+dir);
	}
}

/**
	Add the current page to the history stack
	@memberof osi
*/
function stackPage(){

	//pushback
	pageHistory.push(currentPage);

	//Keep history size reasonable
	if(pageHistory.length > 3){
		pageHistory.shift();
	}
}

/**
	Grabs relavent information from the form, and generates an {@link Island} Updates {@link island} instead of returning
	@memberof osi
*/
function compileIsland(){

	//Generate settings object with defaults.
	let set;
	if($("#seed").val().length > 0){

		//Use custom seed
		set = new IslandSettings($("#seed").val());
	}
	else{
		set = new IslandSettings();
	}

	//Grab basic booleans
	let boolCheck = [
		["motu","HAS_MOTU"],
		["reef","HAS_REEF"],
		["atoll","IS_ATOLL"],
		["volcano","IS_VOLCANO"],
		["trees","HAS_TREES"],
		["background","colour_background"]
	];

	//Save checkbox states
	for(let i=0;i<boolCheck.length;i++){
		set[boolCheck[i][1]] = $("#"+boolCheck[i][0]).prop("checked");
	}

	//Save unique value scalers
	set.ISL_PERSIST = parseInt($("#persistence").val())/10;
	set.ISL_LAC = parseInt($("#lacunarity").val())/100;
	set.ISL_SCALE = parseInt($("#scale").val());

	set.HAS_TOWN = ($("#village").prop("checked") ? 0 : 1);
	set.village_size = parseInt($("#village_size").val());
	set.tree_amt = parseInt($("#tree_amt").val())*20;
	set.time = parseInt($("#time").val());

	//Grab basic values
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

	//If set, save their contentes
	let tempLookup;
	for(let i=0;i<valsCheck.length;i++){
		tempLookup = $("#"+valsCheck[i][0]).val();
		if(tempLookup.length > 0){
			set[valsCheck[i][1]] = tempLookup;
		}
	}

	//Generate island object
	island = new Island(set);

	//Try to generate PNG data
	try{
		$("#preview_display").prop("src",island.compileStaticImage(true,true));
	}
	catch(e) {

		//Offline file mode warning message
		alert("Island images cannot be generated with trees and villages when the page is being loaded from a local file. This is due to browser security messures. Either generate without trees and villages, or checkout the deployment at https://brennanwilkes.github.io/Open-Source-Islands/")
		return false;
	}
	return true;
}

/**
	Main setup function. Prepares the DOM
	@memberof osi
*/
function main(){

	//Set validation messages for regex checkers
	setValidMessage("name","Island names may only contain letters, spaces hyphens, and apostrophes")
	setValidMessage("seed","Island Seeds may only contain digits");

	//Set up random background art
	let bgkimg = concept_art[Math.floor(Math.random()*concept_art.length)];
	$("#backgroundDisplay .lighting").css("background-image","url('concept-art/"+bgkimg+"-lighting.png')")
	$("#backgroundDisplay .baselayer").css("background-image","url('concept-art/"+bgkimg+".png')")

	//Set background page for smoother transitions
	$("form").append("<div class=page id=backgroundPage></div>");

	//IOS mode - Adjust element heights to match IOS screen size. Damn you apple!!! >:(
	if(Math.abs($("body").height() - window.innerHeight) > 1){
		$("body").height(window.innerHeight);
		$("body").width(window.innerWidth);
		$(".page").css("max-width",window.innerHeight * 0.675);
		$(".page").width(window.innerWidth * 0.9);
		$(".page").height(window.innerWidth * 1.2);
		$(".page").css("max-height",window.innerHeight * 0.9);
	}

	//Trigger particle spawning
	setInterval(spawnParticle, 55);

	//Randomly set column and row span for gallery images
	let galimgs = $("#gal div").children();
	let ran;
	let threes = 0;
	let last = false;
	for(let i=0;i<galimgs.length;i++){
		ran = Math.random();

		//Set to 3x3 tile - <35% chance due to previous sizes
		if(ran < 0.35 && (i-threes)%3 === 0 && !last && i > 3){
			$(galimgs[i]).css("grid-column","auto / span 3");
			$(galimgs[i]).css("grid-row","auto / span 3");
			threes++;
			last = true;
		}

		//Set to 2x2 tile - <65% chance
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

	//Set atoll requirement autoclicking
	$("#atoll").change(function() {
		if(this.checked){
			$("#volcano").prop("checked", false);
			$("#motu").prop("checked", true);
		}
	});

	//Set volcano discrepancy autoclicking
	$("#volcano").change(function() {
		if(this.checked){
			$("#atoll").prop("checked", false);
		}
	});

	//Set motu discrepancy autoclicking
	$("#motu").change(function() {
		if(!this.checked && $("#atoll")[0].checked){
			$("#motu").prop("checked", true);
		}
	});

	//Set toggleable input events
	let slidertoggle = [["village","villagesize"],["trees","tree_amt"],["volcano","lava1"],["background","ocean"]];
	for(let i=0;i<slidertoggle.length;i++){
		$("#"+slidertoggle[i][0]).change(function() {
			$("#"+slidertoggle[i][1]).parent()[this.checked ? "show" : "hide"]();
		});
	}

	//Set up button click events
	setUpButtonClicks();

	//Add extra form data on submission events
	$("form").submit(function(e){
		$("<input />")
			.attr("type", "hidden")
			.attr("name", "imageData")
			.attr("value", $("#preview_display").attr("src"))
			.appendTo(this);
		return true;
	});

	//Add non-safari-safe css styling
	if(!SAFARI){
		$("input[type=color]").css("border","0").css("width","40%").css("height","90%");
	}
}

/**
	Builds the button click events that power the sitemap navigation
	@memberof osi
*/
function setUpButtonClicks(){

	//Basic link buttons
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

	//Listeners
	for(let i=0;i<buttonMap.length;i++){
		$(buttonMap[i][0]).click(function(e){
			changePage(buttonMap[i][1]);
		});
	}

	//Special case blur animation
	$("input[type=button], input[type=submit], button").click(function(e){
		$(this).blur();
	});

	//Turn to next page with form validation
	$("input[value=next]").click(function(e){
		turnPage(1);
	});

	//Gallery image click event
	$("#gal div").children().click(imageClickEvent);

	//Button function events
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

/**
	Event handler for image gallery image clicks
	@param {object} e Event
	@memberof osi
*/
function imageClickEvent(e){

	//Change to preview page
	changePage(GALLERYPREVIEW);

	//Set src attribute
	$("#gallery-preview img").attr("src", $(this).attr("src"));

	//Set name text
	$("#gallery-preview h2")[0].innerHTML = getIslandData("name",parseInt(this.id));
}

function getIslandData(param,id){
	var temp;
	$.ajax({
		url: "php/ajax.php",
		method: "POST",
		async: false,
		data: {
			id: id,
			request: param
		}}).done(function(data){
			temp = data;
		}).fail(function(jqXHR,status){
			alert("failed! "+jqXHR+status);
		});
	return temp;
}

/**
	"Edit" clone of image in gallery event
	@param {object} e Event
	@memberof osi
*/
function copyEvent(e){

	//jQuery request
	let img = $("#gallery-preview img");

	//Attributes to copy
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

	//Copy into form fields
	for(let i=0;i<valsSet.length;i++){
		$("#"+valsSet[i][0]).val(img.attr(valsSet[i][1]));
	}

	//Boolean attributes
	let boolsSet = [
		["motu","islhas_motu"],
		["reef","islhas_reef"],
		["volcano","islis_volcano"],
		["atoll","islis_atoll"],
		["village","islhas_town"],
		["trees","islhas_trees"],
		["colour_background","islcolour_background"]
	];

	//Copy state into checkboxes
	for(let i=0;i<boolsSet.length;i++){
		$("#"+boolsSet[i][0]).prop("checked",img.attr(boolsSet[i][1])==="1");
	}

	//Special case attribute copy
	$("#time").val(parseInt(img.attr("islsunset")))
	$("#tree_amt").val(parseInt(img.attr("isltree_amt")))
	$("#village_size").val(parseInt(img.attr("islvillage_size")))
	$("#persistence").val(parseFloat(img.attr("islisl_persist")))
	$("#lacunarity").val(parseFloat(img.attr("islisl_lac")))
	$("#scale").val(parseFloat(img.attr("islisl_scale")))

	//Change to generator page
	changePage(GENERATOR);
}

/**
	Event handler for entering image gallery
	@param {object} e Event
	@memberof osi
*/
function galleryEvent(e){

	//Navigation
	changePage(GALLERY);

	//Scroll the page down
	let div = $("#gal div");
	div.scrollTop(div.height());
	let amt = div.height();

	//Slowly scroll page back to top
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

/**
	Event handler for saving an image. See {@link Island}
	@param {object} e Event
	@memberof osi
*/
function saveEvent(e){
	island.saveImage($("#village").prop("checked"),true);
}

/**
	Event handler for compiling island
	@param {object} e Event
	@memberof osi
*/
function compileEvent(e){

	//Recompile or compile normal navigation. Navigates to compile screen
	turnPage(this.id==="compile" ? 1 : -1);

	//Resets seed and name on recompile
	if(this.id==="recompile"){
		$("#seed").val("");
		$("#name").val("");
	}

	//Wait 600ms for animations to start. Without this, island compilation freezes keyframes
	setTimeout(function(){

		//Compile island
		if(compileIsland()){

			//On success, save seed and name and proceed to preview screen
			turnPage(1);
			$("#seed").val(island.replicable_seed);
			$("#name").val(island.name);
		}
		else{

			//On failure, return to generator screen
			changePage(GENERATOR);
		}
	},600);
}

//Run main function on document load
$(document).ready(main);
