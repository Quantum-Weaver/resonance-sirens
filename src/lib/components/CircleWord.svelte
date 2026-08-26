<script lang="ts">

	import { record } from '$lib/moments.svelte';
	import { tintOf } from '$lib/circles';

	let { glyph }: { glyph: string } = $props();

	let draft = $state('');
	let touched = $state(false);

	const saved = $derived(record.wordFor(glyph));

	$effect(() => {
		if (!touched) draft = record.wordFor(glyph) ?? '';
	});

	async function keep() {
		await record.name(glyph, draft);
		touched = false;
	}
</script>

<div class="row" style="--tint: {tintOf(glyph)}">
	<span class="circle" aria-hidden="true">{glyph}</span>
	<input
		bind:value={draft}
		oninput={() => (touched = true)}
		placeholder="your word, if you want one"
		aria-label="your word for this circle"
	/>
	{#if touched && draft !== (saved ?? '')}
		<button class="soft" onclick={keep}>keep</button>
	{/if}
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.circle {
		flex: 0 0 auto;
		width: max(44px, 2.75rem);
		height: max(44px, 2.75rem);
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--tint) 40%, var(--border-color));
		background: color-mix(in srgb, var(--tint) 14%, transparent);
		font-size: 1.4rem;
		line-height: 1;
		display: grid;
		place-items: center;
	}

	input {
		flex: 1;
		min-width: 0;
		padding: 0.5rem 0.65rem;
		border-radius: 8px;
		border: 1px solid var(--border-color);
		background: var(--bg-surface);
		color: var(--text);
		font: inherit;
		font-size: 0.9rem;
		min-height: max(44px, 2.75rem);
	}
	input:focus {
		outline: none;
		border-color: var(--accent);
	}

	.soft {
		flex: 0 0 auto;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		border: 1px solid var(--accent);
		background: color-mix(in srgb, var(--accent) 12%, transparent);
		color: var(--text);
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
		min-height: max(44px, 2.75rem);
	}
</style>
