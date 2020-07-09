/**
	@namespace island.js
	CPSC-2030-W01
	@since 05/06/2020
	@version 1.0
	@author Brennan Wilkes
	@author 100322326
*/

//JSDOCS generation command
//jsdoc -d documentation/ island.js osi.js name_list.js

//------------------------------------HELPER FUNCTIONS--------------------------------------


/**
	Calculates the distance from a point to the center of a region
	@param {number} x x coordinate
	@param {number} y y coordinate
	@param {number} w width of region
	@param {number} h height of region
	@returns {number} distance from x,y to the center of w,h
*/
function region_dist(x,y,w,h){
	return Math.max(normalize(0.5-Math.sqrt(Math.pow(Math.abs(0.5-(x/w)),2)+Math.pow(Math.abs(0.5-(y/h)),2)),0,0.5),0);
}

/**
	normalize a value to between 0 and 1 based on min and max
	@param {number} val Initial value to normalize
	@param {number} min Minimum bound to normalize by
	@param {number} max Maximum bound to normalize by
	@returns {number} val normalized by min and max
*/
function normalize(val, min, max){
	return (val-min)/(max-min);
}

/**
	nomralize a 2d array to between 0 and 1 based on min and max
	@param {number} arr Array of values to normalize
	@param {number} minHeight Minimum bound to normalize by
	@param {number} maxHeight Maximum bound to normalize by
	@returns {number} Array of updated normalized values
*/
function normalize_2d_array(arr,minHeight,maxHeight){
	for(let x=0;x<arr.length;x++){
		for(let y=0;y<arr[x].length;y++){
			arr[x][y] = normalize(arr[x][y],minHeight, maxHeight);
		}
	}
	return arr;
}

/**
	Generates a perlin noise map based on parameters
	@param {number} width Width of the noise map
	@param {number} height Height of the noise map
	@param {number} scale Scale to view the base noise map layers. Higher scale values produced more "random" noise, while lower values produce more coherent results.
	@param {number} oct Number of octaves to generate. Each octave will contribute less to the overall noise map. More octaves means more expensive calculations, but more detailed noise maps.
	@param {number} persist The persistence of each octave to effect the overall noise map. Adjusts each octaves amplitude.
	@param {number} lac The lacunarity to apply to each octave. Adjusts each octaves frequency, which determines level of detail. Higher lacunarity creates more "detailed" "random" noise, while lower values creates more abstract shapes.
	@param {number} seed Seed value
	@param {boolean} normalize If the noise map should be normalized by it's min and max values to create a smoother more real gradient. Defaults to true. If left false, will record the min and max values as attributes of the return arrary for future normalization.
	@returns {number[]} A 2d array of perlin noise. If normalize was set to false, the min and max values are recorded in attributes minHeight and maxHeight.
*/
function gen_noise_map(width, height, scale, oct, persist, lac, seed, normalize=true){

	//Seed the perlin noise module.
	noise.seed(seed);

	//Setup
	let xx,yy;
	let map = new Array(width);
	let maxHeight = Number.NEGATIVE_INFINITY;
	let minHeight = Number.POSITIVE_INFINITY;

	for(let x=0;x<width;x++){
		map[x] = new Array(height);
		for(let y=0;y<height;y++){

			//initialize at coordinate
			map[x][y] = 0;
			let amp = 1;
			let freq = 1;

			//iterate over octaves
			for(let i=0; i < oct; i++){

				//adjust coordinates
				xx = x / scale * freq
				yy = y / scale * freq;

				//generate base noise
				map[x][y] += (noise.perlin2(xx, yy)*2-1) * amp;

				//update modifiers
				amp *= persist;
				freq *= lac;
			}

			//update minimax
			maxHeight = Math.max(maxHeight, map[x][y]);
			minHeight = Math.min(minHeight, map[x][y]);
		}
	}

	//Record min and max values
	if(!normalize){
		map.minHeight = minHeight;
		map.maxHeight = maxHeight;
	}

	//normalize and return
	return normalize ? normalize_2d_array(map,minHeight,maxHeight) : map;
}

/**
	Generates an HTML canvas rgb formatted string from three channel values
	@param {number} r Red channel
	@param {number} g Green channel
	@param {number} b Blue channel
	@returns {string} HTML canvas rgb formatted string
*/
function rgb(r,g,b){
	return "rgb("+r+", "+g+", "+b+")";
}

/**
	A basic insecure 64bit hash. Hashes a number by repeatedly applying bitwise operations, and salting by each digit of the original number. I've chosen some magic numbers to left shift by, 16, 19, 26, 13, purely through trial and error to get good results. This hash is by no means secure, and should not be used for encryption purposes, but for my purpose of "randomizing" seed values, and generating "random" results (that of course are not actually random, and will unfold the same way every time for the same seed), this works excellently.
	@param {number} num Initial number to salt hash with.
	@returns {number} 64bit hash salted by the initial passed number
*/
function hash(num){

	//Start with "seemingly" random bits
	let hash = 0x12345678;

	//Iterate over every digit
	while (num > 0) {

		//XOR the hash by the OR product of the hash shifted by 16 and 19 bits
		hash ^= (hash << 16) | (hash << 19);

		//Salt with the current digit
		hash += num % 10;

		//XOR the hash by the OR product of the hash shifted by 26 and 13 bits
		hash ^= (hash << 26) | (hash << 13);

		//Crop off the end digit
		num = num / 10;
	}
	return Math.abs(hash);
}

/**
	Generates a lighting value for a coordinate based on a passed predetermined scaler, and the coordinates distance and height differential to a peak coordinate. This value will range between 0 and 1, and directly maps to the required opacity value of the rendered shadow
	@param {number[]} peak a three element array repersenting the x coordinate, y coordinate, and height value of the peak casting shadows
	@param {number[]} coord a three element array repersenting the x coordinate, y coordinate, and height value of the pixel which a shadow is being rendered over
	@param {number} time Scaler value to determine max shadow length
	@returns a float between 0 and 1 directly mapping to an opacity value to render the pixel's shadow at
*/
function get_lighting(peak,coord,time){

	//Remove structure metadata
	let val0 = (has_structure(peak[2]) ? strip_metadata(peak[2]) : peak[2]);
	let val1 = (has_structure(coord[2]) ? strip_metadata(coord[2]) : coord[2]);

	//Calculate value and return
	return (val0-val1+0.2)*(1-(Math.pow(distance(peak,coord),1.25)/time));
}

