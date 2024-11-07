<script>
	/**
	 * @typedef {Object} Props
	 * @property {number} [x]
	 * @property {number} [y]
	 * @property {number} [temp]
	 */

	/** @type {Props} */
	let { x = 0, y = 0, temp = 0 } = $props();
</script>

<g>
	<circle class="point" cx={x} cy={y} r="4" />
    <text x={x} y={y - 10} text-anchor="start" dominant-baseline="baseline">
        {temp} 
    </text>
</g>

<style>
	.point {
		fill: #000;
	}
</style>
