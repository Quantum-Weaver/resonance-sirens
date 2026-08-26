<script lang="ts">

	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { HEADS, ribbon, byDay, todayKey, type DayKey, type Day } from '$lib/days';
	import { record } from '$lib/moments.svelte';
	import { prefs } from '$lib/prefs.svelte';
	import type { Moment } from '$lib/record';
	import DayCell from '$lib/components/DayCell.svelte';
	import DayPanel from '$lib/components/DayPanel.svelte';
	import QuickAdd from '$lib/components/QuickAdd.svelte';

	type View = 'month' | 'week' | 'day';

	/** How many more rows `earlier weeks` reaches back for. */
	const STRIDE = 12;

	/** One shared list for every day she has put nothing on. */
	const NOTHING: Moment[] = [];

	/** The calendar's own arithmetic, from her own local date — never a subtraction of milliseconds. */
	function dayOf(key: DayKey): Date {
		const [y, m, d] = key.split('-').map(Number);
		return new Date(y, m - 1, d);
	}

	function shift(d: Date, n: number): Date {
		const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		out.setDate(out.getDate() + n);
		return out;
	}

	const tkey = todayKey();
	const today = dayOf(tkey);

	let view = $state<View>('month');
	let back = $state(STRIDE);
	let ahead = $state(4);
	let anchor = $state(today);
	let openKey = $state<DayKey | null>(null);
	let tail: HTMLDivElement | undefined = $state();
	let adding = $state(false);

	const days = $derived(byDay(record.moments));

	// --- month
	const rows = $derived(ribbon(today, back, ahead));
	const openDay = $derived(
		openKey === null ? null : (rows.flatMap((w) => w.days).find((d) => d.key === openKey) ?? null)
	);

	// --- week and day
	const window1 = $derived(ribbon(anchor, 1)[0]);
	const anchorKey = $derived(
		`${anchor.getFullYear()}-${String(anchor.getMonth() + 1).padStart(2, '0')}-${String(anchor.getDate()).padStart(2, '0')}`
	);
	const theDay = $derived<Day | null>(window1.days.find((d) => d.key === anchorKey) ?? null);
	const weekOpen = $derived<Day | null>(
		openKey === null ? null : (window1.days.find((d) => d.key === openKey) ?? null)
	);

	/** Forward is not capped. */
	function step(n: number) {
		anchor = shift(anchor, n);
		openKey = null;
	}

	function setView(v: View) {
		// Carry the day she was looking at across the switch.
		if (openKey) anchor = dayOf(openKey);
		view = v;
		openKey = null;
	}

	/** The day the quick add lands on: whichever she has open, else the one she
	 *  is stepped to, else today. */
	const addKey = $derived(openKey ?? (view === 'month' ? tkey : anchorKey));
	const addDay = $derived(
		rows.flatMap((w) => w.days).find((d) => d.key === addKey) ??
			window1.days.find((d) => d.key === addKey) ??
			null
	);

	function tap(key: DayKey) {
		openKey = openKey === key ? null : key;
	}

	onMount(() => {
		prefs.load();
		if (!record.loaded) void record.load();

		// Arrived from a card's "show in calendar" — land on that day, in that view.
		const q = page.url.searchParams;
		const wanted = q.get('view');
		const on = q.get('day');
		if (wanted === 'day' || wanted === 'week' || wanted === 'month') view = wanted;
		if (on && /^\d{4}-\d{2}-\d{2}$/.test(on)) {
			anchor = dayOf(on);
			if (view === 'month') openKey = on;
		}
		if (view !== 'month') return;
		void tick().then(() => tail?.scrollIntoView({ block: 'end', behavior: 'auto' }));
	});
</script>

<svelte:head><title>Calendar · Sirens</title></svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') openKey = null;
	}}
/>

