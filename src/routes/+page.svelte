<script>
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import Tempbox from '$lib/components/tempbox.svelte';
	import Counts from '$lib/components/counts.svelte';
	import Thermometer from '$lib/components/thermometer.svelte';
	// import Range from '$lib/components/range.svelte';
	let { data } = $props();
	onMount(() => {
		document.addEventListener('visibilitychange', (event) => {
			if (document.visibilityState == 'visible') {
				invalidate('api:data');
			}
		});
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
	let description = $derived.by(() => {
		return `The current sauna temperature is ${temperature}°C.`;
	});

</script>

<svelte:head>
  <title>Sauna Temperature: {temperature}°C</title>
  <meta property="og:title" content="Sauna Temperature: {temperature}°C">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="og-image.png">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{import.meta.env.BASE_URL}">
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