/**
	Calculates the distance from a to b
	@param {number} a
	@param {number} b
	@returns distance from a to b
*/
function distance(a,b){
	return Math.sqrt(Math.pow(b[0]-a[0],2)+Math.pow(b[1]-a[1],2));
}

/**
	Essentially a lookup table to determine the index of the colour to render a pixel height value at. If the pixel contains structure metadata,
	a value of 4 is returned for special behaviour. This is used for shadow casting. Otherwise, the return value maps to the island::colours[v][0] hexidecimal colour code. The order of the indexes determines the base rules for shadow casting.
	@param {number} height Height value to lookup
	@returns Index of colour value, or 4 for structure meta data.
*/
function colour_round(height){
	if(has_structure(height)){
		return 4;
	}
	else if(height <0.1){
		return 0;
	}
	else if(height <0.3){
		return 1;
	}
	else if(height  < 0.35){
		return 2;
	}
	else if(height  < 0.45){
		return 3;
	}
	else if(height  < 0.6){
		return 5;
	}
	else if(height  < 0.75){
		return 6;
	}
	else if(height < 0.885 && height > 0.875){
		return 9;
	}
	else if(height < 0.925){
		return 8;
	}
	return 7;
}

/**
	Determines if a height value contains structure meta data. Height values are numbers between 0 and 1. (Actually a lie, as they can exceed 1, but for abstract purposes you can consider them a float between 0 and 1). This leaves the integer portion of the number unused, so I use it to contain meta data about the pixel, by salting it with a magic integer when a structure is at that coordinate.
	@param {number} val height value to check
	@returns boolean if val contains strucutre metadata
*/
function has_structure(val){
	return (Math.floor(val)%STRUCTURE_META === 0 && Math.floor(val) > 0);
}

/**
	Strips a height value of it's structure metadata in order to be better used by the shadow renderer. See {@link has_structure} for more information
	@param {number} val value to be stripped
	@returns val stripped of metadata
*/
function strip_metadata(val){

	//While this mimics modulo, for some reason simply returning val % STRUCTURE_META yielded incorrect results
	while(val > STRUCTURE_META){
		val -= STRUCTURE_META;
	}
	return val;
}

/**
	Downloads static PNG data as a file using dynamic html.
	@param {string} png raw static PNG data
	@param {string} name Name to save file as
*/
function downloadStaticPNG(png,name){

	//Create a link
	let link = document.createElement('a');

	//Set the download attribute to the file name
	link.setAttribute("download",name);

	//Set the href attribute to the raw png data
	link.setAttribute('href', png);

	//Download
	link.click();
}

//-------------------------------------CONSTANTS------------------------------------------


/**
	Scale factor. Higher values results in more pixelated images
	@type {number}
	@constant
*/
const ISLAND_PIXEL_SCALE = 4;

/**
	Magic number for structure meta data. Can be any magic number, just has to be unique
	@type {number}
	@constant
*/
const STRUCTURE_META = 36;

/**
	Sprite scale factor
	@type {number}
	@constant
*/
const SPRITE_SIZE = 8;


//-------------------------------------ISLAND SETTINGS CLASS------------------------------------------



/**
	@class Island settings class to store default values for all settings, as well as give the ability to generate custom islands with modified settings. This achieves the same thing as passing many values into the island constructor, and giving them defaults, but is more readable (Otherwise I'd be putting 250 lines worth of parameters into one constructor!! Madness!), and allows for better customization flexibility. Many of these values are constants that shouldn't be changed, and obviously none of these will be changed after island compile time, as they're simply parameters.
*/
class IslandSettings{

