

//------------------------------------HELPER FUNCTIONS--------------------------------------



function dist(x,y,w,h){
	return Math.max(normalize(0.5-Math.sqrt(Math.pow(Math.abs(0.5-(x/w)),2)+Math.pow(Math.abs(0.5-(y/h)),2)),0,0.5),0);
}


/**
	Generates a random integer between min_b and max_b inclusively
	@param {number} min_b Minimum bound
	@param {number} max_b Maximum bound
	@returns {number} Random integer min_b <= num <= max_b
*/
function ran_b(min_b,max_b){
	return Math.floor( min_b + Math.random()*((max_b-min_b)+1) );
}



//nomralize a value to between 0 and 1 based on min and max
function normalize(val, min, max){
	return (val-min)/(max-min);
}

//nomralize a 2d array to between 0 and 1 based on min and max
function normalize_2d_array(arr,minHeight,maxHeight){
	for(let x=0;x<arr.length;x++){
		for(let y=0;y<arr[x].length;y++){
			arr[x][y] = normalize(arr[x][y],minHeight, maxHeight);
		}
	}
	return arr;
}




function gen_noise_map(width, height, scale, oct, persist, lac, seed, normalize=true){
	noise.seed(seed);

	let xx,yy;
	let map = new Array(width);

	let maxHeight = Number.NEGATIVE_INFINITY;
	let minHeight = Number.POSITIVE_INFINITY;

	for(let x=0;x<width;x++){
		map[x] = new Array(height);
		for(let y=0;y<height;y++){

			//initialize
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
	if(!normalize){
		map.minHeight = minHeight;
		map.maxHeight = maxHeight;
	}

	//normalize
	return normalize ? normalize_2d_array(map,minHeight,maxHeight) : map;
}


function rgb(r,g,b){
	return "rgb("+r+", "+g+", "+b+")";
}

function hash_arr(arr){
	let hash = 0x12345678;

	while (arr.length > 0) {
		hash ^= (hash << 16) | (hash << 19);
		hash += arr.pop();
		hash ^= (hash << 26) | (hash << 13);
	}
	return Math.abs(hash);
}

function hash(num){
	let hash = 0x12345678;

	while (num > 0) {
		hash ^= (hash << 16) | (hash << 19);
		hash += num % 10;
		hash ^= (hash << 26) | (hash << 13);
		num = num / 10;
	}
	return Math.abs(hash);
}


function get_lighting(peak,coord,time=LIGHTING_DISTANCE){
	let val0 = (is_town(peak[2]) ? remove_town(peak[2]) : peak[2]);
	let val1 = (is_town(coord[2]) ? remove_town(coord[2]) : coord[2]);
	return (val0-val1+0.2)*(1-(Math.pow(pixel_distance(peak,coord),1.25)/time));
}
function pixel_distance(peak,coord){
	return Math.sqrt(Math.pow(coord[0]-peak[0],2)+Math.pow(coord[1]-peak[1],2));
}

function colour_round(colour){
	if(is_town(colour)){
		return 4;
	}
	else if(colour <0.1){
		return 0;
	}
	else if(colour <0.3){
		return 1;
	}
	else if(colour  < 0.35){
		return 2;
	}
	else if(colour  < 0.45){
		return 3;
	}
	else if(colour  < 0.6){
		return 5;
	}
	else if(colour  < 0.75){
		return 6;
	}
	else if(colour < 0.9 && colour > 0.89){
		return 9;
	}
	else if(colour < 0.925){
		return 8;
	}
	return 7;
}

function is_town(val){
	return (Math.floor(val)%TOWN_HEIGHT === 0 && Math.floor(val) > 0);
}

function remove_town(val){
	while(val > TOWN_HEIGHT){
		val -= TOWN_HEIGHT;
	}
	return val;
}


//-------------------------------------ISLAND CLASS------------------------------------------

const MOTU_GRAD = [0.075,0.15,0.15,0.25];
const ISL_SHRK = 0.25;
const ISL_MASK = [0.15,0.2];

const MOTU_SCALE = 500;
const MOTU_OCT = 1;
const MOTU_PERSIST = 2;
const MOTU_LAC = 0.95;

const REEF_SCALE = 50;
const REEF_OCT = 1;
const REEF_PERSIST = 2;
const REEF_LAC = 0.95;

//const ISL_SCALE = 25;
const ISL_OCT = 8;
//const ISL_PERSIST = 2;
//const ISL_LAC = 0.7;

const ISLAND_PIXEL_SCALE = 4;


const TOWN_HEIGHT = 36;
const SPRITE_SIZE = 8;

var LIGHTING_DISTANCE = 15;





class IslandSettings{
	constructor(seed=Math.random()*1000000){
		this.seed=seed;
		this.name = NAMES_LIST[hash(this.seed*this.seed)%NAMES_LIST.length];
		this.size_x = 2048;
		this.size_y = 2048;


		this.colour_background = true;
		this.DEEP_OCEAN = "#000770";
		this.SHALLOW_OCEAN = "#0C49AC";
		this.LAND_ONE = "#587E31";
		this.LAND_TWO = "#274C00";
		this.LAND_THREE = "#173600";
		this.BEACH = "#D0AB76";
		this.ROCK_ONE = "#959688";
		this.ROCK_TWO = "#626354";
		this.LAVA_ONE = "darkred";
		this.LAVA_TWO = "orange";
		this.VILLAGE = "#654321";
		this.time = 10;

		this.HAS_MOTU = this.seed%2 === 0;
		this.HAS_REEF = this.seed%4 === 0;
		this.IS_ATOLL = this.seed%2 === 0 && hash(this.seed-100)%4 === 0;
		this.IS_VOLCANO =this.seed%2 === 1 && hash(this.seed-66)%4 === 0;

		this.HAS_TOWN = 0;
		this.village_size = 6;
		this.HAS_TREES = true;
		this.tree_amt = 500;

		this.ISL_PERSIST = 2;
		this.ISL_LAC = 0.75;
		this.ISL_SCALE = 25;



	}
}


class Island{
	constructor(settings, LAC_SCALE_DOWN=1) {

		this.colours = [settings.DEEP_OCEAN, settings.SHALLOW_OCEAN, settings.LAND_ONE, settings.LAND_TWO, settings.LAND_THREE, settings.BEACH, settings.VILLAGE, settings.ROCK_ONE, settings.ROCK_TWO, settings.LAVA_ONE, settings.LAVA_TWO];

		this.DEEP_OCEAN = settings.DEEP_OCEAN
		this.SHALLOW_OCEAN = settings.SHALLOW_OCEAN;
		this.LAND_ONE = settings.LAND_ONE;
		this.LAND_TWO = settings.LAND_TWO;
		this.LAND_THREE = settings.LAND_THREE;
		this.BEACH = settings.BEACH;
		this.ROCK_ONE = settings.ROCK_ONE;
		this.ROCK_TWO = settings.ROCK_TWO;
		this.LAVA_ONE = settings.LAVA_ONE;
		this.LAVA_TWO = settings.LAVA_TWO;
		this.VILLAGE = settings.VILLAGE;
		this.colour_background = settings.colour_background;
		this.photo_time = settings.time;

		this.HAS_MOTU = settings.HAS_MOTU;
		this.HAS_REEF = settings.HAS_REEF;
		this.IS_ATOLL = settings.IS_ATOLL;
		this.IS_VOLCANO = settings.IS_VOLCANO;

		this.HAS_TOWN = settings.HAS_TOWN;
		this.village_size = settings.village_size;
		this.HAS_TREES = settings.HAS_TREES;
		this.tree_amt = settings.tree_amt;

		this.ISL_PERSIST = settings.ISL_PERSIST;
		this.ISL_LAC = settings.ISL_LAC;
		this.ISL_SCALE = settings.ISL_SCALE;

		this.raw_data;
		this.display_data;


		this.canvas_img;

		this.lighting_img;

		this.replicable_seed = settings.seed;
		this.seed = hash(settings.seed);

		this.town = [-1,-1];

		this.has_volcano = false;
		this.name = settings.name;


		this.size = [settings.size_x,settings.size_y];

		this.LAC_SCALE_DOWN = LAC_SCALE_DOWN;



		this.gen_island_data();
		this.raw_data = this.compress(ISLAND_PIXEL_SCALE);
		this.gen_display_data(this.raw_data);
		this.gen_ctx_img();
		this.gen_objects_img();
		this.bake_lighting();
	}
	compress(factor){
		if(factor===1){
			return this.raw_data;
		}



		const n_x = Math.floor(this.raw_data.length/factor);
		const n_y = Math.floor(this.raw_data[0].length/factor);

		let comp = new Array(n_x);
		for(let i=0;i<n_x;i++){
			comp[i] = new Array(n_y);
			for(let j=0;j<n_y;j++){
				comp[i][j] = 0;
			}
		}

		for(let x=0;x<n_x;x++){
			for(let y=0;y<n_y;y++){
				for(let xx=0;xx<factor;xx++){
					for(let yy=0;yy<factor;yy++){
						comp[x][y] = Math.max(this.raw_data[x*factor+xx][y*factor+yy], comp[x][y]);
					}
				}
			}
		}
		return comp;
	}

	gen_display_data(raw_data){

		this.display_data = new Array();

		//lightblue
		this.display_data[this.SHALLOW_OCEAN] = new Array();

		//green
		this.display_data[this.LAND_ONE] = new Array();

		//green
		this.display_data[this.LAND_TWO] = new Array();

		//green
		this.display_data[this.LAND_THREE] = new Array();

		//beach
		this.display_data[this.BEACH] = new Array();

		//town
		this.display_data[this.VILLAGE] = new Array();

		//mountain
		this.display_data[this.ROCK_ONE] = new Array();
		this.display_data[this.ROCK_TWO] = new Array();

		//volcano
		this.display_data[this.LAVA_ONE] = new Array();
		this.display_data[this.LAVA_TWO] = new Array();

		let adjusted_height;
		for(let x=0;x<raw_data.length;x++){
			for(let y=0;y<raw_data[0].length;y++){

				adjusted_height = (is_town(raw_data[x][y]) ? remove_town(raw_data[x][y]) : raw_data[x][y] );

				if(adjusted_height<0.1){
					continue;
				}
				else if(adjusted_height<0.3){
					this.display_data[this.SHALLOW_OCEAN].push([x,y]);
				}
				else if(adjusted_height < 0.35){
					this.display_data[this.BEACH].push([x,y]);
				}
				else if(adjusted_height < 0.45){
					this.display_data[this.LAND_ONE].push([x,y]);
				}
				else if(adjusted_height < 0.6){
					this.display_data[this.LAND_TWO].push([x,y]);
				}
				else if(adjusted_height < 0.75){
					this.display_data[this.LAND_THREE].push([x,y]);
				}
				else if(adjusted_height < 0.9 && adjusted_height > 0.89){
					this.display_data[this.ROCK_ONE].push([x,y]);
				}
				else if(adjusted_height < 0.925){
					this.display_data[this.ROCK_TWO].push([x,y]);
				}
				else if(adjusted_height < 1.1){
					this.display_data[this.LAVA_ONE].push([x,y]);
				}
				else{
					this.display_data[this.LAVA_TWO].push([x,y]);
				}
			}
		}

		this.optimize_display_data();
	}

	optimize_display_data(){
		let temp, strip, amt;

		for(let c=1;c<this.colours.length;c++){
			temp = new Array();
			for(let p=0;p<this.display_data[this.colours[c]].length;p++){
				strip = [this.display_data[this.colours[c]][p][0],this.display_data[this.colours[c]][p][1]];
				amt = 1;
				for(;p<this.display_data[this.colours[c]].length-1;p++){
					if(this.display_data[this.colours[c]][p][0] === this.display_data[this.colours[c]][p+1][0] &&
					this.display_data[this.colours[c]][p][1]+1 === this.display_data[this.colours[c]][p+1][1]){
						amt++;
					}
					else{
						break;
					}
				}
				strip.push(amt);
				strip.push(1);
				temp.push(strip);
			}
			this.display_data[this.colours[c]] = temp;
		}
	}

	gen_objects_img(){
		this.objects_img = document.createElement('canvas');
		this.objects_img.width = this.size[0];
		this.objects_img.height = this.size[1];

		let ctx_img = this.objects_img.getContext("2d");
		if(this.town != undefined && this.town.length === 2 && this.objects!=undefined){
			for(let b=0; b < this.objects.length; b++){
				ctx_img.drawImage(Island.graphics[this.objects[b][2]], this.objects[b][0] - Island.graphics[this.objects[b][2]].width/2, this.objects[b][1] - Island.graphics[this.objects[b][2]].height/2, Island.graphics[this.objects[b][2]].width, Island.graphics[this.objects[b][2]].height);
			}
		}
	}

	//25,8,8,0.75
	gen_island_data(){

		if(this.IS_ATOLL){
			this.LAC_SCALE_DOWN = 0.8;
		}
		else if(this.IS_VOLCANO){
			this.LAC_SCALE_DOWN = 0.925;
		}

		//generate base map
		this.raw_data = gen_noise_map(this.size[0], this.size[1], this.ISL_SCALE,ISL_OCT,this.ISL_PERSIST,this.ISL_LAC*this.LAC_SCALE_DOWN,hash(this.seed), false);




		let TOWN_SPAWN_X, TOWN_SPAWN_Y;
		if(this.HAS_TOWN === 0){
			TOWN_SPAWN_X = hash(this.seed-23)%2 === 0;
			TOWN_SPAWN_Y = hash(this.seed-24)%2 === 0;
		}

		let mapMASK = new Array(this.size[0]);

		//Motu and styling
		let motu_noise, reef_noise;

		if(this.HAS_MOTU){
			motu_noise =  gen_noise_map(this.size[0], this.size[1], MOTU_SCALE,MOTU_OCT,MOTU_PERSIST,MOTU_LAC,hash(this.seed+1));
			motu_noise = normalize_2d_array(motu_noise,-2,1);
		}
		if(this.HAS_REEF){
			reef_noise =  gen_noise_map(this.size[0], this.size[1], REEF_SCALE,REEF_OCT,REEF_PERSIST,REEF_LAC,hash(this.seed+2));
		}

		let seed_scale = normalize(hash(this.seed+3)%250+750,0,1000);

		for(let x=0;x<this.size[0];x++){
			mapMASK[x] = new Array(this.size[1]);
			for(let y=0;y<this.size[1];y++){

				this.raw_data[x][y] = normalize(this.raw_data[x][y], this.raw_data.minHeight, this.raw_data.maxHeight);

				if(this.IS_ATOLL){
					//Lower the height
					this.raw_data[x][y] = normalize(this.raw_data[x][y], 0, 1.75);
				}
				else if(this.size[0] >= 512){
					//Raise the height
					this.raw_data[x][y] = normalize(this.raw_data[x][y], -0.5, 1);
				}




				//lower edges
				this.raw_data[x][y] *= dist(x,y,this.size[0],this.size[1]);

				//update mask
				if(this.raw_data[x][y] > ISL_MASK[0] && this.raw_data[x][y] < ISL_MASK[1]){
					mapMASK[x][y] = 1;
				}
				else if(this.raw_data[x][y] < ISL_MASK[0]){
					mapMASK[x][y] = 0.5;
				}
				else if(this.raw_data[x][y] < 0.35){
					mapMASK[x][y] = 0.25;
				}
				else{
					mapMASK[x][y] = 0;
				}


				if(this.HAS_REEF && !this.HAS_MOTU){
					//shrink visible land size
					if(this.raw_data[x][y]>ISL_SHRK){
						this.raw_data[x][y]-=0.1;
					}
					//cut away lagoon
					if(this.raw_data[x][y] > MOTU_GRAD[2] && this.raw_data[x][y] < MOTU_GRAD[3]){
						this.raw_data[x][y] -= 0.15;
					}

					//cut away water outside motus
					if(mapMASK[x][y] === 0.5 && this.raw_data[x][y]<0.275){
						this.raw_data[x][y]=0.05;
					}
				}

				//apply motu styling
				if(this.HAS_MOTU){

					//shrink visible land size
					if(this.raw_data[x][y]>ISL_SHRK){
						this.raw_data[x][y]-=0.1;
					}

					//cut away lagoon
					if(this.raw_data[x][y] > MOTU_GRAD[2] && this.raw_data[x][y] < MOTU_GRAD[3]){
						this.raw_data[x][y] -= 0.15;
					}

					//raise motus
					else if(this.raw_data[x][y] > MOTU_GRAD[0] && this.raw_data[x][y] < MOTU_GRAD[1]){
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

				//apply reef
				if(this.HAS_REEF){
					if(mapMASK[x][y] === 0.25){
						this.raw_data[x][y] += reef_noise[x][y] > 0.55 ? 0.15 : 0;
					}
				}

				if(this.IS_VOLCANO){
					if(this.raw_data[x][y]>0.6){
						this.raw_data[x][y] *= (this.HAS_MOTU||this.HAS_REEF) ? 1.35 : 1.25;
					}
				}

				//normalize deep water
				if(this.raw_data[x][y]<0.1){
					this.raw_data[x][y] = 0.05;
				}

				if(this.raw_data[x][y]>0.925){
					this.has_volcano = true;
				}

				if(this.HAS_TOWN === 0){
					if(Math.abs(this.raw_data[x][y]-(TOWN_HEIGHT/100))<0.01 && ( TOWN_SPAWN_X ? (x > this.size[0]/2) : (x < this.size[0]/2) ) && ( TOWN_SPAWN_Y ? (y > this.size[1]/2) : (y < this.size[1]/2) ) ){
						this.HAS_TOWN = -1;
						this.town = [x,y];
					}
				}
			}
		}
		this.objects = new Array();
		if(this.HAS_TOWN === -1){
			let town_buildings = this.village_size;
			this.gen_obj(0,Island.numVillageGraphics,town_buildings,Math.max(6,Math.floor(this.village_size/2)),Math.max(6,Math.floor(this.village_size/2)),0.3,0.45,500,this.town[0],this.town[1]);

			if(this.objects.length <= 3 && this.objects.length > 0){
				this.objects[0][2] = 0;
			}
		}

		if(this.HAS_TREES){
			let numTrees = this.tree_amt;
			this.gen_obj(Island.shiftTreeGraphics,Island.numTreeGraphics,numTrees,-1,-1,0.35,0.4,700,Math.floor(this.size[0]/2),Math.floor(this.size[1]/2));

			let numPlants = Math.floor(this.tree_amt/4);
			this.gen_obj(Island.shiftPlantGraphics,Island.numPlantGraphics,numPlants,-1,-1,0.375,0.425,700,Math.floor(this.size[0]/2),Math.floor(this.size[1]/2));
		}




	}

	gen_obj(graphicStart,graphicShift,numObj,spreadX,spreadY,rangeMin,rangeMax,hashShift,originX,originY){
		spreadX = (spreadX===-1 ? Math.floor(this.size[0]/SPRITE_SIZE/ISLAND_PIXEL_SCALE/2) : spreadX);
		spreadY = (spreadY===-1 ? Math.floor(this.size[1]/SPRITE_SIZE/ISLAND_PIXEL_SCALE/2) : spreadY);
		let shift = 0;
		let obj_coord;
		let a,b,c;
		let len = this.objects.length;
		for(let t=len;t<numObj+len;t++){
			do{
				a = hash(hash(this.seed-12)-(t+shift))%spreadX-Math.floor(spreadX/2);
				a =  originX+a*ISLAND_PIXEL_SCALE*SPRITE_SIZE;
				b = hash(hash(this.seed-13)-(t+shift+hashShift))%spreadY-Math.floor(spreadY/2);
				b = originY+b*ISLAND_PIXEL_SCALE*SPRITE_SIZE;
				c = hash(hash(this.seed-13)-(t+shift+hashShift))%graphicShift + graphicStart;
				this.objects[t] = [a,b,c];
				shift++;
				if(a < 0 || a >= this.size[0]*3/4 || b < 0 || b >= this.size[1]*3/4){
					obj_coord = -1;
				}
				else{
					obj_coord = this.raw_data[a][b];
				}
			}
			while((obj_coord > rangeMax || obj_coord < rangeMin || obj_coord===-1) && shift < 200 + numObj*2);
			if(shift >= numObj*2){
				this.objects.splice(t,this.objects.length-t);
				break;
			}
			this.cast_shadow(this.objects[t]);
		}
	}

	cast_shadow(shadow){
		if(Island.graphics[shadow[2]].shadowScale < 0.05){
			return;
		}

		let scl = 3 / Island.graphics[shadow[2]].shadowScale;
		for(let x=Math.floor(Island.graphics[shadow[2]].width/(-1*scl));x<Math.floor(Island.graphics[shadow[2]].width/scl);x++){
			for(let y=Math.floor(Island.graphics[shadow[2]].height/(-1*scl));y<Math.floor(Island.graphics[shadow[2]].height/scl);y++){
				if(Math.abs(x+y) <= 2 ){
					this.raw_data[shadow[0]+x][shadow[1]+y] += TOWN_HEIGHT;
				}
			}
		}
	}

	bake_strip(maxsize, y, ctx_img){
		let peak, nextpeak, h, hn, xx,yy;

		peak = undefined;
		nextpeak = undefined;
		for(let x=0;x<maxsize;x+=ISLAND_PIXEL_SCALE){
			xx = Math.floor(x/ISLAND_PIXEL_SCALE);
			yy = Math.floor(y/ISLAND_PIXEL_SCALE) + xx;

			if(xx+1 >= this.raw_data.size || xx <= 0 || this.raw_data===undefined || this.raw_data[xx+1] ===undefined || yy+1 >= this.raw_data[xx+1].size || yy <= 0 ){
				continue;
			}

			h = this.raw_data[xx][yy];
			hn = this.raw_data[xx+1][yy+1];



			if(colour_round(h) > colour_round(hn) && (colour_round(hn) > 2 || colour_round(h)===4)){
				nextpeak = [xx*ISLAND_PIXEL_SCALE,yy*ISLAND_PIXEL_SCALE,h];
			}

			if( peak!=undefined && (colour_round(peak[2]) > 2 && colour_round(peak[2]) > colour_round(h) || ( colour_round(peak[2])===4 && colour_round(h)===4)  )){
				ctx_img.fillStyle = "rgba(0, 0, 0, "+get_lighting(peak,[xx*ISLAND_PIXEL_SCALE,yy*ISLAND_PIXEL_SCALE,h],this.photo_time)+")";
				ctx_img.fillRect(xx*ISLAND_PIXEL_SCALE,yy*ISLAND_PIXEL_SCALE,ISLAND_PIXEL_SCALE,ISLAND_PIXEL_SCALE);
			}
			peak = nextpeak;
		}
	}


	bake_lighting(){
		let ctx_img;
		this.lighting_img = document.createElement('canvas');
		this.lighting_img.width = this.size[0];
		this.lighting_img.height = this.size[1];
		ctx_img = this.lighting_img.getContext("2d");

		let maxsize = Math.max(this.size[0],this.size[1])-ISLAND_PIXEL_SCALE;

		for(let y=maxsize*-1;y<maxsize;y+=ISLAND_PIXEL_SCALE){
			this.bake_strip(maxsize,y, ctx_img);
		}
	}

	gen_ctx_colour(c,ctx_img){
		ctx_img.fillStyle = this.colours[c];
		for(let p=0;p<this.display_data[this.colours[c]].length;p++){
			ctx_img.fillRect(this.display_data[this.colours[c]][p][0]*ISLAND_PIXEL_SCALE, this.display_data[this.colours[c]][p][1]*ISLAND_PIXEL_SCALE, this.display_data[this.colours[c]][p][3]*ISLAND_PIXEL_SCALE, this.display_data[this.colours[c]][p][2]*ISLAND_PIXEL_SCALE);
		}
	}


	gen_ctx_img(){
		this.canvas_img = document.createElement('canvas');

		this.canvas_img.width = this.size[0];
		this.canvas_img.height = this.size[1];
		let ctx_img = this.canvas_img.getContext("2d");

		for(let c=1;c<this.colours.length;c++){
			this.gen_ctx_colour(c,ctx_img);
		}
	}

	compileStaticImage(objects=true,lighting=false){
		let saved_img=document.createElement("canvas");
		saved_img.width = this.size[0];
		saved_img.height = this.size[1];
		let img_ctx = saved_img.getContext("2d");


		if(this.colour_background){
			img_ctx.fillStyle = this.DEEP_OCEAN;
			img_ctx.fillRect(0,0,this.size[0],this.size[1]);
		}

		img_ctx.drawImage(this.canvas_img,0,0);


		if(lighting){
			img_ctx.drawImage(this.lighting_img,0,0);
		}
		if(objects){
			img_ctx.drawImage(this.objects_img,0,0);
		}
		if(lighting){
			let grad = img_ctx.createLinearGradient(0,0,this.size[0],this.size[1]);
			grad.addColorStop(1, "#FF000040");
			grad.addColorStop(0.5, "#FF000080");
			grad.addColorStop(0, "#FFC922FF");

			img_ctx.globalAlpha = Math.max(this.photo_time-35,0)/120;
			img_ctx.fillStyle = grad;
			img_ctx.fillRect(0,0,this.size[0],this.size[1]);

		}

		return saved_img.toDataURL("image/png").replace("image/png", "image/octet-stream");
	}

	saveImage(objects=true,lighting=false){

		let saved_img = this.compileStaticImage(objects,lighting);

		var link = document.createElement('a');
		link.setAttribute("download",this.name.replace(' ','-').replace('\'','')+".png");
		link.setAttribute('href', saved_img);
		link.click();
	}
}



Island.graphics = new Array();
for(let img = 0; img<8; img++){
	Island.graphics[img] = new Image();
	Island.graphics[img].origin="anonymous";
	Island.graphics[img].crossorigin="anonymous";
}


Island.numVillageGraphics = 3;
Island.graphics[0].src = "assets/town/fale.png";
Island.graphics[0].shadowScale = 0.8;
Island.graphics[1].src = "assets/town/fale2.png";
Island.graphics[1].shadowScale = 0.8;
Island.graphics[2].src = "assets/town/stones.png";
Island.graphics[2].shadowScale = 0;
//Island.graphics[3].src = "assets/town/chief-fale.png";
//Island.graphics[3].shadowScale = 0.8;

Island.numTreeGraphics = 3;
Island.shiftTreeGraphics = 4;
Island.graphics[4].src = "assets/trees/coconut-tree.png";
Island.graphics[4].shadowScale = 1;
Island.graphics[5].src = "assets/trees/coconut-tree2.png";
Island.graphics[5].shadowScale = 1;
Island.graphics[6].src = "assets/trees/coconut-tree3.png";
Island.graphics[6].shadowScale = 1;

Island.numPlantGraphics = 1;
Island.shiftPlantGraphics = 7;
Island.graphics[7].src = "assets/trees/taro.png";
Island.graphics[7].shadowScale = 0.25;
