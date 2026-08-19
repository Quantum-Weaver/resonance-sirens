<script lang="ts">
	// ==========================================================================
	// A DAY, OPENED - in the flow, under the week it belongs to
	// ==========================================================================
	//
	// No modal, no overlay, nothing fixed, no focus trap. The row opens and the
	// square she tapped stays visible above it, so she never loses her place and
	// nothing has to be dismissed before the app works again. Hearth's card
	// idiom, held: state on a rune, the body behind an {#if}, the detail boxes
	// inline in flow, and nothing moves.
	//
	// THE SKY IS FACTS AND ONLY FACTS. The moon over a day is identical for
	// every woman alive, which is precisely why it is safe to print - and
	// precisely why nothing in this app may ever set it beside her moments as a
	// relationship. Which moon was up when she pressed is a fact about that
	// press, the way the clock time is. An alignment, a correlation, a "tends
	// toward" is the thing we refuse, and there is no function here that could
	// compute one.
	//
	// A day she put nothing on opens exactly the same way and says nothing at
	// all about that. The foot below is the foot on every day alike.

	import { clockOf, type Day } from '$lib/days';
	import { record } from '$lib/moments.svelte';
	import { prefs } from '$lib/prefs.svelte';
	import { bothUnits } from '$lib/temperature';
	import { CIRCLES, tintOf } from '$lib/circles';
	import { moonPhase } from '$lib/sky';
	import type { Moment } from '$lib/record';
	import DetailBoxes from '$lib/components/DetailBoxes.svelte';

	let {
		day,
		moments,
		onclose
	}: {
		day: Day;
		moments: Moment[];
		onclose?: () => void;
	} = $props();

	let changing = $state<string | null>(null);
	/** Two-step, in place. There is no dialog anywhere in this app - the second
	 *  tap lands on the same thumb-width of screen the first one did. */
	let arming = $state<string | null>(null);
	let time = $state('');
	let said = $state('');

	async function keep(id: string, tempC: number | null, note: string | null) {
		await record.attach(id, tempC, note);
		changing = null;
		said = 'kept';
	}

	async function drop(id: string) {
		await record.drop(id);
		arming = null;
		said = 'gone';
	}

	async function put(glyph: string) {
		await record.pressOn(day.key, glyph, time.trim() ? time : null);
		said = 'kept';
	}
</script>