	/**
	 	@constructor
		@param {number} seed Seed for the island. Custom seeds must be set through the constructor, as many of the other default values are determined based on a {@link hash} of the seed modulus some constant. Defaults to a random number
	*/
	constructor(seed=Math.round(Math.random()*1000000)){

		/**
			Master seed
			@type {number}
		*/
		this.seed=seed;

		/**
			Island name. Defaults to a random selection from the {@link NAMES_LIST}
			@type {string}
		*/
		this.name = NAMES_LIST[hash(this.seed*this.seed)%NAMES_LIST.length];

		/**
			Width of the island
			@type {number}
		*/
		this.size_x = 1024;

		/**
			Height of the island
			@type {number}
		*/
		this.size_y = 1024;

		/**
			For export purposes, determines if a background should be drawn
			@type {boolean}
		*/
		this.colour_background = true;

		//--------------------------------------COLOURS--------------------------------------

		/**
			Deep ocean / background colour repersented in hexidecimal
			@type {string}
		*/
		this.DEEP_OCEAN = "#000770";

		/**
			Shallow ocean colour repersented in hexidecimal
			@type {string}
		*/
		this.SHALLOW_OCEAN = "#0C49AC";

		/**
			Low ground colour repersented in hexidecimal
			@type {string}
		*/
		this.LAND_ONE = "#587E31";

		/**
			Middle ground colour repersented in hexidecimal
			@type {string}
		*/
		this.LAND_TWO = "#274C00";

		/**
			High ground colour repersented in hexidecimal
			@type {string}
		*/
		this.LAND_THREE = "#173600";

		/**
			Beach colour repersented in hexidecimal
			@type {string}
		*/
		this.BEACH = "#D0AB76";

		/**
			Low rock colour repersented in hexidecimal
			@type {string}
		*/
		this.ROCK_ONE = "#959688";

		/**
			High ground colour repersented in hexidecimal
			@type {string}
		*/
		this.ROCK_TWO = "#626354";

		/**
			Low lava colour repersented by an HTML5 colour value
			@type {string}
		*/
		this.LAVA_ONE = "darkred";

		/**
			High lava colour repersented by an HTML5 colour value
			@type {string}
		*/
		this.LAVA_TWO = "orange";

		/**
			Village colour repersented in hexidecimal
			@type {string}
			@deprecated
		*/
		this.VILLAGE = "#654321";

		/**
			Time value to scale shadows by when exporting an image of the island.
			@type {number}
		*/
		this.time = 10;

		//--------------------------------------PERLIN NOISE SETTINGS--------------------------------------

		/**
			Boolean to repersent if an island should be generated with a motu. Default 50% chance.
			@type {boolean}
		*/
		this.HAS_MOTU = this.seed%2 === 0;

		/**
			Boolean to repersent if an island should be generated with a reef. Default 50% chance, and must also have a motu.
			@type {boolean}
		*/
		this.HAS_REEF = this.HAS_MOTU && hash(this.seed-50)%2 === 0;

		/**
			Boolean to repersent if an island should be generated as an atoll. Default 25% chance, and must also have a motu.
			@type {boolean}
		*/
		this.IS_ATOLL = this.HAS_MOTU && hash(this.seed-100)%4 === 0;

		/**
			Boolean to repersent if an island should be generated with a volcano. Default 25% chance, and must also not have a motu.
			@type {boolean}
		*/
		this.IS_VOLCANO = !this.HAS_MOTU && hash(this.seed-66)%4 === 0;

		/**
			Number to repersent state of village generation. Defaults to 0.
				0  | Village should be, but hasn't yet been generated.
				1  | No village should be generated.
				-1 | Village has already been generated.
			@type {number}
		*/
		this.HAS_TOWN = 0;

		/**
			Size of village. Affects both number of structures, and spread of structures. Defaults to 6.
			@type {number}
		*/
		this.village_size = 6;

		/**
			Boolean to repersent if an island should have trees generated. Defaults to true.
			@type {boolean}
		*/
		this.HAS_TREES = true;

		/**
			Amount of trees to generate, if tree generation is true. Defaults to 500.
			@type {number}
		*/
		this.tree_amt = 500;

		/**
			Island persistence scaler. See {@link gen_noise_map} for more information. Defaults to 2.
			@type {number}
		*/
		this.ISL_PERSIST = 2;

		/**
			Island lacunarity scaler. See {@link gen_noise_map} for more information. Defaults to 0.75.
			@type {number}
		*/
		this.ISL_LAC = 0.75;

		/**
			Island scale scaler. See {@link gen_noise_map} for more information. Defaults to 25.
			@type {number}
		*/
		this.ISL_SCALE = 25;

		/**
			Number of octaves of perlin noise to layer. See {@link gen_noise_map} for more information. Defaults to 8.
			@type {number}
		*/
		this.ISL_OCT = 8;

		/**
			Motu persistence scaler. See {@link gen_noise_map} for more information. Defaults to 2.
			@type {number}
		*/
		this.MOTU_PERSIST = 2;

		/**
			Motu lacunarity scaler. See {@link gen_noise_map} for more information. Defaults to 0.95.
			@type {number}
		*/
		this.MOTU_LAC = 0.95;

		/**
			Motu scale scaler. See {@link gen_noise_map} for more information. Defaults to 500.
			@type {number}
		*/
		this.MOTU_SCALE = 500;

		/**
			Number of octaves of perlin noise to layer for motus. See {@link gen_noise_map} for more information. Defaults to 1.
			@type {number}
		*/
		this.MOTU_OCT = 1;

		/**
			Reef persistence scaler. See {@link gen_noise_map} for more information. Defaults to 2.
			@type {number}
		*/
		this.REEF_PERSIST = 2;

		/**
			Reef lacunarity scaler. See {@link gen_noise_map} for more information. Defaults to 0.95.
			@type {number}
		*/
		this.REEF_LAC = 0.95;

		/**
			Reef scale scaler. See {@link gen_noise_map} for more information. Defaults to 50.
			@type {number}
		*/
		this.REEF_SCALE = 50;

		/**
			Number of octaves of perlin noise to layer for reefs. See {@link gen_noise_map} for more information. Defaults to 1.
			@type {number}
		*/
		this.REEF_OCT = 1;

		/**
			Gradient of height minimax for motu generation. Initial height values between grad[0] and grad[1] will be raised to form the motu sandbars, while values between grad[2] and grad[3] will be lowered to form the motu lagoon.
			@type {number[]}
		*/
		this.MOTU_GRAD = [0.075,0.15,0.15,0.25];

		/**
			Constant value to shrink motu and atoll based islands by. This is offset by motu generation.
			@type {number}
		*/
		this.ISL_SHRK = 0.25;

		/**
			Mask range to allow specific regions of the island to be exempt from specifc generation by masking them.
			@type {number}
		*/
		this.ISL_MASK = [0.15,0.2];
	}
}


//-------------------------------------ISLAND CLASS------------------------------------------


/**
	@class Island class. Repersents an island as well as generates it. Where all the magic happens.
*/
class Island{

