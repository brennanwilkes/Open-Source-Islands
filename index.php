<?php
	ini_set('display_errors', 1);
	error_reporting(E_ALL);

	require_once 'php/backend.php';
	require_once 'php/access/config.php';

	$pdo = db_connect();

	if($_SERVER["REQUEST_METHOD"] == "POST" && !isset($_GET["isLandCopy"])){
		handle_submit();
	}

?><!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Open Source Islands</title>
		<link rel="stylesheet" href="css/styles.css">
		<link rel="icon" href="icon.png" type="image/icon type">


		<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Ubuntu:wght@300&Inconsolata:wght@300display=swap" rel="stylesheet">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

		<script type="text/javascript" src="js/island-generator/name_list.js"></script>
		<script type="text/javascript" src="js/island-generator/perlin-noise/Stefan-Gustavson-Perlin.js"></script>
		<script type="text/javascript" src="js/island-generator/island.js"></script>
		<script type="text/javascript" src="js/osi.js"></script>
	</head>
	<body>
		<div id=backgroundDisplay class=backgroundIsland><div class=lighting></div><div class=baselayer></div></div>
		<main>
			<form method="post">
				<nav class=page>
					<h1 id=osi>Open Source Islands</h1>
					<button type=button id=generator>Generator</button>
					<button type=button id=gallery>Gallery</button>
					<button type=button id=documentation>Documentation</button>
					<button type=button id=about>About</button>
				</nav>
				<div class=page style="display: none">
					<h1>Properties</h1>
					<div>
						<label for="name">Name</label>
						<input
							type="text"
							id="name"
							name="name"
							pattern="^[a-zA-Z \-']*$|^$"
							placeholder="%random%">
					</div>
					<div>
						<label for="seed">Seed</label>
						<input
							type="text"
							pattern="^[0-9.]*$|^$"
							id="seed"
							name="seed"
							placeholder="%random%">
					</div>

					<div>
						<label for="reef">Reef</label>
						<input type="checkbox" id="reef" name="reef" value="true">
					</div>

					<div>
						<label for="motu">Motu</label>
						<input type="checkbox" id="motu" name="motu" value="true">
					</div>

					<div>
						<label for="atoll">Atoll</label>
						<input type="checkbox" id="atoll" name="atoll" value="true">
					</div>

					<div>
						<label for="volcano">Volcano</label>
						<input type="checkbox" id="volcano" name="volcano" value="true">
					</div>

					<div>
						<label for="village">Village</label>
						<input type="checkbox" id="village" name="village" value="true" checked>
					</div>

					<div>
						<label for="trees">Trees</label>
						<input type="checkbox" id="trees" name="trees" value="true" checked>
					</div>

					<div>
						<input type="button" value="home" class=home>
						<input type="button" value="next">
					</div>
				</div>
				<div class=page style="display: none">
					<h1>Generation</h1>

					<div>
						<label for="scale">Scale</label>
						<input type="range" min="5" max="60" value="20" name="scale" id="scale">
					</div>

					<div>
						<label for="persistence">Persistence</label>
						<input type="range" min="5" max="40" value="20" name="persistence" id="persistence">
					</div>

					<div>
						<label for="lacunarity">Lacunarity</label>
						<input type="range" min="50" max="95" value="80" name="lacunarity" id="lacunarity">
					</div>

					<div>
						<label for="village_size">Village Size</label>
						<input type="range" min="2" max="25" value="6" name="village_size" id="village_size">
					</div>

					<div>
						<label for="tree_amt">Tree Density</label>
						<input type="range" min="5" max="100" value="50" name="tree_amt" id="tree_amt">
					</div>

					<div>
						<input type="button" value="back">
						<input type="button" value="next">
					</div>
				</div>
				<div class=page  style="display: none">
					<h1>Colours</h1>

					<div>
						<label for="background">Background</label>
						<input type="checkbox" id="background" name="background" value="true" checked>
					</div>

					<div>
						<label for="ocean">Background</label>
						<input type="color" value="#0C1A5F" name="ocean" id="ocean">
					</div>
					<div>
						<label for="shallows">Shallows</label>
						<input type="color" value="#0C49AC" name="shallows" id="shallows">
					</div>
					<div>
						<label for="beach">Beach</label>
						<input type="color" value="#D0AB76" name="beach" id="beach">
					</div>
					<div class=tri>
						<label for="ground1">Ground</label>
						<input type="color" value="#587E31" name="ground1" id="ground1">
						<input type="color" value="#274C00" name="ground2" id="ground2">
						<input type="color" value="#173600" name="ground3" id="ground3">
					</div>

					<div class=dual>
						<label for="rock1">Rock</label>
						<input type="color" value="#959688" name="rock1" id="rock1">
						<input type="color" value="#626354" name="rock2" id="rock2">

					</div>

					<div class=dual>
						<label for="lava1">Lava</label>
						<input type="color" value="#8B0000" name="lava1" id="lava1">
						<input type="color" value="#FFA500" name="lava2" id="lava2">
					</div>

					<div>
						<label for="time">Sunset</label>
						<input type="range" min="20" max="120" value="20" name="time" id="time">
					</div>

					<div>
						<input type="button" value="back">
						<input type="button" value="Compile" id="compile">
					</div>
				</div>
				<div class=page  style="display: none">
					<h1>Compiling</h1>
					<div id=loading-container>
						<div id=loading-circle>
							<div class="Albatross sprite" id=loading-anim><div></div></div>
						</div>
					</div>
				</div>
				<div class=page  style="display: none">
					<h1>Preview</h1>
					<img id=preview_display>
					<div>
						<input type="button" value="Edit" id="edit">
						<input type="button" value="New Seed" id="recompile">
					</div>
					<div>
						<input type="button" value="Home" class=home>
						<input type="button" value="Save" id="save">
					</div>
					<input type="submit" value="Submit">
				</div>
				<div class=page id=gal style="display: none">
					<h1>Island Gallery</h1>
					<div>
						<?php
							get_images();
						?>
					</div>
					<button type=button class=home>Home</button>
				</div>
				<div class=page id=gallery-preview  style="display: none">
					<h1></h1>
					<img>
					<div>
						<input type="button" value="back">
						<input type="button" value="Edit" id="copy">
					</div>
				</div>
				<div class=page  style="display: none">
					<h1 id=doc>Documentation</h1>
					<button type=button id=devnotes>Developer Notes</button>
					<a target="_blank" href="documentation/index.html">
						<label for="JS">JS Docs</label>
						<img id=JS src="assets/javascript.svg">
					</a>
					<a target="_blank" href="https://github.com/brennanwilkes/Open-Source-Islands">
						<label for="github2">Source Code</label>
						<img id=github2 src="assets/github.svg">
					</a>
					<button type=button id=sources>Sources & Attributions</button>
					<button type=button class=home>Home</button>
				</div>
				<div class=page style="display: none">
					<h1>Dev Notes</h1>
					<input type="button" value="back">

				</div>
				<div class=page style="display: none">
					<h1>Sources</h1>
					<p>

						<span>test</span>

						Perlin Noise algorithm, originally developed by Stefan Gustavson, Peter Eastman, and Joseph Gentle. This code was placed in the public domain by its original author Stefan Gustavson. My exact version can be cloned from <a href="https://github.com/josephg/noisejs" target="_blank">github.com/josephg/noisejs</a>

						<br /><br />

						Perlin Noise algorithm, originally developed by Stefan Gustavson, Peter Eastman, and Joseph Gentle. This code was placed in the public domain by its original author Stefan Gustavson. My exact version can be cloned from https://github.com/josephg/noisejs


					</p>
					<input type="button" value="back">
				</div>
				<div class=page style="display: none">
					<h1 id=bw>Brennan Wilkes</h1>
					<a target="_blank" href="https://github.com/brennanwilkes">
						<label for="github">Github</label>
						<img id=github src="assets/github.svg">
					</a>
					<a target="_blank" href="https://bw.codexwilkes.com/portfolio/">
						<label for="website">Website</label>
						<img id=website src="assets/website.svg">
					</a>
					<a target="_blank" href="https://www.linkedin.com/in/brennan-wilkes-19553b14b/">
						<label for="linkedin">Linkedin</label>
						<img id=linkedin src="assets/linkedin.svg">
					</a>
					<button type=button class=home>Home</button>
				</div>
			</form>
			<div id=sunset-overlay class=lignting-anim></div>
		</main>
	</body>
</html>
