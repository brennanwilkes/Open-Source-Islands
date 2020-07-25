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

						<h3>Usage</h3>
						<p>
							Open Source Islands has three main sections to check out! To start, go to the <a href="javascript:changePage(GENERATOR);">generator</a> page, and click through the form without changing any default values. A beautiful, (but perhaps boring!) 8bit art-style island will be generated for your. Then hit edit, and start playing around with the various sliders and check-boxes. I highly recommend that you try them all! When you've found some settings that you like, try clicking "recompile" a handful of times, until you get a seed which strikes your fancy. Finally you can adjust the colour settings, as well as the amount of sunset lighting and shadows applied. When you're happy with your island, hit "save" to download an image file, and hit "submit" to upload it to the public gallery.
						</p>
						<p>
							Once you've tried the generator yourself, head over to the <a href="javascript:changePage(GALLERY);">gallery</a> page, and explore the vast array of islands other people have made. If you particularity like one, hit "edit", make any adjustments you'd like, and download it!
						</p>
						<p>
							In addition to the fun functionality of the app, I've put considerable effort into the <a href="documentation/index.html">JS Docs</a> and <a href=".">developer notes</a> sections of the project, and would appreciate you checking them out in order to learn more about the project.
						</p>
						<p>
							Finally, head over to the <a href="javascript:changePage(ABOUT);">about</a> section to learn more about the developer, me!
						</p>

						<h3>The Premise</h3>
						<p>
							Open Source Islands is the meeting point of two points of interest in my life, the great south pacific ocean, and procedural noise algorithms. Prior to this year, I've spent a considerable amount of time <a href="https://bw.codexwilkes.com/travel/" target="_blank">exploring</a> and falling in love with the incredible, yet shockingly unspoiled nations of the south pacific, and with covid-19 in full effect, I've felt stuck here in the city. I've also had a long standing interest in procedural terrain, and noise algorithms like worley and perlin noise. Combine these, and you get the starting point for Open Source Islands.
						</p>
						<p>
							Conceptually, Open Source Islands is divided into three main components. The island class and generator, the web-app providing an user interface for it, and the back-end database storing island configurations. The island class needed to be object-orientated, and abstract from the remainder of the project, as I want to implement it in other projects. The UI needed to be intuitive, and the back-end needed to be fast, as I'm deploying it on a small raspberry pi.
						</p>

						<h3>Island.js</h3>
						<p>
							The most conceptually difficult component of the project, my island representation class is the part of Open Source Islands that I'm the most proud of. The entire class, including all default settings, methods, and export functions are self contained, and thus can be included any any project that requires procedural islands.
						</p>
						<p>
							Island generation begins with a base eight octave layer of perlin noise. This noise is then scaled and
						</p>
						<p>
							To get a detailed understanding of island.js, please check out the <a href="https://github.com/brennanwilkes/Open-Source-Islands/tree/master/js/island-generator" target="_blank">source code</a>, as well as the specific <a href="documentation/island-generator.html" target="_blank">documentation</a>
						</p>

						<h3>jQuery</h3>
						<p>

						</p>

						<h3>PHP and AJAX</h3>
						<p>

						</p>

						<h3>MariaDB and SQL</h3>
						<p>

						</p>

						<h3>Mobile Design and ARIA</h3>
						<p>

						</p>

						<h3>Open Source</h3>
						<p>

						</p>

						<h3>The Future</h3>
						<p>

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
							Github, JavaScript, and Linkedin SVG logos have all been downloaded from the Wikimedia commons. Small cropping and colour correction alterations have been made. Original logos can be accessed from the below links.
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
