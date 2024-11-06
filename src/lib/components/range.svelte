<script>
  let { id, label, value = $bindable(), min = $bindable(), max = $bindable() } = $props();
</script>

<div class="range">
  <label for={id}>{label} ({value})</label>
  <input id={id} type="range" {min} {max} bind:value={value} />
</div>

<style>
  label {
    display: flex;
    flex-direction: column;
  }
</style>
