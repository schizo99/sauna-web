<script>
	import '$lib/styles/global.css';
	// import '@fontsource/merriweather';
	import { onMount } from 'svelte';
	import { parseISO, format, addHours, subHours, set } from 'date-fns';
	export let data;

	let color = 'yellow';
	let temperature = 0;
	let gradientString = '';
	$: setcolor();
	$: getTemperature();
	function setcolor() {
		if (gradientString != '') color = getColorAtPercentageVertical(temperature);
	}
	onMount(() => {
		gradientString = getComputedStyle(document.getElementById('temperature')).background;
		if (gradientString != '') color = getColorAtPercentageVertical(temperature);
		refresh();
		const interval = setInterval(refresh, 5000);
		return () => clearInterval(interval);
	});

	async function refresh() {
		let result = await fetch('/gettemp', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((r) => r.json());
		data = result;
	}

	function getTemperature() {
		if (data.temp[0].temp) temperature = data.temp[0].temp / 100;
		else temperature = 0;
	}
	function getColorAtPercentageVertical(percentage) {
            // Extract the 'linear-gradient' part using a regex
			const gradientMatch = gradientString.match(/linear-gradient\((.*)\)/);
            if (!gradientMatch) {
                console.error("Invalid gradient string.");
                return null;
            }

            // Get the color stops inside the linear-gradient function
            const gradient = gradientMatch[1];

            // Create an off-screen canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Set canvas dimensions (100px height, 1px width for vertical gradient)
            canvas.width = 1;
            canvas.height = 100;

            // Create the linear gradient for the canvas
            const canvasGradient = context.createLinearGradient(0, canvas.height,0,0);

            // Parse the color stops from the gradient string
            const stopMatches = [...gradient.matchAll(/(rgba?\([^)]+\)|#[0-9a-fA-F]+|[a-zA-Z]+)/g)];
            if (!stopMatches.length) {
                console.error("Failed to parse the gradient.");
                return null;
            }

            // Apply the color stops to the canvas gradient
            stopMatches.forEach((stop, index) => {
                canvasGradient.addColorStop(index / (stopMatches.length - 1), stop[0]);
            });

            // Fill the canvas with the gradient
            context.fillStyle = canvasGradient;
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Get the pixel color at the specific percentage position (Y-axis)
            const y = Math.round(canvas.height * (percentage / 100));
            const pixelData = context.getImageData(0, y, 1, 1).data;

			// Convert the pixel data to a CSS rgba color
            return `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
        }
</script>

<svelte:head>
	<title>Sauna thermometer</title>
	<meta name="description" content="Sauna temp" />
</svelte:head>

<div class="kalle">
	<div class="left">
		<div class="temperature">
			<section class="temp">
				<span class="tempbg">
					{#if data}
						<span>Temp:</span> <span style:color>{temperature}°C</span>
					{:else}
						Loading...
					{/if}
				</span>
			</section>
			<section class="time">
				<span class="timebg">
					{#if data}
						Time: {format(parseISO(data.temp[0].time), 'yyyy-MM-dd HH:mm')}
					{:else}
						Loading...
					{/if}
				</span>
			</section>
		</div>
		<div class="counts">
			<section class="first">
				<span class="firstbg">
					{#if data.starts}
						<span class="count">Count:</span> <span class="countnr">{data.starts.length}</span>
						<br />
						<span class="start">First start:</span>
						<span>{format(parseISO(data.starts[0].time), 'yyyy-MM-dd')}</span>
						<br />
						<span class="start">Last start:</span>
						<span>{format(parseISO(data.starts[data.starts.length - 1].time), 'yyyy-MM-dd')}</span>
					{:else}
						Loading...
					{/if}
				</span>
			</section>
		</div>
	</div>
	<div class="right">
		<div id="termometer">
			{#if data.temp}
				<div
					id="temperature"
					data-value={temperature}
					style="height: {temperature}%"
				></div>
			{:else}
				<div id="temperature" data-value="0"></div>
			{/if}
			<div id="graduations"></div>
		</div>
	</div>
</div>

<style lang="scss">
	.kalle {
		display: flex;
		justify-content: center;
		padding-top: 15vh;
	}
	.left {
		display: flex;
		flex-direction: column;
	}

	.right {
		padding-top: 78px;
		padding-left: 20px;
		padding-bottom: 2px;
	}
	.temp {
		font-size: 26px;
		text-align: center;
		padding-top: 30px;
		color: gray;
		width: 100%;
	}
	.tempbg {
		background-color: #222222;
	}
	.time {
		padding-top: 10px;
		font-size: 14px;
		text-align: center;
		color: gray;
	}
	.first {
		padding-top: 25px;
		font-size: 14px;
		text-align: center;
		color: gray;
	}
	.start {
		color: rgb(90, 90, 90);
	}
	.count {
		font-size: 26px;
	}
	.countnr {
		font-size: 26px;
		color: whitesmoke;
	}
	.timebg {
		background-color: #222222;
	}
	.temperature {
		/* margin: auto; */
		/* margin-left: center; */
		background-color: #222222;
		//padding: 20px 75px 20px 75px;
		border-radius: 15px;
		vertical-align: bottom;
		width: 220px;
		margin-top: 80px;
		margin-bottom: 5px;
		height: 120px;
	}
	.counts {
		margin-top: 5px;
		background-color: #222222;
		//padding: 10px 75px 25px 75px;
		border-radius: 15px;
		vertical-align: bottom;
		height: 120px;
		width: 220px;
	}

	$TM-mainTint: #3d3d44;
	$TM-backgroundColor: darken($TM-mainTint, 2%);
	$TM-borderSize: 7px;
	$TM-borderColor: darken($TM-mainTint, 8%);
	$TM-width: 20px;
	$TM-bulbSize: calc($TM-width * 2);
	$TM-height: 210px;
	$TM-radius: 20px;
	$TM-graduationsStyle: 2px solid rgba(0, 0, 0, 0.5);
	$TM-bulbColor: #162bc8;
	$TM-mercuryColor: linear-gradient(
			#ec0505,
			#dc0505,
			#f87408,
			#f8b007,
			#f8f407,
			#e8e407,
			#06d93a,
			$TM-bulbColor
		)
		no-repeat bottom;

	// Tooltip

	$TM-tooltipColor: rgba(0, 0, 0, 0.7);
	$TM-tooltipSize: 1em;
	$TM-tooltipRadius: 5px;
	$TM-tooltipTopShift: 5px;
	$TM-tooltipVerticalPadding: 5px;
	$TM-tooltipHorizontalPadding: $TM-tooltipVerticalPadding * 2;
	$TM-tooltipLeftShift: 100%;
	$TM-tooltipArrowWidth: 1.5; // Higher numbers produce smaller width
	$TM-tooltipArrowHeight: 2.2; // Higher numbers produce smaller height

	@mixin border() {
		border: $TM-borderSize solid $TM-borderColor;
	}

	// THERMOMETER ―――――――――――――――――――――――――

	#termometer {
		width: $TM-width;
		background: $TM-backgroundColor;
		height: $TM-height;
		position: relative;
		@include border;
		border-radius: $TM-radius;
		z-index: 1;
		margin-bottom: $TM-bulbSize;

		&:after {
			position: absolute;
			content: '';
			border-radius: 50%;
		}

		// Border cover

		&:before {
			width: 100%;
			height: calc($TM-bulbSize / 2 + $TM-borderSize);
			bottom: $TM-borderSize;
			background: $TM-backgroundColor;
			z-index: -1;
		}

		// Bulb

		&:after {
			transform: translateX(-50%);
			width: $TM-bulbSize;
			height: $TM-bulbSize;
			background-color: $TM-bulbColor;
			bottom: -$TM-bulbSize + $TM-borderSize - 5;
			@include border;
			z-index: -3;
			left: 50%;
		}

		#graduations {
			height: 59%;
			top: 20%;
			width: 50%;

			&,
			&:before {
				position: absolute;
				border-top: $TM-graduationsStyle;
				border-bottom: $TM-graduationsStyle;
			}

			&:before {
				content: '';
				height: 34%;
				width: 100%;
				top: 32%;
			}
		}

		#temperature {
			bottom: 0;
			background: $TM-mercuryColor;
			width: 100%;
			border-radius: $TM-radius;
			background-size: 100% $TM-height;
			transition: all 0.2s ease-in-out;

			&,
			&:before,
			&:after {
				position: absolute;
			}

			// Temperature value - Tooltip

			&:before {
				content: attr(data-value);
				background: $TM-tooltipColor;
				color: whitesmoke;
				z-index: 2;
				padding: $TM-tooltipVerticalPadding $TM-tooltipHorizontalPadding;
				border-radius: $TM-tooltipRadius;
				font-size: $TM-tooltipSize;
				line-height: 1;
				transform: translateY(50%);
				left: calc(#{$TM-tooltipLeftShift} + 1em / #{$TM-tooltipArrowWidth});
				top: calc(-1em + #{$TM-tooltipTopShift} - #{$TM-tooltipVerticalPadding} * 2);
			}

			// Tooltip arrow

			&:after {
				content: '';
				border-top: calc($TM-tooltipSize / $TM-tooltipArrowHeight) solid transparent;
				border-bottom: calc($TM-tooltipSize / $TM-tooltipArrowHeight) solid transparent;
				border-right: calc($TM-tooltipSize / $TM-tooltipArrowWidth) solid $TM-tooltipColor;
				left: $TM-tooltipLeftShift;
				top: calc(-#{$TM-tooltipSize} / #{$TM-tooltipArrowHeight} + #{$TM-tooltipTopShift});
			}
		}
	}
</style>
