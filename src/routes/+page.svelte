<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { DockviewComponent } from 'dockview-core';
	import type { IContentRenderer, PanelInitParameters } from 'dockview-core'; // Import necessary types
	import type { Tab } from '$lib/stores/layout';
	import { tabs, activeTabId, setActiveTab, closeTab, showFinder, showCommandPalette } from '$lib/stores/layout';
	import { get } from 'svelte/store';
	import { X } from 'lucide-svelte';
	import 'dockview-core/dist/styles/dockview.css';

	// --- Placeholder Content ---
	const placeholderContent: { [key: string]: string } = {
		'1.1-cover-letter.pdf': `[Company Letterhead]

Date: October 22, 2025

Document Control Center
Center for Drug Evaluation and Research (CDER)
Food and Drug Administration
10903 New Hampshire Avenue
Silver Spring, MD 20993-0002

Subject: Pre-IND Meeting Request for [Drug Name] (Proposed Indication: [Indication])

Dear Sir/Madam,

On behalf of [Sponsor Name], we respectfully submit this request for a Pre-Investigational New Drug (Pre-IND) meeting regarding our development program for [Drug Name]...

We propose the following dates for the meeting: ...

Sincerely,
[Your Name/Title]
[Sponsor Name]
`,
		'1.2-form-1571.pdf': `Form FDA 1571 - Investigational New Drug Application (IND)

1. NAME OF SPONSOR: [Sponsor Name]
2. DATE OF SUBMISSION: October 22, 2025
3. ADDRESS: [Sponsor Address]
...
7. NAME(S) OF DRUG: [Drug Name] / [Code Name]
8. IND NUMBER (If previously assigned): N/A
9. PROPOSED INDICATION(S) OR USE(S): [Indication]
10. PHASE(S) OF CLINICAL INVESTIGATION TO BE CONDUCTED: Phase 1
...
15. CONTENTS OF SUBMISSION:
    [X] Initial Investigational New Drug Application (IND)
    [ ] Pre-IND Submission
    [ ] Protocol Amendment
    ...
16. IS THIS APPLICATION EXEMPT FROM THE APPLICATION USER FEE? [X] Yes [ ] No
    If yes, state reason: Pre-clinical development stage.

[Signature, Typed Name, Title, Telephone Number]
`,
		'2.1-introduction.docx': `Module 2: Common Technical Document Summaries
2.1 Introduction

This document provides an introduction to the Investigational New Drug (IND) application for [Drug Name], a novel [Drug Class/Description] being developed by [Sponsor Name] for the treatment of [Indication].

[Drug Name] exhibits [Mechanism of Action]. Preclinical studies have demonstrated [Key Preclinical Findings].

This submission includes data supporting the initiation of Phase 1 clinical trials to assess the safety, tolerability, and pharmacokinetics of [Drug Name] in healthy volunteers.
`,
		'2.2-nonclinical-overview.docx': `Module 2: Common Technical Document Summaries
2.2 Nonclinical Overview

This overview summarizes the nonclinical pharmacology, pharmacokinetic, and toxicology studies conducted with [Drug Name].

Pharmacology: Studies demonstrated [Primary Pharmacology Finding] in relevant models.
Pharmacokinetics: Absorption, distribution, metabolism, and excretion (ADME) profiles were characterized in [Species Tested]. Key findings include [Key PK Finding].
Toxicology: Single-dose and repeat-dose toxicity studies were conducted in [Species Tested]. The No Observed Adverse Effect Level (NOAEL) was determined to be [NOAEL Value]. Safety pharmacology studies indicated [Key Safety Pharm Finding].

These nonclinical data support the proposed starting dose and dose escalation scheme for the Phase 1 clinical trial.
`,
		'2.3-clinical-overview.docx': `Module 2: Common Technical Document Summaries
2.3 Clinical Overview

Purpose: To summarize the planned clinical development program for [Drug Name] for the treatment of [Indication].

Background: [Brief background on the disease/indication and unmet need].

Clinical Program: The initial Phase 1 study ([Protocol Number]) is designed as a [Study Design - e.g., randomized, double-blind, placebo-controlled] study in healthy volunteers to evaluate the safety, tolerability, and pharmacokinetics of single ascending doses of [Drug Name]. Subsequent studies will explore [Future Clinical Plans].

Risk/Benefit Assessment: Based on the nonclinical data, the potential benefits of investigating [Drug Name] for [Indication] are believed to outweigh the potential risks for initiating Phase 1 studies.
`,
		'3.1-drug-substance.pdf': `Module 3: Quality
3.1 Drug Substance - [Drug Name]

Manufacturer: [Manufacturer Name and Address]
Description: [Chemical Name], [Structure], [Physical/Chemical Properties]
Manufacturing Process: [Flow chart and brief description of synthesis]
Control of Materials: Specifications for starting materials and reagents are provided.
Control of Critical Steps: Critical process parameters are identified and controlled.
Process Validation: N/A (To be provided later)
Characterization: Structural confirmation data (NMR, MS, IR, UV) and impurity profiles are included.
Control of Drug Substance: Specifications including tests for appearance, identity, assay, impurities, etc. are provided. Reference standards are described.
Container Closure System: [Description of container]
Stability: Preliminary stability data under accelerated conditions are included.
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
							<p>Graph visualization will be rendered here</p>
							<div class="graph-mockup">
								<svg viewBox="0 0 400 300" class="graph-svg">
									<circle cx="100" cy="150" r="30" fill="#0e639c"></circle>
									<circle cx="200" cy="80" r="30" fill="#0e639c"></circle>
									<circle cx="200" cy="220" r="30" fill="#0e639c"></circle>
									<circle cx="300" cy="150" r="30" fill="#0e639c"></circle>
									<line x1="100" y1="150" x2="200" y2="80" stroke="#888" stroke-width="2"></line>
									<line x1="100" y1="150" x2="200" y2="220" stroke="#888" stroke-width="2"></line>
									<line x1="200" y1="80" x2="300" y2="150" stroke="#888" stroke-width="2"></line>
									<line x1="200" y1="220" x2="300" y2="150" stroke="#888" stroke-width="2"></line>
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
	:global(.dockview-theme-dark .graph-svg) { max-width: 200px; width: 100%; height: auto; }

	:global(.dockview-theme-dark .editor-view) { display: flex; flex-direction: column; width: 100%; height: 100%; background-color: #1e1e1e;}
	:global(.dockview-theme-dark .editor-header) { padding: 0.5rem 1rem; background-color: #252526; border-bottom: 1px solid #333; flex-shrink: 0;}
	:global(.dockview-theme-dark .editor-header h2) { color: #fff; font-size: 1rem; margin: 0; }
	:global(.dockview-theme-dark .editor-textarea) {
		flex-grow: 1; padding: 1rem; background-color: #1e1e1e; border: none; color: #ccc;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 14px; line-height: 1.6;
		resize: none; width: 100%; box-sizing: border-box; height: 100%; /* Ensure textarea fills space */
	}
	:global(.dockview-theme-dark .editor-textarea:focus) { outline: none; }
	:global(.dockview-theme-dark .editor-textarea::placeholder) { color: #555; }
</style>
