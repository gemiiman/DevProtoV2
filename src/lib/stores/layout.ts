import { writable } from 'svelte/store';

/**
 * Global state stores for the application layout
 * Based on the panels defined in ui-spec.json
 */

// Panel visibility stores
/** Controls the visibility of the Left01 collapsible panel (drawer) */
export const isLeft01Open = writable(false);

/** Controls the visibility of the Right01 collapsible panel (drawer) */
export const isRight01Open = writable(false);

/** Controls the visibility of the Terminal01 collapsible panel (drawer) */
export const isTerminalOpen = writable(false);

// Modal visibility stores
/** Controls the visibility of the Finder modal overlay */
export const showFinder = writable(false);

/** Controls the visibility of the Command Palette modal overlay */
export const showCommandPalette = writable(false);

// View routing store
/** Tracks the active view displayed in the Middle00 panel (e.g., 'graph', null for default) */
export const activeView = writable<string | null>(null);
