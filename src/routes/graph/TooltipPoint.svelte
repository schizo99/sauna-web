<script>
	export let x = 0;
	export let y = 0;
    export let temp = 0;
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
