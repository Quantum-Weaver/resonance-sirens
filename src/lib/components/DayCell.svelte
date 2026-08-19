<script lang="ts">
	// ==========================================================================
	// A DAY - one square, and it looks the same however full it is
	// ==========================================================================
	//
	// WHAT THIS FILE EXISTS TO HOLD: presence is never painted. Background,
	// border, opacity and box-shadow on a day she put four circles on and a day
	// she put none on are byte-identical. Nothing here branches a class or a
	// style on how many moments arrived, and there is no `:has()` doing the same
	// thing quietly instead. The only two variants are `today`, which is a fact
	// of the clock, and `open`, which is where her thumb is right now.
	//
	// AND NO DOT FOR A DAY SHE PUT NOTHING ON. In a field of seventy squares a
	// faint dot on each one reads as a trail of here, and here, and here you did
	// not - the app grading her with punctuation. The moon holds the square's
	// shape instead, and the moon is over every woman's day alike.
	//
	// A day that has not happened is a <div> rather than a <button> and is drawn
	// identically: no greying, nothing switched off, no sentence about it.

	import type { Day } from '$lib/days';
	import type { Moment } from '$lib/record';
	import { prefs } from '$lib/prefs.svelte';

	let {
		day,
		moments,
		today = false,
		open = false,
		ontap
	}: {
		day: Day;
		moments: Moment[];
		today?: boolean;
		open?: boolean;
		ontap?: (key: string) => void;
	} = $props();

	/** Three, and then this. Never a figure - a figure is the app telling her
	 *  how much of a day she had. */
	const MORE = '\u22EF';

	const shown = $derived(moments.slice(0, 3));
	const overflowing = $derived(moments.length > 3);

	/** The glyphs shrink so three fit a 44px square. It rides as an INLINE
	 *  CUSTOM PROPERTY on purpose: a class name keyed on how many there are is
	 *  presence, painted, one stylesheet rule away from becoming a border. */
	const mark = $derived(shown.length > 2 ? '0.72rem' : shown.length > 1 ? '0.86rem' : '1rem');
</script>

<button
	class="cell"
	class:today
	class:open
	style="--mark: {mark}"
	aria-expanded={open}
	aria-controls={open ? `day-panel-${day.key}` : undefined}
	aria-label={day.spelled}
	onclick={() => ontap?.(day.key)}
>
	<span class="num" aria-hidden="true">{day.dayOfMonth}</span>
	{#if prefs.sky}<span class="moon" aria-hidden="true">{day.moon}</span>{/if}
	<span class="marks" aria-hidden="true">
		{#each shown as m (m.id)}<span class="mark">{m.emoji}</span>{/each}
		{#if overflowing}<span class="mark">{MORE}</span>{/if}
		</span>
</button>

<style>
	/* ONE SHAPE. Every property that could betray presence is declared here and
	   nowhere else, so there is no second place for one to appear later. The
	   button and the div carry the same class and resolve to the same styles. */
	.cell {
		position: relative;
		display: block;
		aspect-ratio: 1;
		min-height: 44px;
		margin: 0;
		padding: 0;
		border: 1px solid var(--border-color);
		border-radius: 10px;
		background: transparent;
		box-shadow: none;
		opacity: 1;
		color: inherit;
		font: inherit;
		text-align: left;
		-webkit-appearance: none;
		appearance: none;
		cursor: default;
	}

	button.cell {
		cursor: pointer;
	}

	.cell:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Today. A fact of the clock, and never colour alone - the date number
	   carries the weight too, so it survives a greyscale screen. */
	.cell.today {
		border-color: var(--accent);
	}
	.cell.today .num {
		color: var(--text);
		font-weight: 700;
	}

	/* Open. Where her thumb is - Echoes' own selected-cell treatment. */
	.cell.open {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, transparent);
	}

	.num {
		position: absolute;
		top: 3px;
		left: 5px;
		font-size: 0.6rem;
		line-height: 1;
		color: var(--text-muted);
	}

	.moon {
		position: absolute;
		top: 3px;
		right: 5px;
		font-size: 0.55rem;
		line-height: 1;
		opacity: 0.5;
	}

	.marks {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 2px;
		padding: 0 2px;
		line-height: 1;
	}

	.mark {
		font-size: var(--mark, 1rem);
		line-height: 1;
	}

</style>
