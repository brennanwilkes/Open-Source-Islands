<?php
	ini_set('display_errors', 1);
	error_reporting(E_ALL);

	require_once 'php/backend.php';

	$pdo = db_connect();

	if($_SERVER["REQUEST_METHOD"] == "POST" && !isset($_GET["isLandCopy"])){
		handle_submit();
	}

?><!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Open Source Islands</title>
		<link rel="stylesheet" href="css/styles.css">
		<link rel="icon" href="icon.png" type="image/icon">


		<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Ubuntu:wght@300&Inconsolata:wght@300display=swap" rel="stylesheet">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

		<script src="js/island-generator/name_list.js"></script>
		<script src="js/island-generator/perlin-noise/Stefan-Gustavson-Perlin.js"></script>
		<script src="js/island-generator/island.js"></script>
		<script src="js/osi.js"></script>
	</head>
	<body>
		<div id=backgroundDisplay class=backgroundIsland><div class=lighting></div><div class=baselayer></div></div>
		<main>
			<form method="post">
				<nav class=page aria-live="assertive">
					<h1 id=osi>Open Source Islands</h1>
					<button aria-label="Navigate to generator page" type=button id=generator>Generator</button>
					<button aria-label="Navigate to gallery page" type=button id=gallery>Gallery</button>
					<button aria-label="Navigate to documentation page" type=button id=documentation>Documentation</button>
					<button aria-label="Navigate to about page" type=button id=about>About</button>
				</nav>
				<section class=page style="display: none" aria-live="assertive">
					<h2>Properties</h2>
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

					<div aria-live="polite">
						<label for="motu">Motu</label>
						<input type="checkbox" id="motu" name="motu" value="true">
					</div>

					<div aria-live="polite">
						<label for="atoll">Atoll</label>
						<input type="checkbox" id="atoll" name="atoll" value="true">
					</div>

					<div aria-live="polite">
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
				</section>
				<section class=page style="display: none" aria-live="assertive">
					<h2>Generation</h2>

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
				</section>
				<section class=page  style="display: none" aria-live="assertive">
					<h2>Colours</h2>

					<div>
						<label for="background">Background</label>
						<input type="checkbox" id="background" name="background" value="true" checked>
					</div>

					<div>
						<label for="ocean">Background</label>
						<input type="color" value="#0C1A5F" name="ocean" id="ocean" aria-label="Dark ocean colour for deep water">
					</div>
					<div>
						<label for="shallows">Shallows</label>
						<input type="color" value="#0C49AC" name="shallows" id="shallows" aria-label="Light ocean colour for shallow water">
					</div>
					<div>
						<label for="beach">Beach</label>
						<input type="color" value="#D0AB76" name="beach" id="beach" aria-label="Pale colour for beach sand">
					</div>
					<div class=tri>
						<label for="ground1">Ground</label>
						<input type="color" value="#587E31" name="ground1" id="ground1" aria-label="Light green colour for low ground">
						<input type="color" value="#274C00" name="ground2" id="ground2" aria-label="Medium green colour for medium ground">
						<input type="color" value="#173600" name="ground3" id="ground3" aria-label="Dark green colour for high ground">
					</div>

					<div class=dual>
						<label for="rock1">Rock</label>
						<input type="color" value="#959688" name="rock1" id="rock1" aria-label="Light grey colour for low mountains">
						<input type="color" value="#626354" name="rock2" id="rock2" aria-label="Dark grey colour for mountain ridges">

					</div>

					<div class=dual style="display: none">
						<label for="lava1">Lava</label>
						<input type="color" value="#8B0000" name="lava1" id="lava1" aria-label="Dark red colour for lava">
						<input type="color" value="#FFA500" name="lava2" id="lava2" aria-label="Orange colour for lava highlights">
					</div>

					<div>
						<label for="time">Sunset</label>
						<input type="range" min="20" max="120" value="20" name="time" id="time">
					</div>

					<div>
						<input type="button" value="back">
						<input type="button" value="Compile" id="compile">
					</div>
				</section>
				<section class=page  style="display: none" aria-live="assertive">
					<h2>Loading</h2>
					<div id=loading-container aria-label="Loading icon">
						<div id=loading-circle>
							<div class="Albatross sprite" id=loading-anim><div></div></div>
						</div>
					</div>
				</section>
				<section class=page  style="display: none" id="preview-display-wrapper" aria-live="assertive">
					<h2>Preview</h2>

					<div>
						<input type="button" value="Edit" id="edit">
						<input type="button" value="New Seed" id="recompile">
					</div>
					<div>
						<input type="button" value="Home" class=home>
						<input type="button" value="Save" id="save">
					</div>
					<input type="submit" value="Submit">
				</section>
				<section class=page id=gal style="display: none" aria-live="polite">
					<h2>Island Gallery</h2>
					<div>
						<?php
							get_images();
						?>
					</div>
					<button tabindex=1 type=button class=home>Home</button>
				</section>
				<section class=page id=gallery-preview  style="display: none" aria-live="assertive">
					<h2>PREVIEW</h2>
					<div>
						<input type="button" value="back">
						<input type="button" value="Edit" id="copy">
					</div>
				</section>
				<section class=page  style="display: none" aria-live="assertive">
					<h2 id=doc>Documentation</h2>
					<button type=button id=devnotes>Developer Notes</button>
					<a target="_blank" href="documentation/index.html">
						<span>JS Docs</span>
						<img id=JS src="assets/javascript.svg" alt="JSDocs logo">
					</a>
					<a target="_blank" href="https://github.com/brennanwilkes/Open-Source-Islands">
						<span>Source Code</span>
						<img id=github2 src="assets/github.svg" alt="GitHub logo">
					</a>
					<button type=button id=sources>Sources & Attributions</button>
					<button type=button class=home>Home</button>
				</section>
				<section class=page style="display: none" aria-live="assertive">
					<h2>Dev Notes</h2>
					<article>
						<h3>Header</h3>
						<p>
							Content
						</p>
					</article>
					<input type="button" value="back">
				</section>
				<section class=page style="display: none" aria-live="assertive">
					<h2>Sources</h2>
					<article>

						<h3>Perlin Noise</h3>

						<p>
							I have cloned and utilized the Perlin Noise algorithm, developed by Stefan Gustavson, Peter Eastman, and Joseph Gentle, as an adaptation to Perlin's original design. This code was placed in the public domain by its original author Stefan Gustavson. My exact version can be cloned from
						</p>
						<a href="https://github.com/josephg/noisejs" target="_blank">github.com/josephg/noisejs</a>

						<h3>Graphics</h3>

						<p>
							Github, JavaScript, and Linkedin SVG logos have all been downloaded from the wikimedia commons. Small cropping and colour correction alterations have been made. Original logos can be accessed from the below links.
						</p>
						<a href="https://commons.wikimedia.org/wiki/File:Ei-sc-github.svg" target="_blank">commons.wikimedia.org/github.svg</a>
						<a href="https://commons.wikimedia.org/wiki/File:Unofficial_JavaScript_logo_2.svg" target="_blank">commons.wikimedia.org/Unofficial_JavaScript_logo_2.svg</a>
						<a href="https://commons.wikimedia.org/wiki/File:Linkedin.svg" target="_blank">commons.wikimedia.org/Linkedin.svg</a>

						<h3>Regex</h3>

						<p>
							In order to overcome challenges unique to the Safari browser, I apply a few CSS rules to all non-safari browsers via JavaScript. To facilitate this, I use a small regex string to detect Safari, which I directly copied from the stack-overflow thread listed below.
						</p>
						<a href="https://stackoverflow.com/a/7768006" target="_blank">stackoverflow.com/a/7768006</a>

						<p>
							All other code, IP, and assets were developed exclusively by Brennan Wilkes &copy;2020
						</p>

					</article>
					<input type="button" value="back">
				</section>
				<section class=page style="display: none" aria-live="assertive">
					<h2 id=bw>Brennan Wilkes</h2>
					<a target="_blank" href="https://github.com/brennanwilkes">
						<span>Github</span>
						<img id=github src="assets/github.svg" alt="GitHub logo">
					</a>
					<a target="_blank" href="https://bw.codexwilkes.com/portfolio/">
						<span>Website</span>
						<img id=website src="assets/website.svg" alt="Brennan Wilkes website logo">
					</a>
					<a target="_blank" href="https://www.linkedin.com/in/brennan-wilkes-19553b14b/">
						<span>Linkedin</span>
						<img id=linkedin src="assets/linkedin.svg" alt="LinkedIn logo">
					</a>
					<button type=button class=home>Home</button>
				</section>
			</form>
			<div id=sunset-overlay class=lignting-anim></div>
		</main>
	</body>
</html>
