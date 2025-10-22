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

// Panel structure for split layout
export type PanelOrientation = 'horizontal' | 'vertical';

export interface LeafPanel {
	type: 'leaf';
	id: string;
	tabIds: string[];
	activeTabId: string | null;
}

export interface SplitPanel {
	type: 'split';
	id: string;
	orientation: PanelOrientation;
	first: Panel;
	second: Panel;
	ratio: number; // 0-1, size of first panel relative to total
}

export type Panel = LeafPanel | SplitPanel;

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

/** ID of the currently active tab (deprecated - use panel structure) */
export const activeTabId = writable<string | null>(null);

// Panel layout store
/** Root panel structure for split layout */
export const rootPanel = writable<Panel>({
	type: 'leaf',
	id: crypto.randomUUID(),
	tabIds: [],
	activeTabId: null
});

// Tab management helper functions

// Helper to find first leaf panel
function findFirstLeafPanel(panel: Panel): LeafPanel {
	if (panel.type === 'leaf') {
		return panel;
	}
	return findFirstLeafPanel(panel.first);
}

/**
 * Opens a new editor tab for a file
 * @param fileName - The name of the file to open
 */
export function openEditorTab(fileName: string) {
	const currentTabs = get(tabs);
	
	// Check if a tab with this file already exists
	const existingTab = currentTabs.find(tab => tab.title === fileName && tab.kind === 'editor');
	
	if (existingTab) {
		// If tab exists, just activate it (find the panel and activate)
		activeTabId.set(existingTab.id);
		rootPanel.update(root => {
			activateTabInPanel(root, existingTab.id);
			return root;
		});
	} else {
		// Create a new tab
		const newTab: Tab = {
			id: crypto.randomUUID(),
			title: fileName,
			kind: 'editor'
		};
		
		tabs.update(t => [...t, newTab]);
		activeTabId.set(newTab.id);
		
		// Add to first leaf panel
		rootPanel.update(root => {
			const firstLeaf = findFirstLeafPanel(root);
			firstLeaf.tabIds.push(newTab.id);
			firstLeaf.activeTabId = newTab.id;
			return root;
		});
	}
}

// Helper to activate a tab in its panel
function activateTabInPanel(panel: Panel, tabId: string): boolean {
	if (panel.type === 'leaf') {
		if (panel.tabIds.includes(tabId)) {
			panel.activeTabId = tabId;
			return true;
		}
		return false;
	}
	return activateTabInPanel(panel.first, tabId) || activateTabInPanel(panel.second, tabId);
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
		rootPanel.update(root => {
			activateTabInPanel(root, existingGraphTab.id);
			return root;
		});
	} else {
		// Create a new graph tab
		const newTab: Tab = {
			id: crypto.randomUUID(),
			title: 'Graph View',
			kind: 'graph'
		};
		
		tabs.update(t => [...t, newTab]);
		activeTabId.set(newTab.id);
		
		// Add to first leaf panel
		rootPanel.update(root => {
			const firstLeaf = findFirstLeafPanel(root);
			firstLeaf.tabIds.push(newTab.id);
			firstLeaf.activeTabId = newTab.id;
			return root;
		});
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
	
	// Remove from panel structure
	rootPanel.update(root => {
		removeTabFromPanel(root, id);
		return root;
	});
	
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

// Helper to remove tab from panel
function removeTabFromPanel(panel: Panel, tabId: string): void {
	if (panel.type === 'leaf') {
		panel.tabIds = panel.tabIds.filter(id => id !== tabId);
		if (panel.activeTabId === tabId) {
			panel.activeTabId = panel.tabIds.length > 0 ? panel.tabIds[panel.tabIds.length - 1] : null;
		}
	} else {
		removeTabFromPanel(panel.first, tabId);
		removeTabFromPanel(panel.second, tabId);
	}
}

/**
 * Sets the active tab
 * @param id - The ID of the tab to activate
 */
export function setActiveTab(id: string) {
	activeTabId.set(id);
	rootPanel.update(root => {
		activateTabInPanel(root, id);
		return root;
	});
}

/**
 * Splits a panel and moves a tab to the new panel
 * @param panelId - The ID of the panel to split
 * @param tabId - The ID of the tab to move to the new panel
 * @param direction - The direction to split ('top', 'bottom', 'left', 'right')
 */
export function splitPanel(panelId: string, tabId: string, direction: 'top' | 'bottom' | 'left' | 'right') {
	rootPanel.update(root => {
		const panel = findPanelById(root, panelId);
		if (!panel || panel.type !== 'leaf') return root;
		
		// Note: svelte-dnd-action automatically removes the tab from the source list
		// when dropped on a different dndzone, so no manual removal needed here
		
		// Create new leaf panel with the moved tab
		const newPanel: LeafPanel = {
			type: 'leaf',
			id: crypto.randomUUID(),
			tabIds: [tabId],
			activeTabId: tabId
		};
		
		// Determine orientation and order
		const isVertical = direction === 'left' || direction === 'right';
		const orientation: PanelOrientation = isVertical ? 'horizontal' : 'vertical';
		const newPanelFirst = direction === 'top' || direction === 'left';
		
		// Replace the leaf panel with a split panel
		const splitPanelNode: SplitPanel = {
			type: 'split',
			id: crypto.randomUUID(),
			orientation,
			first: newPanelFirst ? newPanel : panel,
			second: newPanelFirst ? panel : newPanel,
			ratio: 0.5
		};
		
		// Replace the panel in the tree
		replacePanelById(root, panelId, splitPanelNode);
		
		return root;
	});
}

// Helper to find panel by ID
function findPanelById(panel: Panel, id: string): Panel | null {
	if (panel.id === id) return panel;
	if (panel.type === 'split') {
		return findPanelById(panel.first, id) || findPanelById(panel.second, id);
	}
	return null;
}

// Helper to replace a panel by ID
function replacePanelById(panel: Panel, id: string, newPanel: Panel): boolean {
	if (panel.type === 'split') {
		if (panel.first.id === id) {
			panel.first = newPanel;
			return true;
		}
		if (panel.second.id === id) {
			panel.second = newPanel;
			return true;
		}
		return replacePanelById(panel.first, id, newPanel) || replacePanelById(panel.second, id, newPanel);
	}
	return false;
}
