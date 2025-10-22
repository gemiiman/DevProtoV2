<script lang="ts">
	import { 
		tabs, 
		rootPanel,
		splitPanel,
		showFinder, 
		showCommandPalette 
	} from '$lib/stores/layout';
	import PanelRenderer from '$lib/components/PanelRenderer.svelte';
	import { X } from 'lucide-svelte';
	
	// Drag state
	let draggedTabId: string | null = null;
	let dropZonePanel: string | null = null;
	let dropZoneDirection: 'top' | 'bottom' | 'left' | 'right' | null = null;
	
	// Handle Esc key to close modals
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showFinder.set(false);
			showCommandPalette.set(false);
		}
	}
	
	// Close modal when clicking on backdrop
	function closeFinderModal(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			showFinder.set(false);
		}
	}
	
	function closeCommandPaletteModal(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			showCommandPalette.set(false);
		}
	}
	
	// Tab drag handlers
	function handleTabDragStart(event: CustomEvent<string>) {
		draggedTabId = event.detail;
	}
	
	function handleTabDragEnd() {
		draggedTabId = null;
		dropZonePanel = null;
		dropZoneDirection = null;
	}
	
	// Drop zone handlers
	function handleDropZoneEnter(event: CustomEvent<{panelId: string, direction: 'top' | 'bottom' | 'left' | 'right'}>) {
		if (draggedTabId) {
			dropZonePanel = event.detail.panelId;
			dropZoneDirection = event.detail.direction;
		}
	}
	
	function handleDropZoneLeave() {
		dropZonePanel = null;
		dropZoneDirection = null;
	}
	
	function handleDrop(event: CustomEvent<{panelId: string, direction: 'top' | 'bottom' | 'left' | 'right', tabId?: string}>) {
		// Use tabId from event detail (preferred) or fall back to state
		const tabIdToSplit = event.detail.tabId || draggedTabId;
		console.log('handleDrop in +page.svelte:', {
			eventDetail: event.detail,
			tabIdToSplit,
			draggedTabId
		});
		
		if (tabIdToSplit) {
			splitPanel(event.detail.panelId, tabIdToSplit, event.detail.direction);
			handleTabDragEnd();
		} else {
			console.error('No tabId available for split!');
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Middle00: Dynamic Split Panel System -->
<div class="middle00-container">
	{#if $tabs.length === 0}
		<!-- Welcome View when no tabs -->
		<div class="welcome-view">
			<h1>Welcome to FDA Submission Manager</h1>
			<p>Your intelligent assistant for eCTD document management and compliance.</p>
			<div class="welcome-cards">
				<div class="card">
					<h3>📁 Document Management</h3>
					<p>Organize your FDA submission documents with the structured eCTD format.</p>
				</div>
				<div class="card">
					<h3>🤖 AI Copilot</h3>
					<p>Get intelligent suggestions and assistance for your regulatory submissions.</p>
				</div>
				<div class="card">
					<h3>🔍 Quick Navigation</h3>
					<p>Use Finder (Left sidebar) or Command Palette (Cmd+P) to quickly access features.</p>
				</div>
			</div>
		</div>
	{:else}
		<!-- Render panel structure -->
		{#key $rootPanel}
			<PanelRenderer 
				panel={$rootPanel} 
				{draggedTabId} 
				{dropZonePanel} 
				{dropZoneDirection}
				on:dragstart={handleTabDragStart}
				on:dragend={handleTabDragEnd}
				on:dropzoneenter={handleDropZoneEnter}
				on:dropzoneleave={handleDropZoneLeave}
				on:drop={handleDrop}
			/>
		{/key}
	{/if}
</div>

<!-- Finder Modal -->
{#if $showFinder}
	<div class="modal-overlay" on:click={closeFinderModal} role="presentation">
		<div class="modal-content finder-modal" role="dialog" aria-label="Finder">
			<div class="modal-header">
				<h2>Finder</h2>
				<button
					class="close-button"
					on:click={() => showFinder.set(false)}
					aria-label="Close Finder"
				>
					<X size={20} />
				</button>
			</div>
			<div class="modal-body">
				<input
					type="text"
					placeholder="Search documents, files, or navigate..."
					class="search-input"
					autofocus
				/>
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

<!-- Command Palette Modal -->
{#if $showCommandPalette}
	<div class="modal-overlay" on:click={closeCommandPaletteModal} role="presentation">
		<div class="modal-content command-palette-modal" role="dialog" aria-label="Command Palette">
			<div class="modal-header">
				<h2>Command Palette</h2>
				<button
					class="close-button"
					on:click={() => showCommandPalette.set(false)}
					aria-label="Close Command Palette"
				>
					<X size={20} />
				</button>
			</div>
			<div class="modal-body">
				<input
					type="text"
					placeholder="Type a command..."
					class="search-input"
					autofocus
				/>
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

<style>
	.middle00-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background-color: #1e1e1e;
		overflow: hidden;
	}
	
	/* Welcome View */
	.welcome-view {
		padding: 3rem 2rem;
		max-width: 900px;
		margin: 0 auto;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	
	.welcome-view h1 {
		color: #fff;
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}
	
	.welcome-view > p {
		color: #888;
		font-size: 1.2rem;
		margin-bottom: 3rem;
	}
	
	.welcome-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}
	
	.card {
		background-color: #252526;
		border: 1px solid #333;
		border-radius: 8px;
		padding: 1.5rem;
		transition: transform 0.2s ease, border-color 0.2s ease;
	}
	
	.card:hover {
		transform: translateY(-2px);
		border-color: #0e639c;
	}
	
	.card h3 {
		color: #fff;
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}
	
	.card p {
		color: #888;
		font-size: 0.95rem;
		line-height: 1.5;
	}
	
	/* Modal Overlay */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(2px);
	}
	
	.modal-content {
		background-color: #252526;
		border: 1px solid #333;
		border-radius: 8px;
		width: 75%;
		max-width: 800px;
		max-height: 75vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #333;
	}
	
	.modal-header h2 {
		color: #fff;
		font-size: 1.2rem;
		margin: 0;
	}
	
	.close-button {
		background: transparent;
		border: none;
		color: #888;
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.2s ease;
	}
	
	.close-button:hover {
		background-color: #2a2a2a;
		color: #fff;
	}
	
	.modal-body {
		padding: 1.5rem;
		overflow: auto;
		flex: 1;
	}
	
	.search-input {
		width: 100%;
		padding: 0.75rem 1rem;
		background-color: #1e1e1e;
		border: 1px solid #333;
		border-radius: 4px;
		color: #fff;
		font-size: 1rem;
		margin-bottom: 1rem;
	}
	
	.search-input:focus {
		outline: none;
		border-color: #0e639c;
	}
	
	.search-results,
	.command-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.result-item,
	.command-item {
		padding: 0.75rem 1rem;
		background-color: #1e1e1e;
		border: 1px solid #333;
		border-radius: 4px;
		color: #ccc;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.result-item:hover,
	.command-item:hover {
		background-color: #2a2a2a;
		border-color: #0e639c;
		color: #fff;
	}
</style>
