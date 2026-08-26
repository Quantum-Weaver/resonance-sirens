<script lang="ts">

	import { record } from '$lib/moments.svelte';
	import { CIRCLES, tintOf } from '$lib/circles';
	import { toC, fromC, readUnit, writeUnit, type Unit } from '$lib/temperature';

	let {
		open = false,
		day = null,
		dayLabel = null,
		onclose
	}: {
		open?: boolean;
		/** `YYYY-MM-DD`. Null means now, with the clock's own time. */
		day?: string | null;
		dayLabel?: string | null;
		onclose?: () => void;
	} = $props();

	let el: HTMLDialogElement | undefined = $state();
	let glyph = $state<string | null>(null);
	let time = $state('');
	let unit = $state<Unit>('C');
	let raw = $state('');
	let note = $state('');
	let busy = $state(false);

	$effect(() => {
		if (!el) return;
		if (open && !el.open) {
			unit = readUnit();
			el.showModal();
		}
		if (!open && el.open) el.close();
	});

	function reset() {
		glyph = null;
		time = '';
		raw = '';
		note = '';
	}

	function flip() {
		const c = toC(raw, unit);
		unit = unit === 'C' ? 'F' : 'C';
		writeUnit(unit);
		raw = fromC(c, unit);
	}

	async function keep() {
		if (!glyph || busy) return;
		busy = true;
		try {
			const tempC = toC(raw, unit);
			const n = note.trim() || null;
			if (day) await record.pressOn(day, glyph, time || null, tempC, n);
			else await record.press(glyph, tempC, n);
			reset();
			onclose?.();
		} finally {
			busy = false;
		}
	}
</script>

<dialog
	bind:this={el}
	onclose={() => {
		reset();
		onclose?.();
	}}
>
	<div class="sheet">
		<header>
			<h2>A moment</h2>
			<span class="on">{dayLabel ?? 'now'}</span>
		</header>

		<div class="circles" role="group" aria-label="Choose a circle">
			{#each CIRCLES as c (c)}
				<button
					class="circle"
					class:picked={glyph === c}
					style="--tint: {tintOf(c)}"
					onclick={() => (glyph = c)}
					aria-pressed={glyph === c}
					aria-label={record.wordFor(c) ?? 'a circle'}
					title={record.wordFor(c) ?? ''}
				>{c}</button>
			{/each}
		</div>

		{#if day}
			<label class="field">
				<span class="cap">time <em>if you want one</em></span>
				<input type="time" bind:value={time} aria-label="time" />
			</label>
		{/if}

		<label class="field">
			<span class="cap">temperature <em>if you took it</em></span>
			<span class="row">
				<input bind:value={raw} inputmode="decimal" placeholder={unit === 'F' ? '98.6' : '37.0'} aria-label="temperature" />
				<button type="button" class="unit" onclick={flip} aria-label="switch units">{unit === 'C' ? '°C' : '°F'}</button>
			</span>
		</label>

		<label class="field">
			<span class="cap">a note <em>if you want one</em></span>
			<textarea bind:value={note} rows="2" placeholder="anything at all" aria-label="a note"></textarea>
		</label>

		<div class="foot">
			<button class="soft primary" onclick={keep} disabled={!glyph || busy}>keep it</button>
			<button class="soft" onclick={() => el?.close()}>close</button>
		</div>
	</div>
</dialog>

<style>
	dialog {
		border: 1px solid var(--border-color);
		border-radius: 14px;
		background: var(--bg-surface);
		color: var(--text);
		padding: 0;
		width: min(26rem, calc(100vw - 2rem));
		max-height: 85vh;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.45);
	}

	.sheet {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		overflow-y: auto;
	}

	header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
	}
	h2 {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 640;
	}
	.on {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.circles {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}
	.circle {
		width: max(48px, 3rem);
		height: max(48px, 3rem);
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--tint) 40%, var(--border-color));
		background: color-mix(in srgb, var(--tint) 14%, transparent);
		color: inherit;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		display: grid;
		place-items: center;
	}
	.circle.picked {
		border-color: var(--accent);
		border-width: 2px;
		background: color-mix(in srgb, var(--tint) 34%, transparent);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.cap {
		font-size: 0.78rem;
		color: var(--text-secondary);
	}
	.cap em {
		color: var(--text-muted);
		font-style: normal;
	}
	.row {
		display: flex;
		gap: 0.4rem;
	}

	input,
	textarea {
		flex: 1;
		min-width: 0;
		padding: 0.5rem 0.65rem;
		border-radius: 8px;
		border: 1px solid var(--border-color);
		background: var(--bg);
		color: var(--text);
		font: inherit;
		font-size: 0.92rem;
		min-height: max(44px, 2.75rem);
		resize: vertical;
	}
	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--accent);
	}
	.unit {
		flex: 0 0 auto;
		min-width: max(56px, 3.5rem);
		min-height: max(44px, 2.75rem);
		border-radius: 8px;
		border: 1px solid var(--border-color);
		background: var(--bg);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	.foot {
		display: flex;
		gap: 0.5rem;
	}
	.soft {
		padding: 0.5rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		background: none;
		color: var(--text-secondary);
		font: inherit;
		font-size: 0.88rem;
		cursor: pointer;
		min-height: max(44px, 2.75rem);
	}
	.soft.primary {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 14%, transparent);
		color: var(--text);
		font-weight: 600;
	}
	.soft:disabled {
		opacity: 0.45;
		cursor: default;
	}
</style>
