<script lang="ts">
  import Termometer from './thermometer.svelte';
  import Range from './range.svelte';
  let temp = $state(40);
  let min = $state(-10);
  let max = $state(120);
  let bulb = $state(10);
</script>
<div class="controls">
  <Range id="temp" label="Temperature" {min} {max} bind:value={temp} />
  <Range id="bulb" label="Minimum bulb size" min="0" max="15" bind:value={bulb} />
  <Range id="min-temp" label="Min temp" min="-20" max="19" bind:value={min} />
  <Range id="max-temp" label="Max temp" min="20" max="120" bind:value={max} />

</div>
<div class="termo">
  <div class="big">
    <Termometer temperature={temp} {min} {max} {bulb}/>
  </div>
</div>
<style>
  .controls {
    display: flex;
    gap: 20px;
  }
  .termo {
    display: flex;
    gap: 10px;
  }
  .big {

    width: 200px;
  }
  .small {
    display: inline-flex;
    width: 60px;
  }
</style>