	/**
		Initializes all the needed data members, and runs the main generation methods
		@constructor
	*/
	constructor(settings, LAC_SCALE_DOWN=1) {

		/**
			Array of colours repersented in hexidecimal, which map one-to-one to the {@link display_data} data.
			@type {string[]}
		*/
		this.colours = [settings.DEEP_OCEAN, settings.SHALLOW_OCEAN, settings.LAND_ONE, settings.LAND_TWO, settings.LAND_THREE, settings.BEACH, settings.VILLAGE, settings.ROCK_ONE, settings.ROCK_TWO, settings.LAVA_ONE, settings.LAVA_TWO];

		/**
			Settings ({@link IslandSettings}) for generation. Technically isn't const, but is never changed
			@type {object}
		*/
		this.settings = settings;

		/**
			2D array of the raw height map data from generation. This isn't used for rendering, rather for interactivity. If you want to test an exact coordinate to see the height of the terrain for instance.
			@type {number[]}
		*/
		this.raw_data;

		/**
			An array of rectangle verticies to be rendered. The most optimized way to re-render the island is to draw all of these rectangles, however soon this will be deprecated once I impliment static PNG rendering.
			@type {array[]}
		*/
		this.display_data;

		/**
			Storage for the HTML5 canvas element which contains the rendered rectangles making up the base layer of the island.
			@type {object}
		*/
		this.canvas_img;

		/**
			Storage for the HTML5 canvas element which contains the rendered rectangles making up the shadows layer of the island.
			@type {object}
		*/
		this.lighting_img;

		/**
			Exact copy of the passed seed
			@type {number}
		*/
		this.replicable_seed = settings.seed;

		/**
			{@link hash} copy of the passed seed
			@type {number}
		*/
		this.seed = hash(settings.seed);

		/**
			Coordinate x,y pair of the epicentre of the Island's village
			@type {number[]}
		*/
		this.town = [-1,-1];

		/**
			Boolean to repersent if lava exists on the island
			@type {boolean}
		*/
		this.has_volcano = false;

		/**
			Island name
			@type {string}
		*/
		this.name = settings.name;

		/**
			Coordinate w,h pair to repersent the island's size
			@type {number[]}
		*/
		this.size = [settings.size_x,settings.size_y];

		/**
			Lacunarity multiplier used under the hood for atoll/volcano generation types.
			@type {number}
		*/
		this.LAC_SCALE_DOWN = LAC_SCALE_DOWN;

		//Generate base noise map into raw_data
		this.gen_island_data();

		//Compress it by a pixel scale ratio
		this.raw_data = this.compress(ISLAND_PIXEL_SCALE);

		//Generate display data verticies
		this.gen_display_data(this.raw_data);

		//Generate re-drawable canvas element for base layer
		this.gen_ctx_img();

		//Generate re-drawable canvas element for objects (trees, village, etc)
		this.gen_objects_img();

		//Calculate and render shadows. Generate a re-drawable canvas element for them.
		this.bake_lighting();
	}

	/**
		Smart compress by scale factor. Smart meaning that it tends to generate cleaner, more solid borders between colour boundries, and respects and preserves priority elements.
		@param {number} factor Scale factor
		@returns {number[]} A compressed noise map. See {@link raw_data} and {@link gen_noise_map}.
	*/
	compress(factor){

		//Fast no-op
		if(factor===1){
			return this.raw_data;
		}

		//Get new size
		const n_x = Math.floor(this.raw_data.length/factor);
		const n_y = Math.floor(this.raw_data[0].length/factor);

		//Initialize new array to 0s.
		let comp = new Array(n_x);
		for(let i=0;i<n_x;i++){
			comp[i] = new Array(n_y);
			for(let j=0;j<n_y;j++){
				comp[i][j] = 0;
			}
		}

		let a,b;
		//Iterate over new array
		for(let x=0;x<n_x;x++){
			for(let y=0;y<n_y;y++){

				//Iterate over nearby pixels
				for(let xx=0;xx<factor;xx++){
					for(let yy=0;yy<factor;yy++){
						a = this.raw_data[x*factor+xx][y*factor+yy];
						b = comp[x][y];
						//copy highest priority pixel
						comp[x][y] = colour_round(a) > colour_round(b) ? a : b;
						//comp[x][y] = Math.max(this.raw_data[x*factor+xx][y*factor+yy], comp[x][y]);
					}
				}
			}
		}
		return comp;
	}

	/**
		An optimization algorithm to convert 2d noise maps into colour separated arrays of rectangle verticies.
		@param {number[]} raw_data noise map to operate on. Allows the island to copy another islands noise map.
	*/
	gen_display_data(raw_data){

		//Initializations
		this.display_data = new Array();

		//lightblue
		this.display_data[this.settings.SHALLOW_OCEAN] = new Array();

		//green
		this.display_data[this.settings.LAND_ONE] = new Array();

		//green
		this.display_data[this.settings.LAND_TWO] = new Array();

		//green
		this.display_data[this.settings.LAND_THREE] = new Array();

		//beach
		this.display_data[this.settings.BEACH] = new Array();

		//town
		this.display_data[this.settings.VILLAGE] = new Array();

		//mountain
		this.display_data[this.settings.ROCK_ONE] = new Array();
		this.display_data[this.settings.ROCK_TWO] = new Array();

		//volcano
		this.display_data[this.settings.LAVA_ONE] = new Array();
		this.display_data[this.settings.LAVA_TWO] = new Array();

		let adjusted_height;
		for(let x=0;x<raw_data.length;x++){
			for(let y=0;y<raw_data[0].length;y++){

				//Strip metadata
				adjusted_height = (has_structure(raw_data[x][y]) ? strip_metadata(raw_data[x][y]) : raw_data[x][y] );

				//Add cordinate pair to resepective colour array
				if(adjusted_height<0.1){
					continue;
				}
				else if(adjusted_height<0.3){
					this.display_data[this.settings.SHALLOW_OCEAN].push([x,y]);
				}
				else if(adjusted_height < 0.35){
					this.display_data[this.settings.BEACH].push([x,y]);
				}
				else if(adjusted_height < 0.45){
					this.display_data[this.settings.LAND_ONE].push([x,y]);
				}
				else if(adjusted_height < 0.6){
					this.display_data[this.settings.LAND_TWO].push([x,y]);
				}
				else if(adjusted_height < 0.75){
					this.display_data[this.settings.LAND_THREE].push([x,y]);
				}
				else if(adjusted_height < 0.885 && adjusted_height > 0.875){
					this.display_data[this.settings.ROCK_ONE].push([x,y]);
				}
				else if(adjusted_height < 0.925){
					this.display_data[this.settings.ROCK_TWO].push([x,y]);
				}
				else if(adjusted_height < 1.1){
					this.display_data[this.settings.LAVA_ONE].push([x,y]);
				}
				else{
					this.display_data[this.settings.LAVA_TWO].push([x,y]);
				}
			}
		}

		//Merge neighbouring pixels of each colour into rectangles
		let temp, strip, amt;

		//iterate over every colour, c
		for(let c=1;c<this.colours.length;c++){
			temp = new Array();

			//iterate over every pixel, p
			for(let p=0;p<this.display_data[this.colours[c]].length;p++){

				//create a 1x1 strip of that pixel
				strip = [this.display_data[this.colours[c]][p][0],this.display_data[this.colours[c]][p][1]];
				amt = 1;

				//search nearby pixels
				for(;p<this.display_data[this.colours[c]].length-1;p++){

					//if neighbouring pixels are the same colour, add one to the strip and continue searching
					if(this.display_data[this.colours[c]][p][0] === this.display_data[this.colours[c]][p+1][0] &&
					this.display_data[this.colours[c]][p][1]+1 === this.display_data[this.colours[c]][p+1][1]){
						amt++;
					}
					else{
						break;
					}
				}

				//Add the amount of pixels
				strip.push(amt);

				//Add 1. This is for future compatibility with boxes instead of strips
				strip.push(1);

				//commit the strip to memory
				temp.push(strip);
			}

			//Insert strips into display data
			this.display_data[this.colours[c]] = temp;
		}
	}

