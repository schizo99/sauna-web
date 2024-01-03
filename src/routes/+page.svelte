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
</script>

<svelte:head>
	<title>Sauna thermometer</title>
	<meta name="description" content="Sauna temp" />
</svelte:head>
	<center>

	
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
				<br>
					<span class="start">First start:</span> <span>{format(parseISO(data.starts[0].time), 'yyyy-MM-dd')}</span>
					<br>
					<span class="start">Last start:</span> <span>{format(parseISO(data.starts[data.starts.length - 1].time), 'yyyy-MM-dd')}</span>
				{:else}
					Loading...
				{/if}
			</span>
		</section>
	</div>
</center>
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
	.first {
		padding-top: 10px;
		font-size: 14px;
		text-align: center;
		color: gray;
	}
	.start {
		color: rgb(90,90,90);
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

</style>
