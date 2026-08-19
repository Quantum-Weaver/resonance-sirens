<script lang="ts">
	// ==========================================================================
	// A MOMENT — one card in the list, the way an echo is one card in Echoes
	// ==========================================================================
	//
	// KP, 2026-08-18: "it should literally be echoes, just rebranding and
	// simplified." So this is Echoes' `.echo-card` with Echoes' own measurements
	// — the 2rem glyph, the name/time row, the sky line, the note — carrying a
	// moment instead of an echo.
	//
	// Simplified out of it: the sense badge, the subcategory, and the five
	// intensity dots. A circle has no category and nothing here rates anything.
	//
	// It expands in place instead of navigating to /add?edit= like Echoes does,
	// which is the one shape KP asked for by name: "entity cards in the hearth
	// that click to expand with a single emoji to press that opens the logging
	// details boxes if any are needed."

	import { goto } from '$app/navigation';
	import { dayKey } from '$lib/days';
	import { record } from '$lib/moments.svelte';
	import { tintOf } from '$lib/circles';
	import { prefs } from '$lib/prefs.svelte';
	import { bothUnits } from '$lib/temperature';
	import { moonPhase } from '$lib/sky';
	import type { Moment } from '$lib/record';
	import DetailBoxes from '$lib/components/DetailBoxes.svelte';

	let { moment }: { moment: Moment } = $props();

	let open = $state(false);
	let said = $state('');
	let arming = $state(false);

	const word = $derived(record.wordFor(moment.emoji));
	const temp = $derived(bothUnits(moment.tempC));

	/** Echoes derives the sky from the entry's own timestamp and stores nothing
	 *  (its `skyLine`, +page.svelte:144). Same here. */
	const sky = $derived.by(() => {
		if (!prefs.sky) return null;
		const m = moonPhase(new Date(moment.at));
		return `${m.emoji} ${m.phase}`;
	});

	function when(iso: string): string {
		const d = new Date(iso);
		const diff = Date.now() - d.getTime();
		if (diff < 60_000) return 'just now';
		if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
		if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
		return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
	}

	async function keep(tempC: number | null, note: string | null) {
		await record.attach(moment.id, tempC, note);
		said = 'kept.';
	}

	async function forget() {
		await record.drop(moment.id);
	}

	/** The entry, on its own day, in the calendar's Day view. */
	function showInCalendar() {
		goto(`/calendar?view=day&day=${dayKey(new Date(moment.at))}`);
	}
</script>

<div class="card" style="--tint: {tintOf(moment.emoji)}">
	<button class="head" onclick={() => (open = !open)} aria-expanded={open}>
		<span class="glyph">{moment.emoji}</span>
		<span class="body">
			<span class="line">
				<span class="name">{word ?? ''}</span>
				<span class="time">{when(moment.at)}</span>
			</span>
			{#if sky}<span class="sky">{sky}</span>{/if}
			{#if temp}<span class="meta">{temp}</span>{/if}
			{#if moment.note}<span class="note">{moment.note}</span>{/if}
		</span>
		<span class="hint" aria-hidden="true">{open ? '–' : '+'}</span>
	</button>

	{#if open}
		<div class="drawer">
			<p class="said" aria-live="polite">{said}</p>

			<DetailBoxes
				tempC={moment.tempC}
				note={moment.note}
				keepLabel="keep"
				hint={null}
				onkeep={keep}
			/>

			<div class="foot">
				<button class="soft" onclick={showInCalendar}>show in calendar</button>
				{#if arming}
					<button class="soft" onclick={forget}>forget it</button>
					<button class="soft" onclick={() => (arming = false)}>no</button>
				{:else}
					<button class="soft" onclick={() => (arming = true)}>forget</button>
				{/if}
				<button class="soft" onclick={() => (open = false)}>close</button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Echoes' .echo-card, tinted by the circle it carries. */
	.card {
		background: var(--bg-surface);
		border: 1px solid color-mix(in srgb, var(--tint) 22%, var(--border-color));
		border-radius: 12px;
		overflow: hidden;
	}

	.head {
		display: flex;
		gap: 0.875rem;
		align-items: flex-start;
		width: 100%;
		padding: 0.875rem 1rem;
		background: none;
		border: none;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
		box-sizing: border-box;
		min-height: 52px;
	}

	/* Echoes' 2rem echo-emoji, in a tinted well so a colour reads on any theme. */
	.glyph {
		font-size: 2rem;
		line-height: 1;
		flex-shrink: 0;
		width: 2.25rem;
		text-align: center;
	}

	.body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.line {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.name {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text);
		flex: 1;
		min-width: 0;
		word-break: break-word;
	}

	.time {
		font-size: 0.7rem;
		color: var(--text-muted);
		white-space: nowrap;
		flex-shrink: 0;
		padding-top: 0.1rem;
	}

	.sky {
		font-size: 0.68rem;
		color: var(--text-muted);
		opacity: 0.85;
	}

	.meta {
		font-size: 0.72rem;
		color: var(--text-muted);
	}

	.note {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
	}

	.hint {
		color: var(--text-muted);
		flex-shrink: 0;
		padding-top: 0.1rem;
	}

	.drawer {
		padding: 0 1rem 0.875rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.said {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.foot {
		display: flex;
		gap: 0.5rem;
	}

	.soft {
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
		background: none;
		color: inherit;
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
		min-height: max(40px, 2.5rem);
	}
</style>