	/**
		Generates a redrawable canvas object as a render layer for all objects. Objects such as villages, trees, buildings, sprites, anything image based coming from a file. This canvas is meant to be rendered as a layer over top of the base layer, and likely under shadow/lighting layers.
	*/
	gen_objects_img(){

		//Initialize canvas object
		this.objects_img = document.createElement('canvas');
		this.objects_img.width = this.size[0];
		this.objects_img.height = this.size[1];
		let ctx_img = this.objects_img.getContext("2d");

		//Check that dependencies are initialized
		if(this.town != undefined && this.town.length === 2 && this.objects!=undefined){

			//Draw each object's image at the relavent coordinates on the canvas
			for(let b=0; b < this.objects.length; b++){
				ctx_img.drawImage(Island.graphics[this.objects[b][2]], this.objects[b][0] - Island.graphics[this.objects[b][2]].width/2, this.objects[b][1] - Island.graphics[this.objects[b][2]].height/2, Island.graphics[this.objects[b][2]].width, Island.graphics[this.objects[b][2]].height);
			}
		}
	}

	/**
		Wrapper algorithm to manipulate perlin noise maps into islands.
		The real heart of the Island class.
		Doesn't return, instead updates {@link raw_data}
	*/
	gen_island_data(){

		//Reduces lacunarity when island doing atoll or volcano generation.
		if(this.settings.IS_ATOLL){
			this.LAC_SCALE_DOWN = 0.8;
		}
		else if(this.settings.IS_VOLCANO){
			this.LAC_SCALE_DOWN = 0.925;
		}

		//generate base perlin noise map. Interfaces with the Stefan Gustavson Perlin Noise class.
		this.raw_data = gen_noise_map(this.size[0], this.size[1], this.settings.ISL_SCALE,this.settings.ISL_OCT,this.settings.ISL_PERSIST,this.settings.ISL_LAC*this.LAC_SCALE_DOWN,hash(this.seed), false);

		//Choose a random quadrant to place a village
		let TOWN_SPAWN_X, TOWN_SPAWN_Y;
		if(this.settings.HAS_TOWN === 0){
			TOWN_SPAWN_X = hash(this.seed-23)%2 === 0;
			TOWN_SPAWN_Y = hash(this.seed-24)%2 === 0;
		}

		//Initialize mask
		let mapMASK = new Array(this.size[0]);

		//Motu and styling
		let motu_noise, reef_noise;
		if(this.settings.HAS_MOTU){

			//Generate a separate noise map to generate motus with
			motu_noise =  gen_noise_map(this.size[0], this.size[1], this.settings.MOTU_SCALE,this.settings.MOTU_OCT,this.settings.MOTU_PERSIST,this.settings.MOTU_LAC,hash(this.seed+1));
			motu_noise = normalize_2d_array(motu_noise,-2,1);
		}
		if(this.settings.HAS_REEF){

			//Generate a separate noise map to generate reefs with
			reef_noise =  gen_noise_map(this.size[0], this.size[1], this.settings.REEF_SCALE,this.settings.REEF_OCT,this.settings.REEF_PERSIST,this.settings.REEF_LAC,hash(this.seed+2));
		}

		/*
			Main loop
			Loop over every x,y coordinate and manipulate each individual pixel
		*/
		for(let x=0;x<this.size[0];x++){
			mapMASK[x] = new Array(this.size[1]);
			for(let y=0;y<this.size[1];y++){

				//Normalize pixel
				this.raw_data[x][y] = normalize(this.raw_data[x][y], this.raw_data.minHeight, this.raw_data.maxHeight);

				//Lower height value for atolls
				if(this.settings.IS_ATOLL){
					this.raw_data[x][y] = normalize(this.raw_data[x][y], 0, 1.75);
				}

				//Raise the height value for larger islands
				else if(this.size[0] >= 512){
					this.raw_data[x][y] = normalize(this.raw_data[x][y], -0.5, 1);
				}

				//lower edges into the sea based on distance
				this.raw_data[x][y] *= region_dist(x,y,this.size[0],this.size[1]);

				//update mask
				if(this.raw_data[x][y] > this.settings.ISL_MASK[0] && this.raw_data[x][y] < this.settings.ISL_MASK[1]){
					mapMASK[x][y] = 1;
				}
				else if(this.raw_data[x][y] < this.settings.ISL_MASK[0]){
					mapMASK[x][y] = 0.5;
				}
				else if(this.raw_data[x][y] < 0.35){
					mapMASK[x][y] = 0.25;
				}
				else{
					mapMASK[x][y] = 0;
				}

				//Apply reef only styling
				if(this.settings.HAS_REEF && !this.settings.HAS_MOTU){

					//shrink visible land size
					if(this.raw_data[x][y]>this.settings.ISL_SHRK){
						this.raw_data[x][y]-=0.1;
					}

					//cut away lagoon
					if(this.raw_data[x][y] > this.settings.MOTU_GRAD[2] && this.raw_data[x][y] < this.settings.MOTU_GRAD[3]){
						this.raw_data[x][y] -= 0.15;
					}

					//cut away water outside motus
					if(mapMASK[x][y] === 0.5 && this.raw_data[x][y]<0.275){
						this.raw_data[x][y]=0.05;
					}
				}

				//apply motu styling
				if(this.settings.HAS_MOTU){

					//shrink visible land size
					if(this.raw_data[x][y]>this.settings.ISL_SHRK){
						this.raw_data[x][y]-=0.1;
					}

					//cut away lagoon
					if(this.raw_data[x][y] > this.settings.MOTU_GRAD[2] && this.raw_data[x][y] < this.settings.MOTU_GRAD[3]){
						this.raw_data[x][y] -= 0.15;
					}

					//raise motus
					else if(this.raw_data[x][y] > this.settings.MOTU_GRAD[0] && this.raw_data[x][y] < this.settings.MOTU_GRAD[1]){
						this.raw_data[x][y] += motu_noise[x][y]*0.2;
					}

					//raise water inside motus
					if(mapMASK[x][y] === 1){
						this.raw_data[x][y]+=0.1;
					}

					//cut away water outside motus
					else if(mapMASK[x][y] === 0.5 && this.raw_data[x][y]<0.275){
						this.raw_data[x][y]=0.05;
					}
				}

				//apply main reef styling
				if(this.settings.HAS_REEF){
					if(mapMASK[x][y] === 0.25){
						this.raw_data[x][y] += reef_noise[x][y] > 0.55 ? 0.15 : 0;
					}
				}

				//Apply volcano styling by raising high points higher
				if(this.settings.IS_VOLCANO){
					if(this.raw_data[x][y]>0.6){
						this.raw_data[x][y] *= (this.settings.HAS_MOTU||this.settings.HAS_REEF) ? 1.355 : 1.255;
					}
				}

				//normalize deep water to a constant
				if(this.raw_data[x][y]<0.1){
					this.raw_data[x][y] = 0.05;
				}

				//Update volcano/lava tracker
				if(this.raw_data[x][y]>0.925){
					this.has_volcano = true;
				}

				//Check for potential village generation spot
				if(this.settings.HAS_TOWN === 0){

					//Check if height is correct
					if(Math.abs(this.raw_data[x][y]-(STRUCTURE_META/100))<0.01 && ( TOWN_SPAWN_X ? (x > this.size[0]/2) : (x < this.size[0]/2) ) && ( TOWN_SPAWN_Y ? (y > this.size[1]/2) : (y < this.size[1]/2) ) ){

						//Spawn village
						this.settings.HAS_TOWN = -1;
						this.town = [x,y];
					}
				}
			}
		}

		//Generate objects
		this.objects = new Array();
		if(this.settings.HAS_TOWN === -1){

			//Generate village structures
			let town_buildings = this.settings.village_size;
			this.gen_obj(0,Island.numVillageGraphics,town_buildings,Math.max(6,Math.floor(this.settings.village_size/2)),Math.max(6,Math.floor(this.settings.village_size/2)),0.3,0.45,500,this.town[0],this.town[1]);

			//Set atleast one village object to be sprite 0
			if(this.objects.length <= 3 && this.objects.length > 0){
				this.objects[0][2] = 0;
			}
		}

		if(this.settings.HAS_TREES){

			//Generate trees
			let numTrees = this.settings.tree_amt;
			this.gen_obj(Island.shiftTreeGraphics,Island.numTreeGraphics,numTrees,-1,-1,0.35,0.4,700,Math.floor(this.size[0]/2),Math.floor(this.size[1]/2));

			//Generate small bushes
			let numPlants = Math.floor(this.settings.tree_amt/4);
			this.gen_obj(Island.shiftPlantGraphics,Island.numPlantGraphics,numPlants,-1,-1,0.375,0.425,700,Math.floor(this.size[0]/2),Math.floor(this.size[1]/2));
		}
	}

