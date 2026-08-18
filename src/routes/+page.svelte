<script lang="ts">
  // ==========================================================================
  // THE MOMENT — six cards, one press
  // ==========================================================================
  //
  // KP's shape: "click an emoji that captures the moment and allows notes
  // along with body temp taken at the time."
  // KP's correction, same sitting: "simpl cards, emoji to capture the moment."
  //
  // The press captures IMMEDIATELY — open to kept in under three seconds. The
  // temperature and the note are offered afterwards, against a moment already
  // safely recorded, so nothing is ever lost to a form she did not finish.
  //
  // No $effect reads what it writes. (tarocchi B-1: that threw
  // effect_update_depth_exceeded and killed every handler while the page still
  // rendered perfectly. A clean typecheck is not proof of life.)

  import { onMount } from 'svelte';
  import { capture, amend, all, type Moment } from '$lib/record';
  import { search, hers } from '$lib/symbols';
  import { OPENING_CARDS, CARD_COUNT } from '$lib/cards';

  let moments = $state<Moment[]>([]);
  let justCaptured = $state<Moment | null>(null);
  let temp = $state('');
  let note = $state('');
  let useF = $state(false);
  let picking = $state(false);
  let query = $state('');

  /** Her cards: what she actually uses, topped up from the opening six so the
   *  surface is always full. Derived — there is no favourites list to curate
   *  and nothing anywhere that says what kind of person she is. */
  const cards = $derived.by(() => {
    const mine = hers(moments, CARD_COUNT);
    const out = [...mine];
    for (const c of OPENING_CARDS) {
      if (out.length >= CARD_COUNT) break;
      if (!out.includes(c)) out.push(c);
    }
    return out.slice(0, CARD_COUNT);
  });

  const found = $derived(query.trim() ? search(query, 60) : []);

  /** One colour per circle. KP's word: "just colors circles for emojis, nothing
   *  more." They are positions on a wheel, not meanings — a colour here says
   *  no more about a symbol than the symbol says about her. */
  const HUES = [344, 18, 44, 152, 200, 272];

  onMount(async () => {
    moments = await all();
  });

  async function press(emoji: string) {
    const m = await capture(emoji);
    justCaptured = m;
    temp = '';
    note = '';
    picking = false;
    query = '';
    moments = await all();
  }

  /** Celsius is the one stored unit; Fahrenheit is only a way of typing it, so
   *  her history can never disagree with itself because a setting changed. */
  function toC(raw: string): number | null {
    const n = Number(raw);
    if (!raw.trim() || Number.isNaN(n)) return null;
    return useF ? Math.round(((n - 32) * 5) / 9 * 100) / 100 : n;
  }

  async function keepDetail() {
    if (!justCaptured) return;
    await amend(justCaptured.id, { tempC: toC(temp), note: note || null });
    moments = await all();
    justCaptured = null;
  }
</script>

