<script lang="ts">
	// ==========================================================================
	// HOME — the log. Empty until she presses the button.
	// ==========================================================================
	//
	// KP, 2026-08-18: "home should not have anything until a card is added by
	// pressing a button (exactly like what echoes had)" and "it should literally
	// be echoes, just rebranding and simplified."
	//
	// So this is resonance-echoes/src/routes/+page.svelte with the domain
	// swapped: its empty state, its fixed FAB at the same offsets, its card list.
	// A card here is a LOGGED MOMENT, exactly as a card there is a logged echo.
	//
	// SIMPLIFIED OUT: the search field, the sense chips, the emoji chips, the
	// sort row, the filter status, and the count badge in the header. Echoes has
	// eleven senses and hundreds of symbols to sift; sirens has ten circles.
	//
	// The ten circles themselves live in Settings, at KP's word — "what i see in
	// the home screen now, should be in setting screen." Here they appear only
	// inside the quick-add dialog the + opens, which is the press that makes a
	// card. That dialog is shared with the calendar, so a moment is entered the
	// same way in both rooms.

	import { onMount } from 'svelte';
	import { record } from '$lib/moments.svelte';
	import MomentCard from '$lib/components/MomentCard.svelte';
	import QuickAdd from '$lib/components/QuickAdd.svelte';
	import { prefs } from '$lib/prefs.svelte';

	let adding = $state(false);
	let shown = $state(50);

	const visible = $derived(record.moments.slice(0, shown));
	const more = $derived(record.moments.length > shown);

	onMount(() => {
		prefs.load();
		record.load();
	});
</script>

<svelte:head><title>Sirens</title></svelte:head>

<div class="home" style="padding-top: env(safe-area-inset-top, 0px);">
	<header class="head">
		<h1>Sirens</h1>
	</header>

	{#if record.moments.length === 0}
		<div class="empty">
			<div class="icon" aria-hidden="true">○</div>
			<p class="heading">Nothing here yet.</p>
			<p class="sub">Tap + to put down a circle.</p>
		</div>
	{:else}
		<div class="list">
			{#each visible as m (m.id)}
				<MomentCard moment={m} />
			{/each}
			{#if more}
				<button class="load" onclick={() => (shown += 50)}>Load more</button>
			{/if}
		</div>
	{/if}

	<!-- Echoes' FAB, at Echoes' own offsets so it clears the ComfortBar and the
	     Android safe area exactly as it does there. -->
	<button class="fab" onclick={() => (adding = true)} aria-label="quick add a moment">+</button>
</div>

<QuickAdd open={adding} onclose={() => (adding = false)} />

<style>
	.home {
		min-height: 100%;
	}

	.head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem 0.75rem;
		border-bottom: 1px solid var(--border-color);
	}

	h1 {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text);
		margin: 0;
	}


	/* Echoes' empty state, word for word in shape. */
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		gap: 0.5rem;
		text-align: center;
	}
	.icon {
		font-size: 3rem;
		line-height: 1;
		color: var(--text-muted);
		margin-bottom: 0.5rem;
	}
	.heading {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text);
		margin: 0;
	}
	.sub {
		font-size: 0.9rem;
		color: var(--text-muted);
		margin: 0;
	}

	.list {
		padding: 0.75rem 1rem calc(104px + env(safe-area-inset-bottom, 0px));
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.load {
		width: 100%;
		margin-top: 0.5rem;
		padding: 0.75rem;
		background: var(--bg-surface);
		border: 1px solid var(--border-color);
		border-radius: 10px;
		color: var(--text-muted);
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.load:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	/* Echoes' quick-log FAB — same size, same corner, same reserve. */
	.fab {
		position: fixed;
		bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 0.75rem);
		right: 1rem;
		z-index: 100;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: var(--bg-surface);
		border: 2px solid var(--accent);
		color: var(--accent);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 14px color-mix(in srgb, var(--accent) 35%, transparent);
		transition: transform 0.15s, background 0.2s, color 0.2s, border-color 0.2s;
	}
	.fab:active {
		transform: scale(0.9);
	}
	@media (prefers-reduced-motion: reduce) {
		.fab {
			transition: none;
		}
	}
</style>