	/**
		Generates a set number of "objects", sprites at locations. Instead of returning, updates {@link objects}
		@param {number} graphicStart Index 0 of {@link graphics} to sample sprite from
		@param {number} graphicShift Index n of {@link graphics} to sample sprite from
		@param {number} numObj Number of objects to generate
		@param {number} spreadX X axis spread value. How far from objects must be from other objects. If set to -1, an optimal value is calculated based on sprite and pixel size.
		@param {number} spreadY Y axis spread value. How far from objects must be from other objects. If set to -1, an optimal value is calculated based on sprite and pixel size.
		@param {number} rangeMin Minimum height value prospective object spawn coordinates must be
		@param {number} rangeMax Maximum height value prospective object spawn coordinates must be
		@param {number} hashShift Hash seed
		@param {number} originX Origin x coordinate to spawn objects around
		@param {number} originY Origin y coordinate to spawn objects around
	*/
	gen_obj(graphicStart,graphicShift,numObj,spreadX,spreadY,rangeMin,rangeMax,hashShift,originX,originY){

		//Calculate optimum x and y spreads
		spreadX = (spreadX===-1 ? Math.floor(this.size[0]/SPRITE_SIZE/ISLAND_PIXEL_SCALE/2) : spreadX);
		spreadY = (spreadY===-1 ? Math.floor(this.size[1]/SPRITE_SIZE/ISLAND_PIXEL_SCALE/2) : spreadY);

		//Initialize
		let shift = 0;
		let obj_coord;
		let a,b,c;
		let len = this.objects.length;

		//Iterate once for every intended object
		for(let t=len;t<numObj+len;t++){

			//Repeatedly search for valid coordinates
			do{

				//Calculate prosepctive x coordinate
				a = hash(hash(this.seed-12)-(t+shift))%spreadX-Math.floor(spreadX/2);

				//Adjust x coordinate
				a =  originX+a*ISLAND_PIXEL_SCALE*SPRITE_SIZE;

				//Calculate prosepctive y coordinate
				b = hash(hash(this.seed-13)-(t+shift+hashShift))%spreadY-Math.floor(spreadY/2);

				//Adjust y coordinate
				b = originY+b*ISLAND_PIXEL_SCALE*SPRITE_SIZE;

				//Pick random sprite from selection
				c = hash(hash(this.seed-13)-(t+shift+hashShift))%graphicShift + graphicStart;
				this.objects[t] = [a,b,c];
				shift++;

				//Check range of coordinates
				if(a < 0 || a >= this.size[0]*3/4 || b < 0 || b >= this.size[1]*3/4){
					obj_coord = -1;
				}
				else{
					obj_coord = this.raw_data[a][b];
				}
			}

			//Continue looping on bad coordinate
			while((obj_coord > rangeMax || obj_coord < rangeMin || obj_coord===-1) && shift < 200 + numObj*2);

			//Remove last object if no valid coordinate was found
			if(shift >= numObj*2){
				this.objects.splice(t,this.objects.length-t);
				break;
			}

			//Set relavent shadow meta data for object
			this.cast_shadow(this.objects[t]);
		}
	}

