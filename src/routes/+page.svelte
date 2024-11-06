<script>
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import Tempbox from '$lib/components/tempbox.svelte';
	import Counts from '$lib/components/counts.svelte';
	import Thermometer from '$lib/components/thermometer.svelte';
	// import Range from '$lib/components/range.svelte';
	let { data } = $props();

	onMount(() => {
		let interval = setInterval(() => {
			invalidate('api:data');
		}, 4000);
		return () => {
			clearInterval(interval);
		};
	});
	const temperature = $derived.by(() => {
		if (data.temp.length > 0) {
			return (data.temp[0].temp / 100).toFixed(2);
		} else {
			return 0;
		}
	});
	// let temperature = $state(40);
	let min = $state(-10);
	let max = $state(90);
	let bulb = $state(10);
</script>

<svelte:head>
	<title>Sauna thermometer</title>
	<meta name="description" content="Sauna temp" />
</svelte:head>
<!-- <div class="controls">
	<Range id="temp" label="Temperature" {min} {max} bind:value={temperature} />
</div> -->
<div class="main">
	<div class="left">
		<Tempbox temp={data.temp} />
		<Counts starts={data.starts} />
	</div>
	<div class="right">
		<Thermometer {temperature} {min} {max} {bulb} />
	</div>
</div>

<style>
	.main {
		display: flex;
		justify-content: center;
		padding-top: 15vh;
	}
	.left {
		display: flex;
		flex-direction: column;
	}
	.right {
		display: inline-flex;
		width: 75px;
		flex-direction: column;
		vertical-align: bottom;
		margin-top: 80px;
	}
</style>
