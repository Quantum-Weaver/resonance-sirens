<script lang="ts">

	import { toC, fromC, readUnit, writeUnit, type Unit } from '$lib/temperature';

	let {
		tempC = null,
		note = null,
		keepLabel = 'keep that too',
		hint = null,
		onkeep
	}: {
		tempC?: number | null;
		note?: string | null;
		keepLabel?: string;
		hint?: string | null;
		onkeep: (tempC: number | null, note: string | null) => void | Promise<void>;
	} = $props();

	let unit = $state<Unit>('C');
	let raw = $state('');
	let text = $state('');

	// Filled here rather than at declaration so the boxes track the prop instead of capturing its first value.
	$effect(() => {
		const u = readUnit();
		unit = u;
		raw = fromC(tempC, u);
		text = note ?? '';
	});

	/** The flip CONVERTS her number rather than reinterpreting it. */
	function flip() {
		const c = toC(raw, unit);
		unit = unit === 'C' ? 'F' : 'C';
		writeUnit(unit);
		raw = fromC(c, unit);
	}
</script>

<div class="boxes">
	{#if hint}<p class="hint">{hint}</p>{/if}

	<label class="box">
		<span class="cap">temperature <em>if you took it</em></span>
		<span class="row">
			<input
				bind:value={raw}
				inputmode="decimal"
				placeholder={unit === 'F' ? '98.6' : '37.0'}
				aria-label="temperature"
			/>
			<button
				type="button"
				class="unit"
				onclick={flip}
				aria-label="switch to {unit === 'C' ? 'fahrenheit' : 'celsius'}"
			>
				{unit === 'C' ? '°C' : '°F'}
			</button>
		</span>
	</label>

	<label class="box">
		<span class="cap">a note <em>if you want one</em></span>
		<textarea bind:value={text} rows="2" placeholder="anything at all" aria-label="a note"></textarea>
	</label>

	<button class="soft-btn primary" onclick={() => onkeep(toC(raw, unit), text.trim() || null)}>
		{keepLabel}
	</button>
</div>

<style>
	.boxes {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}
	.hint {
		margin: 0;
		font-size: 0.8rem;
		color: var(--text-muted);
	}
	.box {
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

	/* Inner chrome resolves against currentColor, not the theme, so these boxes survive an arbitrary card tint. */
	input,
	textarea {
		flex: 1;
		width: 100%;
		padding: 0.5rem 0.65rem;
		border-radius: 8px;
		border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
		background: color-mix(in srgb, currentColor 6%, transparent);
		color: inherit;
		font: inherit;
		font-size: 0.92rem;
		min-height: max(44px, 2.75rem);
		resize: vertical;
	}
	.unit {
		flex: 0 0 auto;
		min-width: max(56px, 3.5rem);
		min-height: max(44px, 2.75rem);
		border-radius: 8px;
		border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
		background: color-mix(in srgb, currentColor 8%, transparent);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
	.soft-btn {
		align-self: flex-start;
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
	.soft-btn.primary {
		background: color-mix(in srgb, currentColor 12%, transparent);
		font-weight: 600;
	}
</style>
