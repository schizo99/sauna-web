<script>
	import * as d3 from 'd3';
    // Import axes-components.
	import AxisY from './AxisY.svelte';
	import AxisX from './AxisX.svelte';
	import TooltipPoint from './TooltipPoint.svelte';
	
	/**
	 * @typedef {Object} Props
	 * @property {any} data - Receive plot data as prop.
	 */

	/** @type {Props} */
	let { data } = $props();
	let point = $state(data[0]);

	const width = 928;
	const height = 500;

	const margin = {
		top: 30,
		right: 10,
		bottom: 120,
		left: 30
	};

	// Declare the x (horizontal position) scale.
	let xScale = $derived(d3
		.scaleUtc()
		.domain(d3.extent(data, (d) => new Date(d.time)))
		.range([margin.left, width - margin.right]));

	// Declare the y (vertical position) scale.
	let yScale = $derived(d3
		.scaleLinear()
		.domain([d3.min(data, (d) => d.temp / 100 - 10), d3.max(data, (d) => d.temp / 100 + 10)])
		// .domain([-5,10])
		.rangeRound([height - margin.bottom, margin.top]));

	// Declare the line generator.
	const line = d3
		.line()
		.curve(d3.curveNatural)
		.x((d) => xScale(new Date(d.time)))
		.y((d) => yScale(d.temp / 100));
	let m = { x: 0, y: 0 };
    
    var bisect = d3.bisector((d) => new Date(d.time)).right;

	function handleMousemove(event) {
		m.time = event.offsetX;
		m.temp = event.offsetY;

		// returns point to right of our current mouse position
		let i = bisect(data, xScale.invert(m.time));
		if (i < data.length) {
			point = data[i]; // update point
		}
	}
</script>


<svg
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	style:max-width="100%"
	style:height="auto"
	onmousemove={handleMousemove}
>
	<!-- Add the y-axis -->
	<AxisY {yScale} {width} {margin} />

	<!-- Add the x-axis -->
	<AxisX {xScale} {height} {margin} />

	<!-- Add a path for the line. -->
	<g class="data">
		<path fill="none" stroke="black" d={line(data)} />
	</g>
	<TooltipPoint x={xScale(new Date(point.time))} y={yScale(point.temp/100)} temp={point.temp/100}/>
</svg>
