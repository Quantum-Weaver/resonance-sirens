<script lang="ts">
  let { size = 20, color = 'currentColor' }: { size?: number; color?: string } = $props();
</script>
<!-- A frame and a rule, and nothing else.
     Every calendar icon ever drawn puts a mark on one square, and it is always
     the same square. An icon that points at a day has already said which day
     is the one worth pointing at. This room does not paint presence onto a
     square, so its door does not either - no dot, no fill, no marked date. -->
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
  <path d="M3 10h18" />
</svg>
