<script lang="ts">
	// ==========================================================================
	// SETTINGS — the few switches, and nothing that grades her
	// ==========================================================================
	//
	// This room exists for three reasons: the shell's foot door points here and
	// a door with no page is a 404 inside a window with no back button; the sky
	// needs its switch ("toggle on or off in settings as some may not be
	// interested" — KP, 2026-08-18); and the founding rose needs somewhere to be
	// chosen.
	//
	// WHAT IS NOT HERE, and is not an oversight: export and purge. They are
	// the-envelope's (resonance-awen/tools/the-envelope — "use it; do not
	// re-author it"), and the sovereignty room they belong in is HELD for TJ.
	// `record.ts` already carries both, working, waiting for her word.

	import { onMount } from 'svelte';
	import { themeStore, SIRENS_THEMES } from '$lib/stores/theme.svelte';
	import { prefs } from '$lib/prefs.svelte';
	import { record } from '$lib/moments.svelte';
	import { CIRCLES } from '$lib/circles';
	import CircleWord from '$lib/components/CircleWord.svelte';

	import { seal, filename, open as openEnvelope, purgeAfter } from '$lib/envelope';
	import type { Moment } from '$lib/record';

	const SIZES = ['small', 'medium', 'large'] as const;
	const TINTS = ['off', 'subtle', 'full'] as const;
	const MODES = [
		{ key: 'dark', label: 'Dark' },
		{ key: 'light', label: 'Light' },
		{ key: 'amoled', label: 'AMOLED' }
	] as const;

	/** Matched on presetName, not accent — Dark and AMOLED share an accent
	 *  colour, which is Echoes' own note at settings/+page.svelte:41. */
	const active = $derived(
		SIRENS_THEMES.find((t) => t.name === themeStore.config.presetName)?.key ?? 'rose'
	);
	const APP = 'resonance-sirens';

	let appVersion = $state('unknown');
	let report = $state<string | null>(null);
	let problem = $state<string | null>(null);
	let fileInput = $state<HTMLInputElement | null>(null);
	let purgeStep = $state<'idle' | 'sure' | 'certain'>('idle');

	type Carried = { moments: Moment[]; words: Record<string, string> };

	/** Straight from the record, never the loaded page — the envelope's own
	 *  first law, and Echoes' E1. */
	async function exportData() {
		const { moments, words } = await record.everything();
		const payload = seal<Carried>(
			APP,
			appVersion,
			{ moments, words },
			{ moments: moments.length, words: Object.keys(words).length }
		);
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename(APP);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async function importFile(ev: Event) {
		const input = ev.target as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		report = null;
		problem = null;
		try {
			const reading = openEnvelope<Carried>(JSON.parse(await file.text()), APP);
			if (reading.kind !== 'envelope') throw new Error('Not a Sirens export file.');
			const ms = Array.isArray(reading.data.moments) ? reading.data.moments : [];
			const ws = reading.data.words ?? {};
			const r = await record.restore(ms, ws);
			report = [
				`${r.added} ${r.added === 1 ? 'moment' : 'moments'} back`,
				r.kept ? `${r.kept} already here` : '',
				r.wordsAdded ? `${r.wordsAdded} words added` : '',
				r.wordsKept ? `${r.wordsKept} words kept as yours` : ''
			]
				.filter(Boolean)
				.join(' · ');
		} catch (err) {
			problem = err instanceof Error ? err.message : String(err);
		}
	}

	/** The export must be complete IN HAND before anything deletes — the
	 *  envelope's `purgeAfter`, not a hand-rolled sequence. */
	async function purgeNow(withExport: boolean) {
		problem = null;
		try {
			await purgeAfter(withExport ? exportData : null, () => record.purgeAll());
			purgeStep = 'idle';
			report = 'Everything is gone.';
		} catch (err) {
			problem = err instanceof Error ? err.message : String(err);
		}
	}

	onMount(async () => {
		prefs.load();
		if (!record.loaded) record.load();
		try {
			const { getVersion } = await import('@tauri-apps/api/app');
			appVersion = await getVersion();
		} catch {
			/* outside Tauri — the envelope still seals, it just says unknown */
		}
	});
</script>

<svelte:head><title>Settings · Sirens</title></svelte:head>

<main>
	<h1>Settings</h1>

	<!-- THEME FIRST — the family's settings layout. Echoes opens with Theme and
	     so does every app cut from it; KP, 2026-08-18: "place it at the top to
	     keep the setting layouts the same across family apps." -->
	<section>
		<h2>Theme</h2>
		<div class="theme-grid">
			{#each SIRENS_THEMES as opt (opt.key)}
				<button
					class="theme-card"
					class:selected={active === opt.key}
					style="--card-accent: {opt.accent};"
					onclick={() => themeStore.setPreset(opt.key)}
					aria-pressed={active === opt.key}
				>
					<span class="theme-icon">{opt.icon}</span>
					<span class="theme-name">{opt.name}</span>
					<div class="theme-swatch" style="background: {opt.accent};"></div>
				</button>
			{/each}
		</div>

		<div class="row">
			<span class="row-label">Display mode</span>
			<div class="chips" role="group" aria-label="Display mode">
				{#each MODES as { key, label } (key)}
					<button
						class="chip"
						class:active={themeStore.config.mode === key}
						onclick={() => themeStore.setMode(key)}
					>{label}</button>
				{/each}
			</div>
		</div>

		<div class="row">
			<span class="row-label">Font size</span>
			<div class="chips" role="group" aria-label="Font size">
				{#each SIZES as size (size)}
					<button
						class="chip"
						class:active={themeStore.config.fontSize === size}
						onclick={() => themeStore.setFontSize(size)}
					>{size}</button>
				{/each}
			</div>
		</div>

		<div class="row">
			<span class="row-label">Background tint</span>
			<div class="chips" role="group" aria-label="Background tint">
				{#each TINTS as tint (tint)}
					<button
						class="chip"
						class:active={themeStore.config.tint === tint}
						onclick={() => themeStore.setTint(tint)}
					>{tint}</button>
				{/each}
			</div>
		</div>
	</section>

	<section>
		<h2>Your circles</h2>
		<p class="say">
			Ten of them, and what any one means is yours. Give one a word if it helps
			you find it — it stays on this device and nothing reads it but you.
		</p>
		<div class="circles">
			{#each CIRCLES as glyph (glyph)}
				<CircleWord {glyph} />
			{/each}
		</div>
	</section>

	<section>
		<h2>The sky</h2>
		<p class="say">
			The moon over each day, and the moon that was up when you pressed. Facts
			only — nothing here reads them against you, and nothing ever will.
		</p>
		<button
			class="switch"
			role="switch"
			aria-checked={prefs.sky}
			onclick={() => prefs.setSky(!prefs.sky)}
		>
			<span class="switch__dot" class:on={prefs.sky} aria-hidden="true"></span>
			<span>{prefs.sky ? 'shown' : 'hidden'}</span>
		</button>
	</section>

	<section>
		<h2>Your data</h2>
		<p class="say">
			It is yours to carry and yours to destroy. The file holds every moment
			and every word you gave a circle, and it goes nowhere but where you put
			it.
		</p>

		<div class="chips">
			<button class="chip" onclick={exportData}>Export</button>
			<button class="chip" onclick={() => fileInput?.click()}>Import</button>
		</div>
		<input
			bind:this={fileInput}
			type="file"
			accept="application/json,.json"
			onchange={importFile}
			hidden
		/>

		{#if report}<p class="report" aria-live="polite">{report}</p>{/if}
		{#if problem}<p class="problem" aria-live="polite">{problem}</p>{/if}

		<div class="purge">
			{#if purgeStep === 'idle'}
				<button class="chip danger" onclick={() => (purgeStep = 'sure')}>Erase everything</button>
			{:else if purgeStep === 'sure'}
				<p class="say">This cannot be undone. Take the file first if you want one.</p>
				<div class="chips">
					<button class="chip danger" onclick={() => purgeNow(true)}>Export, then erase</button>
					<button class="chip danger" onclick={() => (purgeStep = 'certain')}>Erase without a file</button>
					<button class="chip" onclick={() => (purgeStep = 'idle')}>Keep it</button>
				</div>
			{:else}
				<p class="say">Last word. Everything, gone.</p>
				<div class="chips">
					<button class="chip danger" onclick={() => purgeNow(false)}>Erase it all</button>
					<button class="chip" onclick={() => (purgeStep = 'idle')}>Keep it</button>
				</div>
			{/if}
		</div>
	</section>

	<p class="foot">
		Nothing in this app leaves this device. There is no account, no sync, no
		network call anywhere in it.
	</p>
</main>

<style>
	main {
		width: 100%;
		max-width: 30rem;
		margin: 0 auto;
		padding: 1.5rem 1rem 3rem;
		color: var(--text);
	}
	h1 {
		margin: 0 0 1.2rem;
		font-size: 1.5rem;
		font-weight: 640;
		letter-spacing: -0.02em;
	}
	section {
		margin-bottom: 1.6rem;
	}
	h2 {
		margin: 0 0 0.3rem;
		font-size: 0.95rem;
		font-weight: 600;
	}
	.say {
		margin: 0 0 0.6rem;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.switch {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.4rem 0.9rem 0.4rem 0.6rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		background: none;
		color: inherit;
		font: inherit;
		font-size: 0.88rem;
		cursor: pointer;
		min-height: max(48px, 3rem);
	}
	.switch__dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1px solid var(--border-color);
		background: transparent;
	}
	.switch__dot.on {
		background: var(--accent);
		border-color: var(--accent);
	}

	/* Echoes' theme-grid, unchanged in shape so the room reads the same. */
	.theme-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.65rem;
		margin-bottom: 0.9rem;
	}
	.theme-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		padding: 1rem 0.5rem 0.75rem;
		background: var(--bg-surface);
		border: 2px solid var(--border-color);
		border-radius: 14px;
		font: inherit;
		color: inherit;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
	}
	.theme-card.selected {
		border-color: var(--card-accent);
		background: color-mix(in srgb, var(--card-accent) 10%, var(--bg-surface));
	}
	.theme-icon {
		font-size: 1.6rem;
		line-height: 1;
	}
	.theme-name {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--text-secondary);
	}
	.theme-swatch {
		width: 24px;
		height: 4px;
		border-radius: 2px;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 0.6rem;
	}
	.row-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	@media (prefers-reduced-motion: reduce) {
		.theme-card {
			transition: none;
		}
	}

	.circles {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.chip {
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

	.chip.danger {
		border-color: color-mix(in srgb, #c96f6f 60%, var(--border-color));
		color: var(--text);
	}
	.chip.danger:hover {
		background: color-mix(in srgb, #c96f6f 12%, transparent);
	}

	.purge {
		margin-top: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.report,
	.problem {
		margin: 0.6rem 0 0;
		font-size: 0.85rem;
	}
	.report {
		color: var(--text-secondary);
	}
	.problem {
		color: #c96f6f;
	}

	.foot {
		margin: 2rem 0 0;
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--text-muted);
	}
</style>
