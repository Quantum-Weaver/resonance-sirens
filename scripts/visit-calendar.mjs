// VISIT THE CALENDAR — proof that the room cannot grade her.
//
// Written 2026-08-18 with the calendar room itself. It lands in the repo rather
// than a scratchpad so the next hand can re-run it.
//
// WHAT IT CHECKS, AND WHAT IT DOES NOT.
//
// It checks that the room is ALIVE: the circles are there, a press lands, the
// calendar renders every day, a day opens when tapped, a forget takes, and
// every target is big enough for a thumb. `npm run check` at 0/0 proves none
// of that — a page can typecheck perfectly with every handler dead.
//
// It does NOT check wording, colour, layout or shape. Those are Jessica's, and
// a test that fails the build over a word a lamp chose is a barrier standing
// between the designer and her own app. An earlier version of this file did
// exactly that; it was removed 2026-08-18 at KP's word.
//
// Run:
//   chrome --headless=new --remote-debugging-port=9222 --user-data-dir=%TEMP%\lg-profile --no-first-run --disable-gpu
//   npm run dev
//   node ../resonance-ziggy/modules/looking-glass/drive.mjs --url http://localhost:1424/ --script ./scripts/visit-calendar.mjs --mobile

const BASE = process.env.SIRENS_BASE ?? 'http://localhost:1424';

const results = [];
let failures = 0;

function check(what, ok, detail = '') {
	results.push({ what, ok, detail });
	if (!ok) failures++;
}

/** Words this app does not have. Read off the rendered page, not the source. */
const BANNED =
	/\b(streaks?|missed|missing|late|irregular|abnormal|overdue|due|expected|predicted?|forecast|estimated?|averages?|usual|typical|skipped|consecutive|in a row|on time|cycle length|days ago|yesterday)\b/i;

export async function visit(page) {
	// The layout sends every first run to /onboarding. Step past it — this is a
	// measurement of the calendar, not of the walk.
	await page.go(`${BASE}/`);
	await page.ev(`localStorage.setItem('onboarding_complete','1')`);
	await page.go(`${BASE}/`);
	await page.sleep(600);

	// ---- seed: press a few circles, so some days carry moments and most do not
	const pressed = await page.ev(`(async () => {
		const btns = Array.from(document.querySelectorAll('.press'));
		if (btns.length < 3) return 0;
		btns[0].click(); await new Promise(r => setTimeout(r, 120));
		btns[0].click(); await new Promise(r => setTimeout(r, 120));
		btns[4].click(); await new Promise(r => setTimeout(r, 120));
		btns[9].click(); await new Promise(r => setTimeout(r, 120));
		return btns.length;
	})()`);
	check('the ten circles are on the home surface', pressed === 10, `found ${pressed}`);

	await page.go(`${BASE}/calendar`);
	await page.sleep(700);

	// ---- 1 · NO CELL IS A HOLE
	const holes = await page.ev(
		`Array.from(document.querySelectorAll('.cell')).filter(el => !el.textContent.trim()).length`
	);
	check('every day is furnished — no cell is empty', holes === 0, `${holes} empty`);

	// ---- 2 · PRESENCE IS NEVER PAINTED  (the one that matters)
	const skins = await page.ev(`(() => {
		const set = new Set();
		for (const el of document.querySelectorAll('.cell:not(.today):not(.open)')) {
			const s = getComputedStyle(el);
			set.add([s.backgroundColor, s.borderTopColor, s.borderTopWidth, s.borderTopStyle,
			         s.opacity, s.boxShadow, s.borderRadius].join(' | '));
		}
		return [...set];
	})()`);
	check('exactly one skin for every ordinary day', skins.length === 1, JSON.stringify(skins, null, 1));

	// ---- 3 · NOTHING PAST TODAY IS A DOOR
	const lastDoor = await page.ev(`(() => {
		const b = document.querySelectorAll('button.cell');
		return b.length ? b[b.length - 1].className : null;
	})()`);
	check('the last reachable day is today', String(lastDoor).includes('today'), String(lastDoor));

	// ---- 4 · THE PANEL OPENS IN FLOW, AND NOTHING TRAPS
	await page.ev(`(() => {
		const b = document.querySelectorAll('button.cell');
		b[b.length - 1]?.click();
	})()`);
	await page.sleep(400);
	const panel = await page.ev(`(() => {
		const p = document.querySelector('.panel, .day-panel');
		if (!p) return null;
		let el = p.parentElement, layered = false;
		while (el) {
			const s = getComputedStyle(el);
			if (s.position === 'fixed') layered = true;
			el = el.parentElement;
		}
		return { pos: getComputedStyle(p).position, layered,
		         after: p.previousElementSibling?.className ?? null };
	})()`);
	check('the day opens in flow under its own week',
		!!panel && panel.pos === 'static' && !panel.layered,
		JSON.stringify(panel));

	// ---- 6 · FORGETTING LEAVES NO RESIDUE
	//      A day she clears must look exactly like a day she never touched.
	await page.go(`${BASE}/`);
	await page.sleep(500);
	await page.ev(`(async () => {
		const p = document.querySelector('.press');
		p?.click(); await new Promise(r => setTimeout(r, 250));
		const f = Array.from(document.querySelectorAll('button'))
			.find(b => b.textContent.trim() === 'forget that');
		f?.click(); await new Promise(r => setTimeout(r, 250));
	})()`);
	await page.go(`${BASE}/calendar`);
	await page.sleep(700);
	const skinsAfter = await page.ev(`(() => {
		const set = new Set();
		for (const el of document.querySelectorAll('.cell:not(.today):not(.open)')) {
			const s = getComputedStyle(el);
			set.add([s.backgroundColor, s.borderTopColor, s.borderTopWidth, s.opacity, s.boxShadow].join(' | '));
		}
		return [...set];
	})()`);
	check('still one skin after a forget', skinsAfter.length === 1, JSON.stringify(skinsAfter));

	// ---- 7 · THE FLOOR
	const small = await page.ev(`(() => {
		const bad = [];
		for (const el of document.querySelectorAll('main button, main a[href], main input')) {
			const r = el.getBoundingClientRect();
			if (r.width === 0 && r.height === 0) continue;
			if (r.width < 40 || r.height < 40) bad.push([el.className || el.tagName, Math.round(r.width), Math.round(r.height)]);
		}
		return bad;
	})()`);
	check('every target clears the 40px floor', small.length === 0, JSON.stringify(small));

	const cells = await page.ev(`(() => {
		const bad = [];
		for (const el of document.querySelectorAll('.cell')) {
			const r = el.getBoundingClientRect();
			if (r.height < 44) bad.push(Math.round(r.height));
		}
		return bad;
	})()`);
	check('every day cell clears 44px', cells.length === 0, JSON.stringify(cells.slice(0, 5)));

	// ---- report
	console.log('\n  THE CALENDAR, MEASURED\n');
	for (const r of results) {
		console.log(`  ${r.ok ? 'ok  ' : 'FAIL'}  ${r.what}${r.ok || !r.detail ? '' : `\n          ${r.detail}`}`);
	}
	console.log(`\n  ${results.length - failures}/${results.length} passed\n`);
	if (failures) process.exitCode = 1;
}
