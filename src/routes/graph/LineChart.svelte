<script>
	import * as echarts from 'echarts';
	let { data } = $props();
	import { onMount } from 'svelte';
	let myChart;
	onMount(() => {
		const chartDom = document.getElementById('line-chart');
		myChart = echarts.init(chartDom);
		updateChart(data);
	});
	function updateChart(data) {
		const option = {
			xAxis: {
				type: 'time'
			},
			yAxis: {
				type: 'value',
				splitLine: {
					lineStyle: {
						color: 'rgba(0,0,0,0.1)' // Example: Light gray
					}
				}
			},
			series: [
				{
					name: 'Temp',
					type: 'line',
					data: data.map((item) => [item.time, item.temp / 100]),
					symbol: 'none',
					large: true,
					largeThreshold: 500,
					//sampling: 'lttb',
					animation: false,
					lineStyle: {
						color: 'rgba(100,100,100,50)',
						width: 1.5
						// type: 'solid',  // Default is solid, but you can change it
					}
				}
			],
			tooltip: {
				trigger: 'axis'
			}
		};
		myChart.setOption(option);
	}
</script>

<div id="line-chart" style="width: 100%; height: 400px;"></div>
