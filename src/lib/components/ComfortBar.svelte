<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { uiStore } from '$lib/stores/ui.svelte';

	let expanded = $state(false);
	let previousPath = $state(page.url.pathname);
	let vesselName = $state('there');

	// Collapse on route change only — not on initial mount (previousPath === currentPath).
	$effect(() => {
		const currentPath = page.url.pathname;
		if (currentPath !== previousPath && expanded) {
			expanded = false;
		}
		previousPath = currentPath;
	});

	// Broadcast the panel state so the Sidebar can close itself when it opens.
	$effect(() => {
		uiStore.setComfortBarExpanded(expanded);
	});

	function getGreeting(): string {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good morning';
		if (hour < 17) return 'Good afternoon';
		return 'Good evening';
	}

	const greeting = $derived(`${getGreeting()}, ${vesselName}`);

	// THE COUNT DOES NOT COME ACROSS: record.ts has no count function, and this line never changes.
	const statsLine = 'Nothing here is counted, and nothing leaves this device.';

	onMount(() => {
		vesselName = localStorage.getItem('resonance-sirens-vessel-name') ?? 'there';
	});

	// Home IS the capture surface here — there is no separate add room to shortcut to.
	function onQuickAdd() {
		goto('/');
	}

	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<div class="comfort-bar" class:expanded>
	{#if expanded}
		<div class="comfort-bar__expanded">
			<button class="comfort-bar__collapse" onclick={toggleExpanded} aria-label="Collapse">⌄</button>
			<div class="comfort-bar__greeting">{greeting}</div>
			<div class="comfort-bar__stats">{statsLine}</div>
			<div class="comfort-bar__actions">
				<button class="cb-action primary" onclick={onQuickAdd}>The circles</button>
				<button class="cb-action" onclick={() => goto('/calendar')}>Calendar</button>
				<button class="cb-action" onclick={() => goto('/settings')}>Settings</button>
			</div>
		</div>
	{:else}
		<div class="comfort-bar__minimized">
			<!-- The navigation toggle lives in the bar rather than floating above it, so it can cover nothing. -->
			<button
				class="comfort-bar__nav"
				onclick={() => uiStore.toggleNav()}
				aria-label={uiStore.navOpen ? 'Close navigation' : 'Open navigation'}
				aria-expanded={uiStore.navOpen}
			>{uiStore.navOpen ? '✕' : '☰'}</button>

			<button class="comfort-bar__greeting-btn" onclick={toggleExpanded}>
				{greeting}
			</button>
			<button class="comfort-bar__quick-add" onclick={onQuickAdd} aria-label="The circles">
				○
			</button>
		</div>
	{/if}
</div>

<style>
	.comfort-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 110;
		background-color: var(--bg-surface);
		border-top: 1px solid var(--border-color);
		padding-bottom: env(safe-area-inset-bottom, 0px);
		transition: background-color 0.2s ease;
		/* Own compositor layer — without it the fixed bar can leave a stale painted copy ("ghost bar") in the Android WebView. */
		transform: translateZ(0);
	}

	/* Minimized */
	.comfort-bar__minimized {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 48px;
		padding: 0 1rem;
	}

	.comfort-bar__nav {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		margin-right: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		color: var(--text);
		font-size: 1.05rem;
		line-height: 1;
		cursor: pointer;
		transition: background-color 0.15s ease, border-color 0.15s ease;
	}

	.comfort-bar__nav:hover {
		border-color: var(--accent);
	}

	.comfort-bar__greeting-btn {
		/* Takes the slack so a long greeting truncates instead of shoving the buttons. */
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		background: none;
		border: none;
		color: var(--text-secondary);
		font-size: 0.9rem;
		cursor: pointer;
		padding: 0;
		text-align: left;
	}

	.comfort-bar__greeting-btn:hover {
		color: var(--text);
	}

	.comfort-bar__quick-add {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: var(--accent);
		color: #fff;
		border: none;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	/* Expanded */
	.comfort-bar__expanded {
		padding: 0.75rem 1rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		position: relative;
	}

	.comfort-bar__collapse {
		position: absolute;
		top: 0.25rem;
		right: 0.75rem;
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-size: 1.2rem;
		padding: 0.25rem 0.5rem;
		line-height: 1;
	}

	.comfort-bar__greeting {
		font-size: 1rem;
		color: var(--text);
		font-weight: 500;
		padding-right: 2rem;
	}

	.comfort-bar__stats {
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.comfort-bar__actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.cb-action {
		padding: 0.45rem 0.85rem;
		border-radius: 8px;
		background-color: var(--bg);
		border: 1px solid var(--border-color);
		color: var(--text-secondary);
		font-size: 0.85rem;
		cursor: pointer;
		transition: background-color 0.15s ease, color 0.15s ease;
	}

	.cb-action:hover {
		background-color: var(--border-color);
		color: var(--text);
	}

	.cb-action.primary {
		background-color: var(--accent);
		border-color: var(--accent);
		color: #fff;
	}

	.cb-action.primary:hover {
		opacity: 0.9;
	}

	@media (prefers-reduced-motion: reduce) {
		.comfort-bar {
			transition: none;
		}
	}
</style>