	/**
		Sets relavent shadow meta data for objects. Instead of returning, updates {@link raw_data}
		@param {number[]} shadow Object data to cast shadow
	*/
	cast_shadow(shadow){

		//Ensure object can cast shadow
		if(Island.graphics[shadow[2]].shadowScale < 0.05){
			return;
		}

		//Draw diagnal line of predetermined width
		let scl = 3 / Island.graphics[shadow[2]].shadowScale;
		for(let x=Math.floor(Island.graphics[shadow[2]].width/(-1*scl));x<Math.floor(Island.graphics[shadow[2]].width/scl);x++){
			for(let y=Math.floor(Island.graphics[shadow[2]].height/(-1*scl));y<Math.floor(Island.graphics[shadow[2]].height/scl);y++){
				if(Math.abs(x+y) <= 2 ){

					//Salt data with structure meta data
					this.raw_data[shadow[0]+x][shadow[1]+y] += STRUCTURE_META;
				}
			}
		}
	}

	/**
		Bakes a diagnal pixel strip of lighting data. Renders shadows by directly drawing semi-transparent black squares to a passed ctx img object.
		@param {number} maxsize Max distance of rendered strip
		@param {number} y Y coordinate in world to start strip from
		@param {object} ctx_img A 2d context to directly render shadows to.
	*/
	bake_strip(maxsize, y, ctx_img){

		//Initialization
		let peak, nextpeak, h, hn, xx,yy;
		peak = undefined;
		nextpeak = undefined;

		//Iterate along the ray
		for(let x=0;x<maxsize;x+=ISLAND_PIXEL_SCALE){

			//Calculate ray coordinates
			xx = Math.floor(x/ISLAND_PIXEL_SCALE);
			yy = Math.floor(y/ISLAND_PIXEL_SCALE) + xx;

			//Bounds checks
			if(xx+1 >= this.raw_data.size || xx <= 0 || this.raw_data===undefined || this.raw_data[xx+1] ===undefined || yy+1 >= this.raw_data[xx+1].size || yy <= 0 ){
				continue;
			}

			//Looks up height data for current pixel as well as next pixel for comparison
			h = this.raw_data[xx][yy];
			hn = this.raw_data[xx+1][yy+1];

			//Compares pixels to check if pixel is a peak that should cast shadows
			if(colour_round(h) > colour_round(hn) && (colour_round(hn) > 2 || colour_round(h)===4)){
				nextpeak = [xx*ISLAND_PIXEL_SCALE,yy*ISLAND_PIXEL_SCALE,h];
			}

			//Check to see if pixel should have a shadow rendered
			if( peak!=undefined && (colour_round(peak[2]) > 2 && colour_round(peak[2]) > colour_round(h) || ( colour_round(peak[2])===4 && colour_round(h)===4)  )){

				//Render shadow pixel
				ctx_img.fillStyle = "rgba(0, 0, 0, "+get_lighting(peak,[xx*ISLAND_PIXEL_SCALE,yy*ISLAND_PIXEL_SCALE,h],this.settings.time)+")";
				ctx_img.fillRect(xx*ISLAND_PIXEL_SCALE,yy*ISLAND_PIXEL_SCALE,ISLAND_PIXEL_SCALE,ISLAND_PIXEL_SCALE);
			}
			peak = nextpeak;
		}
	}

	/**
		Generates the lighting canvas element. Instead of returning, updates {@link lighting_img}
	*/
	bake_lighting(){

		//Create canvas elements
		let ctx_img;
		this.lighting_img = document.createElement("canvas");
		this.lighting_img.width = this.size[0];
		this.lighting_img.height = this.size[1];
		ctx_img = this.lighting_img.getContext("2d");

		/*
			Bake each strip or ray.
			This is done in a separate function to allow for potential pseudo-multithreading. If lighting needs to be baked in real time, this function can be called on an interval, instead of directly in a loop.
		*/
		let maxsize = Math.max(this.size[0],this.size[1])-ISLAND_PIXEL_SCALE;
		for(let y=maxsize*-1;y<maxsize;y+=ISLAND_PIXEL_SCALE){
			this.bake_strip(maxsize,y, ctx_img);
		}
	}

	/**
		Renders base layer island to a ctx object
		@param {number} c colour to render
		@param {object} ctx_img 2d canvas context to render colour strips to
	*/
	gen_ctx_colour(c,ctx_img){

		//Set colour
		ctx_img.fillStyle = this.colours[c];

		//Iterate over rectangles
		for(let p=0;p<this.display_data[this.colours[c]].length;p++){

			//Render
			ctx_img.fillRect(this.display_data[this.colours[c]][p][0]*ISLAND_PIXEL_SCALE, this.display_data[this.colours[c]][p][1]*ISLAND_PIXEL_SCALE, this.display_data[this.colours[c]][p][3]*ISLAND_PIXEL_SCALE, this.display_data[this.colours[c]][p][2]*ISLAND_PIXEL_SCALE);
		}
	}