<section class="room">
	<header class="top">
		<h1>Calendar</h1>
		<p class="lede">Every day is here, and the moon that was over it.</p>
	</header>

	<div class="views" role="group" aria-label="View">
		{#each [['month', 'Month'], ['week', 'Week'], ['day', 'Day']] as [key, label] (key)}
			<button
				class="chip"
				class:active={view === key}
				aria-pressed={view === key}
				onclick={() => setView(key as View)}
			>{label}</button>
		{/each}
	</div>

	{#if view === 'month'}
		<div class="reach">
			<button class="soft wide" onclick={() => (back += STRIDE)}>earlier weeks</button>
			<button class="soft wide" onclick={() => (ahead += STRIDE)}>later weeks</button>
		</div>

		<div class="heads" aria-hidden="true">
			{#each HEADS as h (h)}<span>{h}</span>{/each}
		</div>

		<div class="ribbon">
			{#each rows as week (week.key)}
				{#if week.caption}<p class="caption">{week.caption}</p>{/if}

				<div class="week">
					{#each week.days as d (d.key)}
						<DayCell
							day={d}
							moments={days.get(d.key) ?? NOTHING}
							today={d.key === tkey}
							open={d.key === openKey}
							ontap={tap}
						/>
					{/each}
				</div>

				{#if openDay !== null && week.days.some((d) => d.key === openKey)}
					<DayPanel
						day={openDay}
						moments={days.get(openDay.key) ?? NOTHING}
						onclose={() => (openKey = null)}
					/>
				{/if}
			{/each}
		</div>
	{:else}
		<div class="stepper">
			<button class="soft" onclick={() => step(view === 'week' ? -7 : -1)} aria-label="earlier">‹</button>
			<span class="anchor">
				{view === 'week'
					? `${window1.days[0].spelled.replace(/^[A-Za-z]+, /, '')} — ${window1.days[6].spelled.replace(/^[A-Za-z]+, /, '')}`
					: (theDay?.spelled ?? '')}
			</span>
			<button class="soft" onclick={() => step(view === 'week' ? 7 : 1)} aria-label="later">›</button>
		</div>
	{/if}

	{#if view === 'week'}
		<div class="heads" aria-hidden="true">
			{#each HEADS as h (h)}<span>{h}</span>{/each}
		</div>
		<div class="week">
			{#each window1.days as d (d.key)}
				<DayCell
					day={d}
					moments={days.get(d.key) ?? NOTHING}
					today={d.key === tkey}
					open={d.key === openKey}
					ontap={tap}
				/>
			{/each}
		</div>
		{#if weekOpen !== null}
			<DayPanel day={weekOpen} moments={days.get(weekOpen.key) ?? NOTHING} onclose={() => (openKey = null)} />
		{:else}
			<p class="hint">Tap a day to open it.</p>
		{/if}
	{/if}

	{#if view === 'day' && theDay !== null}
		<!-- In Day there is no grid behind the panel, so close goes back to Month. -->
		<DayPanel day={theDay} moments={days.get(theDay.key) ?? NOTHING} onclose={() => setView('month')} />
	{/if}

	<div class="tail" bind:this={tail} aria-hidden="true"></div>
</section>

<button class="fab" onclick={() => (adding = true)} aria-label="quick add a moment">+</button>

<QuickAdd
	open={adding}
	day={addKey}
	dayLabel={addDay?.spelled ?? null}
	onclose={() => (adding = false)}
/>

<style>
	.room {
		width: 100%;
		max-width: 34rem;
		margin: 0 auto;
		padding: 1.5rem 0.75rem calc(104px + env(safe-area-inset-bottom, 0px));
	}

	.top {
		margin-bottom: 0.9rem;
	}

	h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 640;
		letter-spacing: -0.02em;
		color: var(--text);
	}

	.lede {
		margin: 0.15rem 0 0;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.reach {
		display: flex;
		gap: 0.4rem;
	}

	.views {
		display: flex;
		gap: 0.4rem;
		margin-bottom: 0.75rem;
	}

	.chip {
		flex: 1;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		background: none;
		color: var(--text-secondary);
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
		min-height: max(44px, 2.75rem);
	}
	.chip.active {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 12%, transparent);
		color: var(--text);
		font-weight: 600;
	}

	.stepper {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.6rem;
	}

	.anchor {
		flex: 1;
		text-align: center;
		font-size: 0.9rem;
		color: var(--text);
	}

	.soft {
		border: 1px solid var(--border-color);
		background: transparent;
		color: var(--text-secondary);
		border-radius: 999px;
		padding: 0.45rem 0.9rem;
		min-height: 44px;
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
		transition: border-color 0.12s linear;
	}

	.soft:hover {
		border-color: var(--accent);
	}

	.soft:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.soft:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.wide {
		width: 100%;
	}

	.heads {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.3rem;
		position: sticky;
		top: 0;
		z-index: 1;
		background: var(--bg);
		padding: 0.5rem 0 0.35rem;
	}

	.heads span {
		font-size: 0.6rem;
		color: var(--text-muted);
		text-align: center;
	}

	.ribbon {
		padding-bottom: 0.5rem;
	}

	.caption {
		margin: 0.9rem 0 0.3rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--text-secondary);
	}

	/* Seven equal columns — the separation is the GRID's, not the cell's. */
	.week {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.3rem;
	}

	.hint {
		margin: 0.8rem 0 0;
		font-size: 0.85rem;
		color: var(--text-muted);
		text-align: center;
	}

	.tail {
		height: 0;
	}

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
	}

	@media (prefers-reduced-motion: reduce) {
		.soft {
			transition: none;
		}
	}
</style>
