<script>
	let { temp } = $props();
	let color = $state('rgb(0,0,255)');
	let bgcolor = $state('black');
	let max = 100;
	let min = -10;
	let canvas;
	$effect(() => {
		const ctx = canvas.getContext('2d');
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const gradient = ctx.createLinearGradient(0, 200, 0, 0);
		gradient.addColorStop(0, 'blue');
		gradient.addColorStop(0.15, '#06d93a');
		gradient.addColorStop(0.30, '#e8e407');
		gradient.addColorStop(0.45, '#f8f407');
		gradient.addColorStop(0.6, '#f8b007');
		gradient.addColorStop(0.75, '#f87408');
		gradient.addColorStop(0.9, '#dc0505');
		gradient.addColorStop(1, '#ec0505');
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.roundRect(0, 200-(temp*2), canvas.width, canvas.height, 0);
		ctx.stroke();
		ctx.fill();
		const imageData = ctx.getImageData(5, 200 - (temp*2), 1, 1).data;
		color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
		console.log(imageData);
		if (imageData[0] === 0 && imageData[1] === 0 && imageData[2] === 0) {
			document.documentElement.style.setProperty('--temp-color', 'blue');
		} else {
			document.documentElement.style.setProperty('--temp-color', `${color}`);
		}
	});
</script>

<div class="thermometer">
	<div class="stem">
		<canvas class="stem-percent" bind:this={canvas} width="10" height="200"></canvas>
	</div>
	<div class="boll"></div>
</div>

<style>
	.thermometer {
		display: block;
		position: relative;
		height: 200px;
	}
	.stem {
		display: inline-block;
		border: 2px solid #222;
		width: 22px;
		height: 180px;
		border-radius: 0px 0px 20px 20px;
		border-top: 2px solid transparent;
		position: absolute;
		bottom: 18px;
		left: 4px;
		box-shadow: 0px 0px 0px 2px #fff inset;
		transform: rotate(180deg);
		z-index: 10;
		padding-bottom: 3px;
	}
	.stem-percent {
		height: 181px;
		transform: rotate(180deg);
		width: 18px;
		display: block;
		margin: 0px auto;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.boll {
		display: inline-block;
		border: 2px solid #222;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		position: absolute;
		left: 0px;
		bottom: -10px;
		border-top: 2px solid #fff;
		box-shadow: 0px 0px 0px 2px #fff inset;
		background: blue;
	}
	.boll:after {
		content: '';
		height: 6px;
		width: 18px;
		background: inherit;
		position: absolute;
		background: blue;
		left: 6px;
		bottom: 23px;
		z-index: 22;
	}
</style>
