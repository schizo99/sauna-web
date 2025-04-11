<script>
	import { fade, blur } from 'svelte/transition';
	import LineChart from './LineChart.svelte';
	import { enhance } from '$app/forms';
	import '$lib/styles/global.css';
	let visible = true;
	let { data, form } = $props();
	let chartData = $state([]);
	let zoom = $state(0);
	function handleClick(e) {
		if (e.srcElement.innerText == 'Reset') {
			zoom = 0;
		} else {
			zoom += Number(e.srcElement.innerText);
			if (zoom < 0) zoom = 0;
		}
	}
	$effect(() => {
		if (zoom != 0) {
			chartData = form?.temp;
		} else {
			chartData = data?.temp;
		}
	});
</script>

<svelte:head>
	<title>Graph</title>
	<meta name="description" content="Temperature graph" />
</svelte:head>

<div>
	<h1>Sauna Temperature History</h1>

	<section>
		<form action="?/getdays" method="POST" use:enhance>
			<input type="hidden" name="days" value={zoom} />
			<button onclick={handleClick}>5</button>
			<button onclick={handleClick}>1</button>
			<button onclick={handleClick}>-1</button>
			<button onclick={handleClick}>-5</button>
			<button onclick={handleClick}>Reset</button>
		</form>
	</section>
	<section>
		{#if visible}
			<div transition:fade={{ delay: 0, duration: 150 }}>
				{#if chartData?.length > 0}
					<LineChart data={chartData} />
				{:else}
					<p>Loading...</p>
				{/if}
			</div>
		{/if}
	</section>
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
