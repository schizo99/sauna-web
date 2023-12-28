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
	async function time() {
		if (focused) {
			refresh();
			if (temp[0].temp < 5000) color = 'yellow';
			else if (temp[0].temp < 8000) color = 'orange';
			else color = 'red';
			console.log(color);
		}
		setTimeout(time, 5000);
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

<div class="kalle">
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
</div>

<style>
	.text-column {
		width: min(100% - var(--spacing-12), var(--max-width-wrapper));
		margin: var(--spacing-18) auto;
	}
	.temp {
		font-size: 26px;
		text-align: center;
		/* color: white; */
	}
	.tempbg {
		background-color: darkgray;
	}
	.time {
		padding-top: 10px;
		font-size: 14px;
		text-align: center;
		/* color: white; */
	}
	.timebg {
		background-color: darkgray;
	}
	.temperature {
		margin: auto;
		background-color: darkgrey;
		padding: 5vh 7vw 5vh 7vw;
		border-radius: 10px;
		width: fit-content;
		
	}
	/* .kalle {
		margin: 20px 0px 20px 0px;
		vertical-align: center;
	} */
</style>
