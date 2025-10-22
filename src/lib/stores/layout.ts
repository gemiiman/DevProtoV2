import { writable, get } from 'svelte/store';

/**
 * Global state stores for the application layout
 * Based on the panels defined in ui-spec.json
 */

// Tab interface for Middle00 content
export interface Tab {
	id: string;
	title: string;
	kind: 'editor' | 'graph' | 'template';
}

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

// Tab management stores
/** List of all open tabs in Middle00 */
export const tabs = writable<Tab[]>([]);

/** ID of the currently active tab */
export const activeTabId = writable<string | null>(null);

// Tab management helper functions

/**
 * Opens a new editor tab for a file
 * @param fileName - The name of the file to open
 */
export function openEditorTab(fileName: string) {
	const currentTabs = get(tabs);

	// Check if a tab with this file already exists
	const existingTab = currentTabs.find(tab => tab.title === fileName && tab.kind === 'editor');

	if (existingTab) {
		// If tab exists, just activate it
		activeTabId.set(existingTab.id);
	} else {
		// Create a new tab
		const newTab: Tab = {
			id: crypto.randomUUID(),
			title: fileName,
			kind: 'editor'
		};

		tabs.update(t => [...t, newTab]);
		activeTabId.set(newTab.id);
	}
}

/**
 * Opens the Graph View tab (only one instance allowed)
 */
export function openGraphTab() {
	const currentTabs = get(tabs);

	// Check if graph tab already exists
	const existingGraphTab = currentTabs.find(tab => tab.kind === 'graph');

	if (existingGraphTab) {
		// If graph tab exists, just activate it
		activeTabId.set(existingGraphTab.id);
	} else {
		// Create a new graph tab
		const newTab: Tab = {
			id: crypto.randomUUID(),
			title: 'Graph View',
			kind: 'graph'
		};

		tabs.update(t => [...t, newTab]);
		activeTabId.set(newTab.id);
	}
}

/**
 * Closes a tab by its ID
 * @param id - The ID of the tab to close
 */
export function closeTab(id: string) {
	const currentTabs = get(tabs);
	const currentActiveId = get(activeTabId);

	// Remove the tab from the list
	const updatedTabs = currentTabs.filter(tab => tab.id !== id);
	tabs.set(updatedTabs);

	// If the closed tab was active, activate another tab
	if (currentActiveId === id) {
		if (updatedTabs.length > 0) {
			// Set to the last tab in the list
			activeTabId.set(updatedTabs[updatedTabs.length - 1].id);
		} else {
			// No tabs left
			activeTabId.set(null);
		}
	}
}

/**
 * Sets the active tab
 * @param id - The ID of the tab to activate
 */
export function setActiveTab(id: string | null) {
	activeTabId.set(id);
}
