<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { DockviewComponent } from 'dockview-core';
	import type { IContentRenderer, PanelInitParameters } from 'dockview-core'; // Import necessary types
	import type { Tab } from '$lib/stores/layout';
	import { tabs, activeTabId, setActiveTab, closeTab, showFinder, showCommandPalette } from '$lib/stores/layout';
	import { get } from 'svelte/store';
	import { X } from 'lucide-svelte';
	import 'dockview-core/dist/styles/dockview.css';

	// --- Placeholder Content with Issues ---
	const placeholderContent: { [key: string]: string } = {
		// Inconsistency: Uses informal date, missing standard elements
		'1.1-cover-letter.pdf': `[Company Letterhead]

Date: Today, Oct 22

FDA CDER Document Control
10903 New Hampshire Avenue
Silver Spring, MD 20993

Subject: Meeting Request for DRUG-X

Dear FDA,

We want a Pre-IND meeting for DRUG-X for treating Bad Disease... We think it works great based on early stuff.

Proposed dates: Nov 10, Nov 12, Nov 15.

Thanks,
[Your Name]
[Sponsor Name]
`,
		// Inconsistency: Missing key information like Sponsor Address, Phase
		'1.2-form-1571.pdf': `Form FDA 1571 - Investigational New Drug Application (IND)

1. NAME OF SPONSOR: [Sponsor Name]
2. DATE OF SUBMISSION: October 22, 2025
3. ADDRESS: [MISSING]
...
7. NAME(S) OF DRUG: [Drug Name] / [Code Name]
8. IND NUMBER (If previously assigned): N/A
9. PROPOSED INDICATION(S) OR USE(S): [Indication]
10. PHASE(S) OF CLINICAL INVESTIGATION TO BE CONDUCTED: [MISSING]
...
15. CONTENTS OF SUBMISSION: [X] Initial IND
...
[Signature, Typed Name, Title]
`,
		// Inconsistency: Vague language ("exhibits potential", "promising results")
		'2.1-introduction.docx': `Module 2: Common Technical Document Summaries
2.1 Introduction

This IND application is for [Drug Name], a potential [Drug Class] being developed by [Sponsor Name] for [Indication].

[Drug Name] exhibits potential via [Mechanism of Action]. Preclinical studies showed promising results.

This submission supports Phase 1 trials in healthy volunteers.
`,
		// Inconsistency: Uses "drug compound" instead of "drug substance", vague "significant"
		'2.2-nonclinical-overview.docx': `Module 2: Common Technical Document Summaries
2.2 Nonclinical Overview

Summary of nonclinical studies for the DRUG COMPOUND [Drug Name].

Pharmacology: Showed activity.
PK: ADME profiles okay in rats.
Tox: Repeat-dose tox done in rats and dogs. Results were significant. NOAEL established. Safety pharm studies okay.

Data supports Phase 1.
`,
		// Inconsistency: Missing specific details (Protocol #, study design elements)
		'2.3-clinical-overview.docx': `Module 2: Common Technical Document Summaries
2.3 Clinical Overview

Purpose: Clinical plan for [Drug Name] for [Indication].

Background: [Disease background].

Clinical Program: The first study ([Protocol # MISSING]) is a study in healthy volunteers to evaluate safety/PK. Later studies will explore efficacy.

Risk/Benefit: Benefits outweigh risks for Phase 1.
`,
		// Inconsistency: Contains placeholder "[To be provided later]"
		'3.1-drug-substance.pdf': `Module 3: Quality
3.1 Drug Substance - [Drug Name]

Manufacturer: [Manufacturer Name]
Description: [Chemical Info]
Manufacturing Process: [Description]
Control of Materials: Specs provided.
Control of Critical Steps: Controlled.
Process Validation: [To be provided later]
Characterization: Data included.
Control of Drug Substance: Specs provided.
Container Closure System: [Description]
Stability: Preliminary data included.
`
	};
	// --- End Placeholder Content ---

	let dockviewContainer: HTMLDivElement;
	let dockview: DockviewComponent | undefined;

	// --- Panel Renderer Component Class ---
	// Implement IContentRenderer for type safety
	class MyPanelComponent implements IContentRenderer {
		private _element: HTMLElement;
		private props: any; // Use any for now to avoid type issues

		get element(): HTMLElement { // Implement the getter
			return this._element;
		}

		// Constructor remains similar
		constructor() {
			this._element = document.createElement('div');
			this._element.style.padding = '10px'; // Add some padding for visibility
			this._element.style.height = '100%';
			this._element.style.overflow = 'auto'; // Ensure content is scrollable
			this._element.style.boxSizing = 'border-box';
		}

		// Init is called by Dockview with parameters
		init(props: any): void {
			this.props = props;
			this.render();
		}

		render() {
			// Ensure props and params exist before accessing tab
			if (!this.props?.params?.tab) {
				this._element.textContent = 'Error: Tab data missing!';
				return;
			}
			const tab = this.props.params.tab;

			// Use full HTML structures from the reverted +page.svelte for consistency
			if (tab.kind === 'graph') {
				this._element.innerHTML = `
					<div class="graph-view">
						<h1>Graph View</h1>
						<div class="graph-placeholder">
							<p>Drug Submission Timeline (Flame Graph Mockup)</p>
							<div class="graph-mockup">
								<svg viewBox="0 0 800 300" class="graph-svg" style="background-color: #2a2a2a; border-radius: 4px; font-family: sans-serif; font-size: 10px;">
									<defs>
										<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" style="stop-color:#1e1e1e;stop-opacity:1" />
											<stop offset="100%" style="stop-color:#333;stop-opacity:1" />
										</linearGradient>
									</defs>

									<text x="75" y="285" fill="#888" text-anchor="middle">Discovery</text>
									<text x="225" y="285" fill="#888" text-anchor="middle">Pre-Clinical</text>
									<text x="375" y="285" fill="#aaa" text-anchor="middle" font-weight="bold">IND Submission</text>
									<text x="525" y="285" fill="#888" text-anchor="middle">Phase 1</text>
									<text x="675" y="285" fill="#888" text-anchor="middle">Phase 2</text>
									<rect x="10" y="20" width="130" height="250" fill="url(#grad1)" stroke="#444" />
									<rect x="160" y="20" width="130" height="250" fill="url(#grad1)" stroke="#444" />
									<rect x="310" y="20" width="130" height="250" fill="url(#grad1)" stroke="#555" /> <rect x="460" y="20" width="130" height="250" fill="url(#grad1)" stroke="#444" />
									<rect x="610" y="20" width="130" height="250" fill="url(#grad1)" stroke="#444" />

									<rect x="170" y="230" width="110" height="18" fill="#0b4a74" rx="2"/>
									<text x="175" y="242" fill="#eee">Tox Study Report</text>
									<rect x="170" y="205" width="110" height="18" fill="#0b4a74" rx="2"/>
									<text x="175" y="217" fill="#eee">PK/PD Data</text>
									<rect x="170" y="180" width="110" height="18" fill="#0b4a74" rx="2"/>
									<text x="175" y="192" fill="#eee">Safety Pharm</text>

									<rect x="320" y="230" width="110" height="18" fill="#0e639c" rx="2"/>
									<text x="325" y="242" fill="#fff">Form 1571</text>
									<rect x="320" y="205" width="110" height="18" fill="#0e639c" rx="2"/>
									<text x="325" y="217" fill="#fff">Cover Letter</text>
									<rect x="320" y="180" width="110" height="18" fill="#0e639c" rx="2"/>
									<text x="325" y="192" fill="#fff">Intro Statement</text>
									<rect x="320" y="155" width="110" height="18" fill="#0e639c" rx="2"/>
									<text x="325" y="167" fill="#fff">Nonclinical Summary</text>
									<rect x="320" y="130" width="110" height="18" fill="#0e639c" rx="2"/>
									<text x="325" y="142" fill="#fff">CMC Information</text>
									<rect x="320" y="105" width="110" height="18" fill="#0e639c" rx="2"/>
									<text x="325" y="117" fill="#fff">Protocol Phase 1</text>
									<rect x="320" y="80" width="110" height="18" fill="#0e639c" rx="2"/>
									<text x="325" y="92" fill="#fff">IB</text>

									<rect x="470" y="230" width="110" height="18" fill="#0b4a74" rx="2"/>
									<text x="475" y="242" fill="#eee">Clinical Study Report</text>
									<rect x="470" y="205" width="110" height="18" fill="#0b4a74" rx="2"/>
									<text x="475" y="217" fill="#eee">AE Reporting</text>

									<line x1="400" y1="10" x2="400" y2="275" stroke="#f87171" stroke-width="2" stroke-dasharray="4"/>
									<text x="405" y="25" fill="#f87171" font-size="9px">Current Focus</text>
								</svg>
							</div>
						</div>
					</div>`;
			} else if (tab.kind === 'editor') {
				// Retrieve content from the placeholder object, provide fallback
				const content = placeholderContent[tab.title] || `Placeholder content for ${tab.title} not found.`;
				// Escape HTML characters for safe rendering in textarea value
				const escapedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

				this._element.innerHTML = `
					<div class="editor-view">
						<div class="editor-header">
							<h2>${tab.title}</h2>
						</div>
						<textarea class="editor-textarea">${escapedContent}</textarea>
					</div>`;
			} else {
				this._element.textContent = `Unsupported tab kind: ${tab.kind}`;
			}
		}

		// Required methods
		dispose() {}
		// Update might be needed if tab content could change dynamically later
		update(event: { params: Partial<{ tab: Tab }> }) {
			 if (event.params.tab) {
				 // Simple re-render on param change for now
				 this.props.params.tab = event.params.tab;
				 this.render();
			 }
		}
		focus() {}
		// layout?(width: number, height: number): void { } // Optional layout method
	}
	// --- End Panel Renderer Component ---

	onMount(() => {
		dockview = new DockviewComponent(dockviewContainer, {
			// Pass createComponent function instead of components map
			createComponent: (options: any) => {
				// We only have one type of component for now
				return new MyPanelComponent();
			}
		});

		const disposableListeners = [
			dockview.onDidRemovePanel((panel: any) => {
				// Check using get(tabs) to prevent race conditions if store updates first
				if (get(tabs).some((t: any) => t.id === panel.id)) {
					closeTab(panel.id);
				}
			}),
			dockview.onDidActivePanelChange((panel: any) => {
				// Update store only if the active panel actually changed
				if (panel && get(activeTabId) !== panel.id) {
					setActiveTab(panel.id);
				} else if (!panel && get(activeTabId) !== null) {
					activeTabId.set(null);
				}
			})
		];

		return () => {
			disposableListeners.forEach((listener: any) => listener.dispose());
			dockview?.dispose();
		};
	});

	// --- Refined Sync Logic ---
	let previousTabs = [...$tabs]; // Keep track of previous state

	$: if (dockview) {
		const currentTabs = $tabs;
		const currentPanels = dockview.panels;
		const currentPanelIds = new Set(currentPanels.map((p: any) => p.id));
		const currentTabIds = new Set(currentTabs.map((t: any) => t.id));

		let panelsChanged = false;

		// Add panels for new tabs
		for (const tab of currentTabs) {
			if (!currentPanelIds.has(tab.id)) {
				console.log(`Adding panel for tab: ${tab.title} (${tab.id})`);
				dockview.addPanel({
					id: tab.id,
					// Use 'component' property for createComponent factory
					component: 'default', // Name doesn't matter much here
					params: { tab }, // Pass tab data
					title: tab.title
				});
				panelsChanged = true;
			}
		}

		// Remove panels for closed tabs
		for (const panel of currentPanels) {
			if (!currentTabIds.has((panel as any).id)) {
				console.log(`Removing panel: ${(panel as any).title} (${(panel as any).id})`);
				// Ensure panel still exists in Dockview's current state before removing
				const panelExists = dockview.panels.find((p: any) => p.id === (panel as any).id);
				if (panelExists) {
					dockview.removePanel(panelExists);
					panelsChanged = true;
				}
			}
		}

		// Activate panel if activeTabId changed
		const activePanel = dockview.activePanel;
		if ($activeTabId && (!activePanel || (activePanel as any).id !== $activeTabId)) {
			const panelToActivate = dockview.panels.find((p: any) => p.id === $activeTabId);
			if (panelToActivate) {
				console.log(`Activating panel: ${(panelToActivate as any).title} (${(panelToActivate as any).id})`);
				(panelToActivate as any).api.setActive();
			}
		} else if (!$activeTabId && activePanel) {
			// Handle case where store has no active tab but Dockview does (optional)
			// console.log("Deactivating Dockview panel?");
		}

		// Update previousTabs state for next comparison
		if (panelsChanged || currentTabs !== previousTabs) {
			previousTabs = [...currentTabs];
		}
	}
	// --- End Refined Sync Logic ---

	// Modal handling logic (unchanged)
	function handleKeydown(event: KeyboardEvent) { if (event.key === 'Escape') { showFinder.set(false); showCommandPalette.set(false); } }
	function closeFinderModal(event: MouseEvent) { if (event.target === event.currentTarget) { showFinder.set(false); } }
	function closeCommandPaletteModal(event: MouseEvent) { if (event.target === event.currentTarget) { showCommandPalette.set(false); } }