<main>
  <header>
    <h1>sirens</h1>
    <p class="lede">Press what fits. It stays on this device.</p>
  </header>

  {#if justCaptured}
    <!-- Already saved. Everything here is optional; closing loses nothing. -->
    <section class="caught" aria-live="polite">
      <p class="line">
        <span class="big">{justCaptured.emoji}</span>
        <span>kept at {new Date(justCaptured.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
      </p>
      <div class="fields">
        <label>
          <span>temperature <em>if you took it</em></span>
          <span class="row">
            <input bind:value={temp} inputmode="decimal" placeholder={useF ? '98.6' : '37.0'} />
            <button type="button" class="unit" onclick={() => (useF = !useF)}>{useF ? '°F' : '°C'}</button>
          </span>
        </label>
        <label>
          <span>a note <em>if you want one</em></span>
          <textarea bind:value={note} rows="2" placeholder="anything at all"></textarea>
        </label>
      </div>
      <div class="actions">
        <button class="primary" onclick={keepDetail}>keep that too</button>
        <button class="quiet" onclick={() => (justCaptured = null)}>done</button>
      </div>
    </section>
  {/if}

  {#if picking}
    <input class="search" bind:value={query} placeholder="find any symbol" aria-label="find any symbol" />
    <div class="found">
      {#each found as e (e.e)}
        <button class="small" onclick={() => press(e.e)} title={e.n} aria-label={e.n}>{e.e}</button>
      {/each}
    </div>
    <button class="quiet wide" onclick={() => { picking = false; query = ''; }}>back</button>
  {:else}
    <div class="cards">
      {#each cards as c, i (c)}
        <button class="card" style="--hue:{HUES[i % HUES.length]}" onclick={() => press(c)}>{c}</button>
      {/each}
    </div>
    <button class="quiet wide" onclick={() => (picking = true)}>another symbol</button>
  {/if}
</main>

<style>
  main { width: 100%; max-width: 30rem; margin: 0 auto; padding: 1.75rem 1rem 3rem; }
  header { margin-bottom: 1.4rem; }
  h1 { margin: 0; font-size: 1.5rem; font-weight: 640; letter-spacing: -0.02em; }
  .lede { margin: 0.15rem 0 0; color: var(--ink-soft); font-size: 0.92rem; }

  /* SIX CARDS. Two columns, generously large — this is the whole surface. */
  .cards {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; justify-items: center;
  }
  .card {
    aspect-ratio: 1; width: 100%; max-width: 6.5rem;
    border: none; border-radius: 50%;
    background: hsl(var(--hue) 62% 88%);
    cursor: pointer; font-size: 2.6rem; line-height: 1;
    display: grid; place-items: center;
    transition: transform 0.1s ease, filter 0.14s ease;
  }
  .card:hover { filter: brightness(0.96); }
  .card:active { transform: scale(0.94); }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) .card { background: hsl(var(--hue) 34% 26%); }
  }
  :root[data-theme='dark'] .card { background: hsl(var(--hue) 34% 26%); }

  .search {
    width: 100%; padding: 0.75rem 0.9rem; border-radius: var(--radius);
    border: 1px solid var(--line-firm); background: var(--surface);
    color: var(--ink); font-size: 0.95rem; margin-bottom: 0.6rem;
  }
  .found { display: grid; grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr)); gap: 0.35rem; }
  .small {
    aspect-ratio: 1; min-height: 3rem; border: 1px solid transparent; border-radius: 12px;
    background: var(--surface); cursor: pointer; font-size: 1.45rem;
    display: grid; place-items: center;
  }
  .small:hover { background: var(--accent-w); }

  .caught {
    background: var(--accent-w); border: 1px solid var(--line-firm);
    border-radius: var(--radius); padding: 1rem; margin-bottom: 1.2rem;
  }
  .line { display: flex; align-items: center; gap: 0.6rem; margin: 0 0 0.8rem; color: var(--ink-soft); font-size: 0.9rem; }
  .big { font-size: 2rem; line-height: 1; }
  .fields { display: grid; gap: 0.7rem; }
  label { display: grid; gap: 0.25rem; font-size: 0.78rem; color: var(--ink-soft); }
  label em { color: var(--muted); font-style: normal; }
  .row { display: flex; gap: 0.4rem; }
  input, textarea {
    width: 100%; padding: 0.55rem 0.7rem; border-radius: 10px;
    border: 1px solid var(--line-firm); background: var(--surface);
    color: var(--ink); font: inherit; font-size: 0.92rem; resize: vertical;
  }
  .unit { flex: 0 0 auto; padding: 0 0.85rem; border-radius: 10px; border: 1px solid var(--line-firm); background: var(--surface); cursor: pointer; }
  .actions { display: flex; gap: 0.5rem; margin-top: 0.85rem; }
  .primary { padding: 0.55rem 1rem; border-radius: 10px; border: 1px solid var(--accent); background: var(--accent); color: var(--surface); cursor: pointer; font-weight: 600; }
  .quiet { padding: 0.55rem 1rem; border-radius: 10px; border: 1px solid var(--line-firm); background: transparent; color: var(--ink-soft); cursor: pointer; }
  .wide { width: 100%; margin-top: 0.9rem; }
</style>
