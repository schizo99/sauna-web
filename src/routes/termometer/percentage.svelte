<script>
  let { children } = $props();
</script>
<div class="percentage">
  <span class="text">
    {@render children?.()}
  </span>
</div>
<style>
  .percentage {
    --color: black;
    --text: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: left;
    filter: drop-shadow(0 0 5px rgba(0,0,0,.5));
  }
  .text {
    display: flex;
    font-size: 16px;
    min-width: 60px;
    color: white;
    background: var(--color);
    min-height: 40px;
    align-items: center;
    justify-content: center;
    padding-right: 5px;
    border-radius: 0 4px 4px 0;
    font-weight: bold;
  }
  .percentage:before{
    content: "";

    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-right: 20px solid var(--color);
  }
</style>
