<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="shell">
  {@render children()}
</div>

<style>
  .shell {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: var(--ground);
    color: var(--ink);
  }
</style>
