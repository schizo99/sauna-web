<script>
  import Percentage from './percentage.svelte';
  let { temperature = 50, min = -10, max = 100, bulb = 10 } = $props();

  function getSingleColor(percentage) {
    const colors = [
      [0, 0, 255],      // Blue
      [255, 165, 0],    // Orange
      [255, 0, 0]       // Red
    ];
    if (percentage === 0) {
      return `rgb(${colors[0]})`;
    } else if (percentage === 100) {
      return  `rgb(${colors[2]})`;
    }
    const index = Math.min(Math.floor(percentage / 50), 1);
    const startColor = colors[index];
    const endColor = colors[index + 1];
    const factor = (percentage % 50) / 50;
    const [r, g, b] = startColor.map((start, i) =>
      Math.round(start + (endColor[i] - start) * factor)
    );
    return `rgb(${r}, ${g}, ${b})`;
  }
  $effect(() => {
    document.documentElement.style.setProperty('--temp-color', getSingleColor(math.percentage));
  });
  let math = $derived.by(() => {
    const range = max - min;
    const percentage = Math.min(100, Math.max(0, (((temperature - min) / range) * 100)));
    let cappedPercentage = 100 - Math.max(bulb, percentage);
    let startOffset = Math.max(0, cappedPercentage - 5);
    let endOffset = Math.min(90, cappedPercentage + 5);
    let labelOffset = Math.min(90, cappedPercentage + 10);

    return {
      singleColor: getSingleColor(percentage),
      percentage,
      cappedPercentage,
      startOffset,
      endOffset,
      temperature
    };
  });
  let labelPosition = $derived.by(() => {
    function calculatePosition(percentage) {
    const startValue = 81;
    const endValue = -1;

    // Apply cubic easing for smoother transitions at the ends
    const easedPercentage = Math.pow(percentage / 100, 1.3)*1.05;

    return percentage >= 93 ? endValue : startValue + easedPercentage * (endValue - startValue);
}
    return calculatePosition(math.percentage*1.05);
  })
</script>
<!-- {math.percentage}
{Math.round(labelPosition)} -->
<!-- <div class="square" style="--color-temp: {math.singleColor}"></div> -->
<div class="group">
  <div class="label" style="--offset-y: {Math.round(labelPosition)}%">
    <Percentage>
      {Math.round(temperature)}c
    </Percentage>
  </div>
  <svg viewBox="0 0 265 866" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="red" />
        <stop offset="50%" stop-color="orange" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
      <linearGradient id="reveal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset={`${math.startOffset}%`} stop-color="black" />
        <stop offset={`${math.cappedPercentage - 3}%`} stop-color="black" />
        <stop offset={`${math.cappedPercentage + 3}%`} stop-color="white" />
        <stop offset={`${math.endOffset}%`} stop-color="white" />
      </linearGradient>
      <path id="ld" d="M133 20C98.2061 20 70 48.2061 70 83V659.944C39.8504 680.126 20 714.495 20 753.5C20 815.632 70.368 866 132.5 866C194.632 866 245 815.632 245 753.5C245 714.928 225.588 680.889 196 660.622V83C196 48.2061 167.794 20 133 20Z"/>
      <mask id="reveal-mask">
        <rect width="100%" height="100%" fill="white" />
        <rect id="reveal-rect" x="0" y="0" width="100%" height="100%" fill="url(#reveal-gradient)" />
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

<style>
  .square {
    width: 200px;
    height: 200px;
    background: var(--color-temp);
  }
  .group {
    position: relative;
  }
  .label {
    position: absolute;
    right: -70px;
    top: var(--offset-y);
  }
</style>


