<script>
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import '$lib/styles/global.css';
	import LineChart from './LineChart.svelte';

	export let data;
	export let form;
	let chartData = [];
	$: chartData = form?.temp || data?.temp;
	//data.temps.map(a => console.log(getUnixTime(parseISO(a.time))));
	let formElement;
	let zoom = 0;
	//$: console.log(data);
	//$: form && console.log(form);
	function handleClick(e) {
		if (e.srcElement.innerText == 'Reset') {
			zoom = 0;
		} else {
			zoom += Number(e.srcElement.innerText);
			if (zoom < 0) zoom = 0;
		}
		formElement.requestSubmit();
	}
</script>

<svelte:head>
	<title>Graph</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	<h1>Sauna Temperature History</h1>
	<section>
		<form bind:this={formElement} action="?/getdays" method="POST" use:enhance>
			<input type="hidden" name="days" value={zoom} />
			<button on:click={handleClick}>5</button>
			<button on:click={handleClick}>1</button>
			<button on:click={handleClick}>-1</button>
			<button on:click={handleClick}>-5</button>
			<button on:click={handleClick}>Reset</button>
		</form>
	</section>
	<section>
		<LineChart data={chartData} />
	</section>
	<!-- <ul>
		{#each data.temps as temp}
			<li>
				{temp.temp}
			</li>
		{/each}
	</ul> -->
</div>

<style>
	button {
		background-color: #424242;
		color: rgb(198, 196, 196);
		border: 1px solid gray;
		border-radius: 5px;
		padding: 5px;
		margin: 5px;
	}
</style>
