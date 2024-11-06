<script>
	let { temperature = 50, min = -10, max = 100, bulb = 25 } = $props();
	let tempColor = $state('rgb(0,0,255)');
	let math = $derived.by(() => {
		const range = max - min;
		const percentage = Math.min(100, Math.max(0, ((temperature - min) / range) * 100));
		let cappedPercentage = 100 - Math.max(bulb, percentage);
		let startOffset = Math.max(0, cappedPercentage - 5);
		let endOffset = Math.min(90, cappedPercentage + 5);
		document.documentElement.style.setProperty('--temp-color', `${tempColor}`);
		return {
			percentage,
			cappedPercentage,
			startOffset,
			endOffset,
			temperature
		};
	});
	let canvas;
	$effect(() => {
        let gr = new GradientReader();
		let col = gr.getColor(math.percentage);
		tempColor = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
	});
	function GradientReader() {
        const colorStops = [
			{ stop: 1.0, color: 'red' },
			{ stop: 0.5, color: 'orange' },
			{ stop: 0.25, color: 'yellow' },
			{ stop: 0.0, color: 'blue' }
		]
		const ctx = canvas.getContext('2d'); // get context
		const gr = ctx.createLinearGradient(0, 0, 101, 0); // create a gradient

		canvas.width = 101; // 101 pixels incl.
		canvas.height = 1; // as the gradient

		for (const { stop, color } of colorStops) {
			// add color stops
			gr.addColorStop(stop, color);
		}

		ctx.fillStyle = gr; // set as fill style
		ctx.fillRect(0, 0, 101, 1); // draw a single line

		// method to get color of gradient at % position [0, 100]
		return {
			getColor: (pst) => ctx.getImageData(pst | 0, 0, 1, 1).data
		};
	}
</script>

<canvas bind:this={canvas} style="display: none;"></canvas>
<div class="group">
	<svg
		viewBox="0 0 265 866"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="width: 50%; height: 50%;"
	>
		<defs>
			<linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
				<stop offset="0%" stop-color="red" />
				<stop offset="50%" stop-color="orange" />
				<stop offset="75%" stop-color="yellow" />
				<stop offset="100%" stop-color="blue" />
			</linearGradient>
			<linearGradient id="reveal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
				<stop offset={`${math.startOffset}%`} stop-color="black" />
				<stop offset={`${math.cappedPercentage - 3}%`} stop-color="black" />
				<stop offset={`${math.cappedPercentage + 3}%`} stop-color="white" />
				<stop offset={`${math.endOffset}%`} stop-color="white" />
			</linearGradient>
			<path
				id="ld"
				d="M133 20C98.2061 20 70 48.2061 70 83V659.944C39.8504 680.126 20 714.495 20 753.5C20 815.632 70.368 866 132.5 866C194.632 866 245 815.632 245 753.5C245 714.928 225.588 680.889 196 660.622V83C196 48.2061 167.794 20 133 20Z"
			/>
			<mask id="reveal-mask">
				<rect width="100%" height="100%" fill="white" />
				<rect
					id="reveal-rect"
					x="0"
					y="0"
					width="100%"
					height="100%"
					fill="url(#reveal-gradient)"
				/>
			</mask>
			<clipPath id="clip">
				<use xlink:href="#ld" />
			</clipPath>
		</defs>
		<g mask="url(#reveal-mask)">
			<use xlink:href="#ld" fill="url(#gradient)" clip-path="url(#clip)" />
		</g>
		<g>
			<use xlink:href="#ld" stroke="white" stroke-width="10%" clip-path="url(#clip)" />
		</g>
		<g>
			<use xlink:href="#ld" stroke="black" stroke-width="7%" clip-path="url(#clip)" />
		</g>
	</svg>
</div>
