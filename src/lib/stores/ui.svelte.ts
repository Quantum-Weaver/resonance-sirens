// Cross-component UI signals that don't belong to any domain store.

// True while the ComfortBar's expanded panel is open.
let comfortBarExpanded = $state(false);

// Whether the navigation drawer is open.
let navOpen = $state(false);

export const uiStore = {
	get comfortBarExpanded() { return comfortBarExpanded; },
	setComfortBarExpanded(value: boolean) { comfortBarExpanded = value; },
	get navOpen() { return navOpen; },
	setNavOpen(value: boolean) { navOpen = value; },
	toggleNav() { navOpen = !navOpen; },
};