	/**
		Generates the base layer canvas element. Instead of returning, updates {@link canvas_img}
	*/
	gen_ctx_img(){

		//Create canvas element
		this.canvas_img = document.createElement('canvas');
		this.canvas_img.width = this.size[0];
		this.canvas_img.height = this.size[1];
		let ctx_img = this.canvas_img.getContext("2d");

		/*
			Render each colour.
			This is done in a separate function to allow for potential pseudo-multithreading. If rendering needs to be done in real time, this function can be called on an interval, instead of directly in a loop.
		*/
		for(let c=1;c<this.colours.length;c++){
			this.gen_ctx_colour(c,ctx_img);
		}
	}

	/**
		Compiles an entire island object into a static raw PNG datastream. This can be downloaded as a PNG file, or rendered directly through the browser, instead of going through the canvas interface.
		@param {boolean} objects If objects such as village structures and trees should be included
		@param {boolean} lighting If the lighting layer should be included
		@returns A static PNG datastream
	*/
	compileStaticImage(objects=true,lighting=false){

		//Create a temporary canvas element
		let saved_img=document.createElement("canvas");
		saved_img.width = this.size[0];
		saved_img.height = this.size[1];
		let img_ctx = saved_img.getContext("2d");

		//Fill background colour
		if(this.settings.colour_background){
			img_ctx.fillStyle = this.settings.DEEP_OCEAN;
			img_ctx.fillRect(0,0,this.size[0],this.size[1]);
		}

		//Render base layer
		img_ctx.drawImage(this.canvas_img,0,0);

		//Render lighting shadow layer
		if(lighting){
			img_ctx.drawImage(this.lighting_img,0,0);
		}

		//Render objects
		if(objects){
			img_ctx.drawImage(this.objects_img,0,0);
		}

		//Render lighting gradient overlay
		if(lighting){

			//Generate gradient through JS
			let grad = img_ctx.createLinearGradient(0,0,this.size[0],this.size[1]);
			grad.addColorStop(1, "#FF000040");
			grad.addColorStop(0.5, "#FF000080");
			grad.addColorStop(0, "#FFC922FF");

			//Draw
			img_ctx.globalAlpha = Math.max(this.settings.time-35,0)/120;
			img_ctx.fillStyle = grad;
			img_ctx.fillRect(0,0,this.size[0],this.size[1]);
		}

		//Convert canvas to a PNG datastream
		return saved_img.toDataURL("image/png").replace("image/png", "image/octet-stream");
	}

	/**
		Downloads an image of the island. Utilizes {@link downloadStaticPNG} and {@link compileStaticImage}
		@param {boolean} objects If objects such as village structures and trees should be included
		@param {boolean} lighting If the lighting layer should be included
	*/
	saveImage(objects=true,lighting=false){
		downloadStaticPNG(this.compileStaticImage(objects,lighting),this.name.replace(' ','-').replace('\'','')+".png");
	}

	/**
		Downloads an the lighting as a spritesheet. Utilizes {@link downloadStaticPNG} and {@link compileStaticBakedShadows}
		@param {boolean} objects If objects such as village structures and trees should be included
		@param {boolean} lighting If the lighting layer should be included
	*/
	saveBakedLighting(){
		downloadStaticPNG(this.compileStaticBakedShadows(),this.name.replace(' ','-').replace('\'','')+"-lighting.png");
	}

	/**
		Renders shadows out at an interval into a spritesheet
		@returns a static PNG datastream
	*/
	compileStaticBakedShadows(){

		//Create temporary canvas element for spritesheet
		let saved_img=document.createElement("canvas");
		saved_img.width = this.size[0]*10;
		saved_img.height = this.size[1];
		let img_ctx = saved_img.getContext("2d");

		//Iterate over time intervals and re-bake lighting for each, saving as a seprate frame
		for(let t=0;t<10;t++){
			this.settings.time=20+t*10;
			this.bake_lighting();
			img_ctx.drawImage(this.lighting_img,this.size[0]*t,0);
		}
		return saved_img.toDataURL("image/png").replace("image/png", "image/octet-stream");
	}
}

/**
	Storage for image sprites
	@type {object[]}
	@static
*/
Island.graphics = new Array();

//Set each image to a canvas image element
for(let img = 0; img<8; img++){
	Island.graphics[img] = new Image();

	//To bypass browser crossorigin security measures
	Island.graphics[img].origin="anonymous";
	Island.graphics[img].crossorigin="anonymous";
}

/**
	Number of sprites related to villages. For sorting purposes
	@type {number}
	@const
*/
Island.numVillageGraphics = 3;
Island.graphics[0].src = "assets/town/fale.png";
Island.graphics[0].shadowScale = 0.8;
Island.graphics[1].src = "assets/town/fale2.png";
Island.graphics[1].shadowScale = 0.8;
Island.graphics[2].src = "assets/town/stones.png";
Island.graphics[2].shadowScale = 0;
//Island.graphics[3].src = "assets/town/chief-fale.png";		//I just don't think this sprite I made looks any good
//Island.graphics[3].shadowScale = 0.8;

/**
	Number of sprites related to trees. For sorting purposes
	@type {number}
	@const
*/
Island.numTreeGraphics = 3;

/**
	Index of first sprite related to trees. For sorting purposes
	@type {number}
	@const
*/
Island.shiftTreeGraphics = 4;
Island.graphics[4].src = "assets/trees/coconut-tree.png";
Island.graphics[4].shadowScale = 1;
Island.graphics[5].src = "assets/trees/coconut-tree2.png";
Island.graphics[5].shadowScale = 1;
Island.graphics[6].src = "assets/trees/coconut-tree3.png";
Island.graphics[6].shadowScale = 1;

/**
	Number of sprites related to plants. For sorting purposes
	@type {number}
	@const
*/
Island.numPlantGraphics = 1;

/**
	Index of first sprite related to plants. For sorting purposes
	@type {number}
	@const
*/
Island.shiftPlantGraphics = 7;
Island.graphics[7].src = "assets/trees/taro.png";
Island.graphics[7].shadowScale = 0.25;