<section class="panel" id="day-panel-{day.key}" aria-label={day.spelled}>
	<header class="head">
		<div class="when">
			<h2>{day.spelled}</h2>
			{#if prefs.sky}
				<p class="phase"><span aria-hidden="true">{day.moon}</span> {day.moonName}</p>
			{/if}
		</div>
		<button class="soft" onclick={() => onclose?.()}>close</button>
	</header>

	{#each moments as m (m.id)}
		{@const air = moonPhase(new Date(m.at))}
		<div class="moment">
			<div class="line">
				<span class="glyph" aria-hidden="true">{m.emoji}</span>
				<span class="facts">
					{#if record.wordFor(m.emoji)}<span class="word">{record.wordFor(m.emoji)}</span>{/if}
					{#if clockOf(m)}<span class="fact">{clockOf(m)}</span>{/if}
					{#if bothUnits(m.tempC)}<span class="fact">{bothUnits(m.tempC)}</span>{/if}
					{#if prefs.sky}
						<span class="fact sky"><span aria-hidden="true">{air.emoji}</span> {air.phase}</span>
					{/if}
				</span>
			</div>

			{#if m.note}<p class="note">{m.note}</p>{/if}

			<div class="acts">
				<button
					class="soft"
					aria-expanded={changing === m.id}
					onclick={() => (changing = changing === m.id ? null : m.id)}
				>
					change
				</button>
				{#if arming === m.id}
					<button class="soft" onclick={() => drop(m.id)}>forget it</button>
					<button class="soft" onclick={() => (arming = null)}>no</button>
				{:else}
					<button class="soft" onclick={() => (arming = m.id)}>forget</button>
				{/if}
			</div>

			{#if changing === m.id}
				<DetailBoxes
					tempC={m.tempC}
					note={m.note}
					keepLabel="keep it"
					hint={null}
					onkeep={(tempC, note) => keep(m.id, tempC, note)}
				/>
			{/if}
		</div>
	{/each}

	<div class="foot">
		<p class="cap" id="put-{day.key}">put something on this day</p>
		<label class="at">
			<span class="cap">time</span>
			<input type="time" bind:value={time} />
		</label>
		<div class="circles" role="group" aria-labelledby="put-{day.key}">
			{#each CIRCLES as c (c)}
				<button
					class="circle"
					style="--tint: {tintOf(c)}"
					aria-label={record.wordFor(c)}
					onclick={() => put(c)}
				>
					{c}
				</button>
			{/each}
		</div>
	</div>

	<p class="said" aria-live="polite">{said}</p>
</section>

<style>
	.panel {
		border: 1px solid var(--border-color);
		border-radius: 12px;
		background: var(--bg-surface);
		color: var(--text);
		padding: 0.75rem 0.85rem 0.85rem;
		margin: 0.4rem 1px 0.7rem;
	}

	.head {
		display: flex;
		align-items: flex-start;
	}

	.when {
		flex: 1;
		min-width: 0;
		margin-right: 0.5rem;
	}

	h2 {
		margin: 0;
		font-size: 0.98rem;
		font-weight: 620;
		letter-spacing: -0.01em;
	}

	.phase {
		margin: 0.15rem 0 0;
		font-size: 0.78rem;
		color: var(--text-muted);
	}

	.moment {
		border-radius: 10px;
		background: color-mix(in srgb, currentColor 6%, transparent);
		padding: 0.5rem 0.6rem;
		margin-top: 0.55rem;
	}

	.line {
		display: flex;
		align-items: flex-start;
	}

	.glyph {
		font-size: 1.35rem;
		line-height: 1.15;
		margin-right: 0.5rem;
		flex: 0 0 auto;
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		min-width: 0;
		margin: 0 -0.3rem;
	}

	.word {
		margin: 0 0.3rem;
		font-size: 0.86rem;
		color: var(--text);
	}

	.fact {
		margin: 0 0.3rem;
		font-size: 0.78rem;
		color: var(--text-secondary);
	}

	.fact.sky {
		color: var(--text-muted);
	}

	.note {
		margin: 0.35rem 0 0;
		font-size: 0.86rem;
		color: var(--text);
		white-space: pre-wrap;
	}

	.acts {
		display: flex;
		flex-wrap: wrap;
		margin: 0.4rem -0.2rem -0.2rem;
	}

	.acts .soft {
		margin: 0.2rem;
	}

	.soft {
		border: 1px solid color-mix(in srgb, currentColor 28%, transparent);
		background: transparent;
		color: var(--text-secondary);
		border-radius: 999px;
		padding: 0.35rem 0.85rem;
		min-height: 40px;
		font: inherit;
		font-size: 0.82rem;
		cursor: pointer;
		transition:
			border-color 0.12s linear,
			background 0.12s linear;
	}

	.soft:hover {
		border-color: var(--accent);
	}

	.foot {
		margin-top: 0.8rem;
		padding-top: 0.7rem;
		border-top: 1px solid color-mix(in srgb, currentColor 14%, transparent);
	}

	.cap {
		margin: 0;
		font-size: 0.76rem;
		color: var(--text-muted);
	}

	.at {
		display: flex;
		align-items: center;
		margin-top: 0.45rem;
	}

	.at .cap {
		margin-right: 0.45rem;
	}

	input[type='time'] {
		border: 1px solid var(--border-color);
		background: transparent;
		color: var(--text);
		border-radius: 10px;
		padding: 0.4rem 0.55rem;
		min-height: 44px;
		font: inherit;
		font-size: 0.88rem;
	}

	.circles {
		display: flex;
		flex-wrap: wrap;
		margin: 0.4rem -0.2rem 0;
	}

	.circle {
		width: 44px;
		height: 44px;
		margin: 0.2rem;
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
		background: color-mix(in srgb, var(--tint) 12%, transparent);
		color: inherit;
		font-size: 1.4rem;
		line-height: 1;
		cursor: pointer;
		transition: border-color 0.12s linear;
	}

	.circle:hover {
		border-color: var(--accent);
	}

	.soft:focus-visible,
	.circle:focus-visible,
	input[type='time']:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* One line, and it holds its height so nothing shifts when it speaks. */
	.said {
		margin: 0.6rem 0 0;
		min-height: 1.1rem;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.soft,
		.circle {
			transition: none;
		}
	}
</style>
