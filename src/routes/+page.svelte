<script>
	import { browser } from '$app/environment';
	import '$lib/styles/global.css';
	// import '@fontsource/merriweather';
	import { onMount } from 'svelte';
	import { parseISO, format, addHours, subHours, set } from 'date-fns';
	export let data;
	let temp;
	let focused = false;
	let color = 'yellow';
	let time_called = false;

	function setcolor() {
		if (temp[0].temp < 1000) color = 'rgb(50,50,250)';
		else if (temp[0].temp < 4000) color = 'yellow';
		else if (temp[0].temp < 7000) color = 'rgb(200, 100, 0)';
		else color = 'red';
	}

	async function time() {
		if (focused) {
			refresh();
			setcolor();
		}
		if (!time_called) {
			time_called = true;
			setInterval(time, 5000);
			return;
		}
	}

	onMount(() => {
		if (browser) {
			window.addEventListener('focus', async () => {
				focused = true;
			});
			window.addEventListener('blur', async () => {
				focused = false;
			});

			temp = data.temp;
			setcolor();
			time();
		}
	});
	async function refresh() {
		let result = await fetch('/api/get', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((r) => r.json());
		temp = result;
	}
	function getTemperature() {
		if (temp > 0) return temp[0].temp / 100 + 5;
		else return 0;
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
					{#if temp}
						<span>Temp:</span> <span style:color>{temp[0].temp / 100}°C</span>
					{:else}
						Loading...
					{/if}
				</span>
			</section>
			<section class="time">
				<span class="timebg">
					{#if temp}
						Time: {format(parseISO(temp[0].time), 'yyyy-MM-dd HH:mm')}
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
			{#if temp}
				<div
					id="temperature"
					data-value={temp[0].temp / 100}
					style="height: {getTemperature()}%"
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
	}
	.left {
		display: flex;
		flex-direction: column;
	}

	.right {
		padding-top: 18vh;
		padding-left: 20px;
	}
	.text-column {
		width: min(100% - var(--spacing-12), var(--max-width-wrapper));
		margin: var(--spacing-18) auto;
	}
	.temp {
		font-size: 26px;
		text-align: center;
		color: gray;
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
		padding-top: 10px;
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
		padding: 4vh 3vw 4vh 3vw;
		border-radius: 15px;
		vertical-align: bottom;
		max-width: 200px;
		margin-top: 18vh;
		margin-bottom: 5px;
	}
	.counts {
		margin-top: 5px;
		background-color: #222222;
		padding: 2vh 3vw 4vh 3vw;
		border-radius: 15px;
		max-width: 200px;
		vertical-align: bottom;
	}

	$TM-mainTint: #3d3d44;
	$TM-backgroundColor: darken($TM-mainTint, 2%);
	$TM-borderSize: 9px;
	$TM-borderColor: darken($TM-mainTint, 8%);
	$TM-width: 20px;
	$TM-bulbSize: calc($TM-width * 2);
	$TM-height: calc(100% - calc($TM-bulbSize + 7px));
	$TM-radius: 20px;
	$TM-graduationsStyle: 2px solid rgba(0, 0, 0, 0.5);
	$TM-bulbColor: #162bc8;
	$TM-mercuryColor: linear-gradient(#dc0505, #f87408, #f8f407, #06d93a, $TM-bulbColor) no-repeat
		bottom;

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
			bottom: -$TM-bulbSize + $TM-borderSize - 10;
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
