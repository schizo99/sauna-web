<script>
	import { browser } from '$app/environment';
	import '$lib/styles/global.css';
	import { Chart, TimeSeriesScale, TimeScale, registerables } from 'chart.js';
	import { onMount } from 'svelte';
	import { parseISO, format, addHours, subHours, set } from 'date-fns';
	import 'chartjs-adapter-date-fns';
	let temps = false;
	let focused = false;
	Chart.register(...registerables);
	let lineChartElement;
	//data.temps.map(a => console.log(getUnixTime(parseISO(a.time))));
	let setzoom = 0;

	async function getTemps(days, hours) {
		let trim;
		if (days <= 0) {
			days = 1;
			trim = true;
		}
		let result = await fetch('/api/temps', {
			method: 'POST',
			body: JSON.stringify({ days, hours }),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((r) => r.json());

		result = result.filter((item) => item.temp != null);
		if (trim) {
			result = result.filter((item) => {
				return parseISO(item.time) > subHours(new Date(), 6);
			});
		}
		return result;
	}
	let chart;
	onMount(async () => {
		if (browser) {
			temps = await getTemps(-1, 24).then((result) => {
				return result.map((d) => ({
					y: d.temp / 100,
					x: format(parseISO(d.time), 'yyyy-MM-dd HH:mm')
				}));
			});
			let chartdata = {
				datasets: [
					{
						spanGaps: true,
						borderColor: 'rgb(15, 92, 92)',
						//backgroundColor: 'rgb(15, 92, 92)',
						color: 'rgb(15, 92, 92)',
						lineTension: 0.5,
						borderWidth: 2,
						pointBorderWidth: 0.4,
						pointRadius: 1.5,
						label: 'Temperature',
						data: await temps,
						ticks: {
							source: 'labels'
						}
					}
				]
			};

			window.addEventListener('focus', async () => {
				focused = true;
			});
			window.addEventListener('blur', () => {
				focused = false;
			});
			new Chart(lineChartElement, {
				type: 'line',
				data: chartdata,
				options: {
					animation: {
						duration: 0
					},
					responsive: true,
					// maintainAspectRatio: false,
					scales: {
						x: {
							grid: {
								color: 'rgb(0,0,0)',
								lineWidth: 0.5,
							},
							ticks: {
								color: 'rgb(0,0,0)',
							},
							border: {
								color: 'rgb(0,0,0)',
							},
							type: 'time',
							time: {
								unit: 'hour',
								stepSize: 5,
								tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
								displayFormats: {
									millisecond: 'HH:mm:ss.SSS',
									second: 'HH:mm:ss',
									minute: 'HH:mm',
									hour: 'HH'
								}
							}
						},
						y: {
							grid: {
								color: 'rgb(0,0,0)',
								lineWidth: 0.5,
							},
							ticks: {
								color: 'rgb(0,0,0)',
							},
							border: {
								color: 'rgb(0,0,0)',
							},
						}
					}
				}
			});
		}
	});
	function zoom(days) {
		if (setzoom < -1) {
			setzoom = 0;
		}
		setzoom += days;
		getTemps(setzoom, 24).then((result) => {
			let chart = Chart.getChart(lineChartElement);
			const temp = result.map((d) => ({
				y: d.temp / 100,
				x: format(parseISO(d.time), 'yyyy-MM-dd HH:mm')
			}));
			chart.data.datasets[0].data = temp;
			chart.options.scales.x.time.unit = setzoom>2 ? 'day' : 'hour';
			chart.update();
		});
	}
	function reset() {
		setzoom = -1;
		zoom(0);
	}
</script>

<svelte:head>
	<title>Graph</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div>
	<h1>Sauna Temperature History</h1>
	<section>
		<button on:click={() => zoom(5)}>+5</button>
		<button on:click={() => zoom(1)}>+1</button>
		<button on:click={() => zoom(-1)}>-1</button>
		<button on:click={() => zoom(-5)}>-5</button>

		<button on:click={reset}>Reset Zoom</button>
	</section>

	<section>
		{#if temps}
			<canvas bind:this={lineChartElement} />
		{:else}
			Loading...
		{/if}
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
