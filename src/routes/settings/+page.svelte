<script lang="ts">
	// ==========================================================================
	// SETTINGS — the few switches, and nothing that grades her
	// ==========================================================================
	//
	// THE LAYOUT IS ECHOES' — at KP's word, 2026-08-23: "make its settings screen
	// match the layout our envelope has in echoes so it better resembles our
	// apps settings layout." The shape is the mother's, section for section
	// (header · THEME · … · DATA SOVEREIGNTY · ABOUT), the styles carried from
	// `resonance-echoes/src/routes/settings/+page.svelte` so the room reads as
	// one family; Sirens' own rooms (the circles, the sky) sit between in the
	// same shape, and the WORDS stay Sirens' — her app, her register.
	//
	// WHAT ECHOES HAS THAT THIS ROOM REFUSES, on this app's own law: a count.
	// Echoes opens Data Sovereignty with "N echoes stored"; `record.ts` carries
	// no count function and the door forbids one (docs/CHECKLIST.md, Phase 1),
	// so that line is a sentence here and no button is gated on a number.
	//
	// The sky switch ("toggle on or off in settings as some may not be
	// interested" — KP, 2026-08-18) and the circles' words are hers; export,
	// import and purge ride the-envelope (resonance-awen/tools/the-envelope —
	// "use it; do not re-author it") and are never hand-rolled.

	import { onMount } from 'svelte';
	import { themeStore, SIRENS_THEMES } from '$lib/stores/theme.svelte';
	import { prefs } from '$lib/prefs.svelte';
	import { record } from '$lib/moments.svelte';
	import { CIRCLES } from '$lib/circles';
	import CircleWord from '$lib/components/CircleWord.svelte';

	import { seal, filename, open as openEnvelope, purgeAfter } from '$lib/envelope';
	import type { Moment } from '$lib/record';

	const APP = 'resonance-sirens';
	const SANCTUARY_URL = 'https://audhdities.com';

	// ── Theme ─────────────────────────────────────────────────────────────────
	// Every preset the shelf holds, Rose leading — derived in the store, never
	// listed here, so a preset born on the shelf appears on this wall the same
	// day (Rainbow and Progress Pride arrived this way, 2026-08-23).

	/** Matched on the stored presetName, not the accent — Dark and AMOLED share
	 *  an accent colour (Echoes' own note at settings/+page.svelte). */
	const activePreset = $derived(
		SIRENS_THEMES.find((t) => t.presetName === themeStore.config.presetName)?.key ?? 'rose'
	);

	const displayModes = [
		{ key: 'light' as const, label: '☀️ Light' },
		{ key: 'dark' as const, label: '🌙 Dark' },
		{ key: 'amoled' as const, label: '⚫ AMOLED' }
	];
	const tintLevels = [
		{ key: 'off' as const, label: 'Off' },
		{ key: 'subtle' as const, label: 'Subtle' },
		{ key: 'full' as const, label: 'Full' }
	];
	const fontSizes = [
		{ key: 'small' as const, label: 'Small' },
		{ key: 'medium' as const, label: 'Medium' },
		{ key: 'large' as const, label: 'Large' }
	];

	// ── Data Sovereignty ──────────────────────────────────────────────────────

	let appVersion = $state('');
	let importInput = $state<HTMLInputElement | null>(null);
	let importReport = $state<string | null>(null);
	let importError = $state<string | null>(null);

	// purgeState runs the double confirmation for both purge paths — the
	// mother's flow, kept whole: a purge is never one tap.
	let purgeState = $state<'idle' | 'confirm1' | 'confirm2'>('idle');
	let pendingExport = $state(false);
	let purgeError = $state<string | null>(null);
	let showUninstallGuide = $state(false);

	type Carried = { moments: Moment[]; words: Record<string, string> };

	/** Straight from the record, never the loaded page — the envelope's own
	 *  first law, and Echoes' E1. */
	async function exportData() {
		const { moments, words } = await record.everything();
		const payload = seal<Carried>(
			APP,
			appVersion || 'unknown',
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

	async function handleImportFile(ev: Event) {
		const input = ev.target as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		importReport = null;
		importError = null;
		try {
			const reading = openEnvelope<Carried>(JSON.parse(await file.text()), APP);
			if (reading.kind !== 'envelope') throw new Error('Not a Sirens export file.');
			const ms = Array.isArray(reading.data.moments) ? reading.data.moments : [];
			const ws = reading.data.words ?? {};
			const r = await record.restore(ms, ws);
			// Non-destructive, like the mother's: what is already here stays as
			// it is, and a word she has given a circle is never overwritten by an
			// older file.
			importReport =
				[
					`${r.added} ${r.added === 1 ? 'moment' : 'moments'} back`,
					r.kept ? `${r.kept} already here` : '',
					r.wordsAdded ? `${r.wordsAdded} words added` : '',
					r.wordsKept ? `${r.wordsKept} words kept as yours` : ''
				]
					.filter(Boolean)
					.join(' · ') + '.';
		} catch (err) {
			importError = err instanceof Error ? err.message : String(err);
		}
	}

	function startPurge(withExport: boolean) {
		pendingExport = withExport;
		purgeState = 'confirm1';
	}

	function cancelPurge() {
		purgeState = 'idle';
		pendingExport = false;
		purgeError = null;
	}

	/** The export must be complete IN HAND before anything deletes — the
	 *  envelope's `purgeAfter`, not a hand-rolled sequence. Then, as the mother
	 *  does: everything in localStorage goes too (the theme, the sky switch,
	 *  the name she gave at the door, the door's own flag) — future keys must
	 *  not survive a purge by omission — and the app reloads to its first
	 *  screen. The purge truly purges. */
	async function executePurge() {
		purgeError = null;
		try {
			await purgeAfter(pendingExport ? exportData : null, () => record.purgeAll());
			localStorage.clear();
		} catch (err) {
			// Stay on the confirm step and say what failed — a silent purge
			// rejection looks like "purge never purges."
			purgeError = err instanceof Error ? err.message : String(err);
			return;
		}
		location.reload();
	}

	async function openSanctuary() {
		try {
			const { openUrl } = await import('@tauri-apps/plugin-opener');
			await openUrl(SANCTUARY_URL);
		} catch {
			/* browser/dev: no-op */
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

<div class="settings" style="padding-top: env(safe-area-inset-top, 0px);">
	<header class="settings-header">
		<h1 class="settings-title">Settings</h1>
	</header>

	<!-- ── Section 1: Theme ── (first, as in every app cut from Echoes — KP,
	     2026-08-18: "place it at the top to keep the setting layouts the same
	     across family apps.") -->
	<section class="section">
		<h2 class="section-title">Theme</h2>

		<div class="theme-grid">
			{#each SIRENS_THEMES as opt (opt.key)}
				<button
					class="theme-card"
					class:selected={activePreset === opt.key}
					style="--card-accent: {opt.accent};"
					onclick={() => themeStore.setPreset(opt.key)}
					aria-pressed={activePreset === opt.key}
				>
					<span class="theme-icon">{opt.icon}</span>
					<span class="theme-name">{opt.name}</span>
					<div class="theme-swatch" style="background: {opt.swatch};"></div>
				</button>
			{/each}
		</div>

		<div class="font-row">
			<span class="font-label">Display mode</span>
			<div class="font-btns" role="group" aria-label="Display mode">
				{#each displayModes as { key, label } (key)}
					<button
						class="font-btn"
						class:active={themeStore.config.mode === key}
						onclick={() => themeStore.setMode(key)}
					>{label}</button>
				{/each}
			</div>
		</div>

		<div class="font-row">
			<span class="font-label">Background tint</span>
			<div class="font-btns" role="group" aria-label="Background tint">
				{#each tintLevels as { key, label } (key)}
					<button
						class="font-btn"
						class:active={themeStore.config.tint === key}
						onclick={() => themeStore.setTint(key)}
					>{label}</button>
				{/each}
			</div>
		</div>

		<div class="font-row">
			<span class="font-label">Font size</span>
			<div class="font-btns" role="group" aria-label="Font size">
				{#each fontSizes as { key, label } (key)}
					<button
						class="font-btn"
						class:active={themeStore.config.fontSize === key}
						onclick={() => themeStore.setFontSize(key)}
					>{label}</button>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── Section 2: Your circles ── (Sirens' own room, in the family's shape) -->
	<section class="section">
		<h2 class="section-title">Your circles</h2>
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

	<!-- ── Section 3: The sky ── (Sirens' own switch) -->
	<section class="section">
		<h2 class="section-title">The sky</h2>
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

	<!-- ── Section 4: Data Sovereignty ── (the envelope's room, Echoes' shape) -->
	<section class="section">
		<h2 class="section-title">Data Sovereignty</h2>

		<!-- Where Echoes counts, Sirens says. No number lives in this room. -->
		<p class="data-line">
			It is yours to carry and yours to destroy. The file holds every moment
			and every word you gave a circle, and it goes nowhere but where you put
			it.
		</p>

		<div class="data-actions">
			<button class="btn-data" onclick={exportData}>Export All Data</button>
			<button class="btn-data" onclick={() => importInput?.click()}>Import Data</button>
			<input
				type="file"
				accept="application/json,.json"
				hidden
				bind:this={importInput}
				onchange={handleImportFile}
			/>
			<button class="btn-data warning" onclick={() => startPurge(true)}>Export &amp; Purge</button>
		</div>

		{#if importReport}
			<p class="import-report" role="status">{importReport}</p>
		{/if}
		{#if importError}
			<p class="purge-error" role="alert">Import failed: {importError}</p>
		{/if}

		<p class="privacy-line">
			Nothing in this app leaves this device. There is no account, no sync, no
			network call anywhere in it.
		</p>

		<div class="danger-zone">
			<p class="danger-label">Danger zone</p>

			{#if purgeState === 'idle'}
				<button class="btn-danger" onclick={() => startPurge(false)}>Purge All Data</button>

			{:else if purgeState === 'confirm1'}
				<div class="confirm-card">
					<p class="confirm-text">
						{#if pendingExport}
							This will put the file in your hands first, then erase every moment and every word. It cannot be undone.
						{:else}
							This will erase every moment and every word. It cannot be undone — take the file first if you want one.
						{/if}
					</p>
					<div class="confirm-actions">
						<button class="btn-neutral" onclick={cancelPurge}>Keep it</button>
						<button class="btn-danger" onclick={() => (purgeState = 'confirm2')}>Continue</button>
					</div>
				</div>

			{:else}
				<div class="confirm-card final">
					<p class="confirm-text">
						{#if pendingExport}
							Last word. The file will download, then everything here is gone.
						{:else}
							Last word. Everything, gone — moments, words, and your settings with them.
						{/if}
					</p>
					{#if purgeError}
						<p class="purge-error" role="alert">Purge failed: {purgeError}</p>
					{/if}
					<div class="confirm-actions">
						<button class="btn-neutral" onclick={cancelPurge}>Keep it</button>
						<button class="btn-danger-filled" onclick={executePurge}>Erase Everything</button>
					</div>
				</div>
			{/if}
		</div>

		<div class="uninstall-section">
			{#if !showUninstallGuide}
				<button class="btn-uninstall" onclick={() => (showUninstallGuide = true)}>
					Uninstall App
				</button>
			{:else}
				<div class="uninstall-guide">
					<p class="uninstall-intro">Resonance Sirens keeps everything on your device. To remove the app and all of it:</p>
					<ol class="uninstall-steps">
						<li>Export your data first if you want to keep it</li>
						<li>Go to Android Settings → Apps → Resonance Sirens → Uninstall</li>
					</ol>
					<p class="uninstall-note">That is how Android removes the app's data with it.</p>
					<button class="btn-neutral" onclick={() => (showUninstallGuide = false)}>Got it</button>
				</div>
			{/if}
		</div>
	</section>

	<!-- ── Section 5: About ── -->
	<section class="section">
		<h2 class="section-title">About</h2>

		<div class="about-card">
			<div class="about-app">
				<span class="about-name">Resonance Sirens</span>
				{#if appVersion}<span class="about-version">v{appVersion}</span>{/if}
			</div>
			<p class="about-tag">A sovereign cycle tracker. One press captures the moment; nothing ever leaves the device.</p>
			<p class="about-built">TJ's idea, first. Built with Aethelred by Quantum Weaver for the AudHDities Sanctuary.</p>
			<p class="about-license">All data belongs to the vessel. The Resonance Grammar governs.</p>
			<div class="about-links">
				<button class="privacy-link" onclick={openSanctuary}>audhdities.com — the Sanctuary</button>
			</div>
		</div>
	</section>
</div>

<style>
	/* Carried from Echoes' settings page, 2026-08-23, so the two rooms read as
	   one family — same header, same section rhythm, same cards and pills, the
	   same Data Sovereignty shape. Sirens' two own rooms (.say · .switch ·
	   .circles) wear the same measures. */
	.settings {
		min-height: 100%;
	}

	/* Header */
	.settings-header {
		padding: 1rem 1.25rem 0.75rem;
		border-bottom: 1px solid var(--border-color);
	}
	.settings-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text);
		margin: 0;
	}

	/* Sections */
	.section {
		padding: 1.25rem 1.25rem 0;
		border-bottom: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-bottom: 1.25rem;
	}
	.section-title {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin: 0;
	}

	/* ── Theme ── */
	.theme-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.65rem;
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
		transition: border-color 0.2s, background 0.2s, transform 0.15s;
	}
	.theme-card:active { transform: scale(0.97); }
	.theme-card.selected {
		border-color: var(--card-accent);
		background: color-mix(in srgb, var(--card-accent) 10%, var(--bg-surface));
	}
	.theme-icon { font-size: 1.6rem; line-height: 1; }
	.theme-name { font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); }
	.theme-swatch { width: 24px; height: 4px; border-radius: 2px; }

	/* The pill rows */
	.font-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		/* Label + three pill buttons exceed 320px — wrap instead of clipping
		   (flex text children won't shrink below their content). */
		flex-wrap: wrap;
	}
	.font-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}
	.font-btns {
		display: flex;
		gap: 0.35rem;
	}
	.font-btn {
		padding: 0.3rem 0.7rem;
		background: var(--bg-surface);
		border: 1.5px solid var(--border-color);
		border-radius: 20px;
		color: var(--text-secondary);
		font: inherit;
		font-size: 0.78rem;
		cursor: pointer;
		transition: border-color 0.15s, color 0.15s, background 0.15s;
	}
	.font-btn.active {
		border-color: var(--accent);
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 12%, transparent);
	}

	/* ── Sirens' own rooms, in the family's measures ── */
	.say {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}
	.circles {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.switch {
		display: inline-flex;
		align-self: flex-start;
		align-items: center;
		gap: 0.55rem;
		padding: 0.4rem 0.9rem 0.4rem 0.6rem;
		border-radius: 999px;
		border: 1.5px solid var(--border-color);
		background: var(--bg-surface);
		color: inherit;
		font: inherit;
		font-size: 0.875rem;
		cursor: pointer;
		min-height: max(44px, 2.75rem);
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

	/* ── Data Sovereignty ── */
	.data-line {
		font-size: 0.875rem;
		color: var(--text-muted);
		margin: 0;
		line-height: 1.5;
	}
	.data-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.privacy-line {
		font-size: 0.8rem;
		color: var(--text-muted);
		margin: 0;
		line-height: 1.5;
	}
	.privacy-link {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		font-size: inherit;
		color: var(--accent);
		text-decoration: underline;
		cursor: pointer;
		text-align: left;
	}
	.about-links {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		margin-top: 0.5rem;
		font-size: 0.85rem;
	}

	.btn-data {
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--bg-surface);
		border: 1.5px solid var(--border-color);
		border-radius: 10px;
		color: var(--text);
		font: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		transition: border-color 0.15s, background 0.15s;
	}
	.btn-data:not(:disabled):hover { border-color: var(--accent); }
	.btn-data:disabled { opacity: 0.35; cursor: not-allowed; }
	.btn-data.warning {
		border-color: rgba(243, 156, 18, 0.5);
		color: var(--color-warning);
	}
	.btn-data.warning:not(:disabled):hover {
		background: color-mix(in srgb, var(--color-warning) 10%, var(--bg-surface));
		border-color: var(--color-warning);
	}

	/* Danger zone */
	.danger-zone {
		border: 1px solid rgba(231, 76, 60, 0.3);
		border-radius: 12px;
		padding: 0.875rem 1rem;
		background: color-mix(in srgb, var(--color-emergency-high) 5%, transparent);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.danger-label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(231, 76, 60, 0.7);
		margin: 0;
	}
	.btn-danger {
		width: 100%;
		padding: 0.75rem 1rem;
		background: none;
		border: 1.5px solid var(--color-emergency-high);
		border-radius: 10px;
		color: var(--color-emergency-high);
		font: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s;
	}
	.btn-danger:not(:disabled):hover { background: rgba(231, 76, 60, 0.1); }
	.btn-danger-filled {
		padding: 0.6rem 1rem;
		background: var(--color-emergency-high);
		border: none;
		border-radius: 8px;
		color: #fff;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s, transform 0.1s;
	}
	.btn-danger-filled:active { transform: scale(0.97); }
	.btn-neutral {
		padding: 0.6rem 1rem;
		background: var(--bg-surface);
		border: 1.5px solid var(--border-color);
		border-radius: 8px;
		color: var(--text-secondary);
		font: inherit;
		font-size: 0.875rem;
		cursor: pointer;
		transition: border-color 0.15s;
	}
	.btn-neutral:hover { border-color: var(--text-muted); }

	/* Confirmation card */
	.confirm-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.confirm-card.final .confirm-text { color: var(--color-emergency-high); }
	.confirm-text {
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin: 0;
	}
	.purge-error {
		font-size: 0.8rem;
		color: var(--color-emergency-high);
		margin: 0;
		overflow-wrap: anywhere;
	}
	.import-report {
		font-size: 0.8rem;
		color: var(--color-success, var(--accent));
		margin: 0;
		overflow-wrap: anywhere;
	}
	.confirm-actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	/* ── Uninstall Guide ── */
	.uninstall-section {
		padding-top: 0.75rem;
		border-top: 1px solid var(--border-color);
	}
	.btn-uninstall {
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--bg-surface);
		border: 1.5px solid var(--border-color);
		border-radius: 10px;
		color: var(--text-muted);
		font: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		transition: border-color 0.15s, color 0.15s;
	}
	.btn-uninstall:hover { border-color: var(--text-muted); color: var(--text-secondary); }
	.uninstall-guide {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.uninstall-intro, .uninstall-note {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.55;
	}
	.uninstall-steps {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.uninstall-steps li {
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	/* ── About ── */
	.about-card {
		background: var(--bg-surface);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 1rem 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.about-app {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}
	.about-name {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text);
	}
	.about-version {
		font-size: 0.75rem;
		color: var(--text-muted);
		background: var(--bg);
		border: 1px solid var(--border-color);
		border-radius: 10px;
		padding: 0.1rem 0.45rem;
	}
	.about-tag {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.5;
	}
	.about-built, .about-license {
		font-size: 0.78rem;
		color: var(--text-muted);
		margin: 0;
		line-height: 1.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.theme-card, .font-btn, .btn-data, .btn-danger, .btn-danger-filled, .btn-neutral, .btn-uninstall {
			transition: none;
		}
	}
</style>
