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

		if (temp[0].temp < 5000) color = 'yellow';
			else if (temp[0].temp < 8000) color = 'rgb(200, 100, 0)';
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
</script>

<svelte:head>
	<title>Sauna thermometer</title>
	<meta name="description" content="Sauna temp" />
</svelte:head>

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


<style>
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
	.timebg {
		background-color: #222222;
	}
	.temperature {
		margin: auto;
		background-color: #222222;
		padding: 5vh 7vw 5vh 7vw;
		border-radius: 10px;
		width: fit-content;
		vertical-align: bottom;
	}

</style>
