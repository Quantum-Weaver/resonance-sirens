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

export async function visit(page) {
	// First run redirects to /onboarding; step past it.
	await page.go(`${BASE}/`);
	await page.ev(`localStorage.setItem('onboarding_complete','1')`);
	await page.go(`${BASE}/`);
	await page.sleep(600);

	// ---- seed: put a few circles down through the quick-add dialog
	const seeded = await page.ev(`(async () => {
		const wait = (ms) => new Promise(r => setTimeout(r, ms));
		let circles = 0;
		for (const i of [0, 0, 4, 9]) {
			document.querySelector('.fab')?.click();
			await wait(220);
			const c = Array.from(document.querySelectorAll('dialog .circle'));
			circles = c.length;
			if (!c[i]) break;
			c[i].click();
			await wait(120);
			Array.from(document.querySelectorAll('dialog button'))
				.find(b => b.textContent.trim() === 'keep it')?.click();
			await wait(260);
		}
		return { circles, cards: document.querySelectorAll('.card').length };
	})()`);
	check('the ten circles are in the quick-add dialog', seeded.circles === 10, JSON.stringify(seeded));
	check('a press makes a card on the log', seeded.cards > 0, JSON.stringify(seeded));

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

	// ---- 3 · EVERY DAY IS A DOOR, AHEAD OR BEHIND
	const doors = await page.ev(`(() => {
		const cells = document.querySelectorAll('.cell');
		const buttons = document.querySelectorAll('button.cell');
		return { cells: cells.length, buttons: buttons.length };
	})()`);
	check('every day can be opened', doors.cells > 0 && doors.cells === doors.buttons,
		JSON.stringify(doors));

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
	await page.go(`${BASE}/`);
	await page.sleep(500);
	await page.ev(`(async () => {
		const wait = (ms) => new Promise(r => setTimeout(r, ms));
		// Open the newest card, then the two-step forget: 'forget' arms it,
		// 'forget it' takes it. No dialog anywhere in this app.
		document.querySelector('.card .head')?.click();
		await wait(250);
		Array.from(document.querySelectorAll('.card button'))
			.find(b => b.textContent.trim() === 'forget')?.click();
		await wait(150);
		Array.from(document.querySelectorAll('.card button'))
			.find(b => b.textContent.trim() === 'forget it')?.click();
		await wait(280);
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