</script>

<svelte:window on:keydown={handleKeydown} />

<div class="middle00-container">
	<div bind:this={dockviewContainer} class="dockview-container dockview-theme-dark"></div>

	{#if $showFinder}
		<div class="modal-overlay" on:click={closeFinderModal} role="presentation">
			<div class="modal-content finder-modal" role="dialog" aria-label="Finder">
				<div class="modal-header">
					<h2>Finder</h2>
					<button class="close-button" on:click={() => showFinder.set(false)} aria-label="Close Finder"><X size={20} /></button>
				</div>
				<div class="modal-body">
					<input type="text" placeholder="Search documents, files, or navigate..." class="search-input" autofocus />
					<div class="search-results">
						<div class="result-item">📄 1.1-cover-letter.pdf</div>
						<div class="result-item">📄 1.2-form-1571.pdf</div>
						<div class="result-item">📄 2.1-introduction.docx</div>
						<div class="result-item">📄 2.2-nonclinical-overview.docx</div>
						<div class="result-item">📄 3.1-drug-substance.pdf</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if $showCommandPalette}
		<div class="modal-overlay" on:click={closeCommandPaletteModal} role="presentation">
			<div class="modal-content command-palette-modal" role="dialog" aria-label="Command Palette">
				<div class="modal-header">
					<h2>Command Palette</h2>
					<button class="close-button" on:click={() => showCommandPalette.set(false)} aria-label="Close Command Palette"><X size={20} /></button>
				</div>
				<div class="modal-body">
					<input type="text" placeholder="Type a command..." class="search-input" autofocus />
					<div class="command-list">
						<div class="command-item">▶ Toggle Left Panel</div>
						<div class="command-item">▶ Toggle Right Panel</div>
						<div class="command-item">▶ Toggle Terminal</div>
						<div class="command-item">▶ Switch to Graph View</div>
						<div class="command-item">▶ Open Finder</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.middle00-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background-color: #1e1e1e; /* Fallback */
		overflow: hidden;
		position: relative; /* Needed for absolute positioning of modals */
	}

	.dockview-container {
		flex-grow: 1; /* Make it fill available space */
		width: 100%;
		height: 100%;
		position: relative; /* Dockview might need this */
	}

	:global(.dockview-theme-dark) {
		--dv-active-indicator-color: #0e639c; /* Example: Match active tab border */
	}

	/* Keep modal styles as they were */
	.modal-overlay {
		position: fixed; /* Use fixed to overlay everything */
		top: 0; left: 0; width: 100vw; height: 100vh;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex; align-items: center; justify-content: center;
		z-index: 1000; backdrop-filter: blur(2px);
	}
	.modal-content {
		background-color: #252526; border: 1px solid #333; border-radius: 8px;
		width: 75%; max-width: 800px; max-height: 75vh;
		display: flex; flex-direction: column;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}
	.modal-header {
		display: flex; justify-content: space-between; align-items: center;
		padding: 1rem 1.5rem; border-bottom: 1px solid #333;
	}
	.modal-header h2 { color: #fff; font-size: 1.2rem; margin: 0; }
	.close-button {
		background: transparent; border: none; color: #888; cursor: pointer;
		padding: 0.25rem; display: flex; align-items: center; justify-content: center;
		border-radius: 4px; transition: all 0.2s ease;
	}
	.close-button:hover { background-color: #2a2a2a; color: #fff; }
	.modal-body { padding: 1.5rem; overflow: auto; flex: 1; }
	.search-input {
		width: 100%; padding: 0.75rem 1rem; background-color: #1e1e1e;
		border: 1px solid #333; border-radius: 4px; color: #fff;
		font-size: 1rem; margin-bottom: 1rem;
	}
	.search-input:focus { outline: none; border-color: #0e639c; }
	.search-results, .command-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.result-item, .command-item {
		padding: 0.75rem 1rem; background-color: #1e1e1e; border: 1px solid #333;
		border-radius: 4px; color: #ccc; cursor: pointer; transition: all 0.2s ease;
	}
	.result-item:hover, .command-item:hover {
		background-color: #2a2a2a; border-color: #0e639c; color: #fff;
	}

	/* Global Styles for Panel Content (needed because component injects raw HTML) */
	:global(.dockview-theme-dark .graph-view) { padding: 1rem; width: 100%; height: 100%; box-sizing: border-box; color: #ccc; background-color: #1e1e1e; overflow: auto; }
	:global(.dockview-theme-dark .graph-view h1) { color: #fff; margin-bottom: 1rem; font-size: 1.2rem;}
	:global(.dockview-theme-dark .graph-placeholder) { background-color: #252526; border: 1px solid #333; border-radius: 4px; padding: 1rem; text-align: center; }
	:global(.dockview-theme-dark .graph-placeholder p) { color: #888; margin-bottom: 1rem; font-size: 0.9rem;}
	:global(.dockview-theme-dark .graph-mockup) { display: flex; justify-content: center; align-items: center; min-height: 150px; }
	:global(.dockview-theme-dark .graph-svg) { width: 95%; height: auto; display: block; margin: 0 auto; }

	:global(.dockview-theme-dark .editor-view) { display: flex; flex-direction: column; width: 100%; height: 100%; background-color: #1e1e1e;}
	:global(.dockview-theme-dark .editor-header) { padding: 0.5rem 1rem; background-color: #252526; border-bottom: 1px solid #333; flex-shrink: 0;}
	:global(.dockview-theme-dark .editor-header h2) { color: #fff; font-size: 1rem; margin: 0; }
	:global(.dockview-theme-dark .editor-textarea) {
		flex-grow: 1; padding: 1rem; background-color: #1e1e1e; border: none; color: #ccc;
		font-family: 'PT Serif', serif; font-size: 14px; line-height: 1.6;
		resize: none; width: 100%; box-sizing: border-box; height: 100%; /* Ensure textarea fills space */
	}
	:global(.dockview-theme-dark .editor-textarea:focus) { outline: none; }
	:global(.dockview-theme-dark .editor-textarea::placeholder) { color: #555; }
</style>
