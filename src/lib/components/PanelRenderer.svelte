<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { tabs, setActiveTab, closeTab, type Panel, type LeafPanel } from '$lib/stores/layout';
	import { X } from 'lucide-svelte';
	
	export let panel: Panel;
	export let draggedTabId: string | null = null;
	export let dropZonePanel: string | null = null;
	export let dropZoneDirection: 'top' | 'bottom' | 'left' | 'right' | null = null;
	
	const dispatch = createEventDispatcher();
	
	// Get tab by ID
	function getTabById(id: string) {
		return $tabs.find(t => t.id === id);
	}
	
	// Tab drag handlers
	function handleTabDragStart(event: DragEvent, tabId: string) {
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', tabId);
		}
		dispatch('dragstart', tabId);
	}
	
	function handleTabDragEnd() {
		dispatch('dragend');
	}
	
	// Drop zone handlers
	function handleDropZoneEnter(panelId: string, direction: 'top' | 'bottom' | 'left' | 'right') {
		dispatch('dropzoneenter', { panelId, direction });
	}
	
	function handleDropZoneDrop(event: DragEvent, panelId: string, direction: 'top' | 'bottom' | 'left' | 'right') {
		event.preventDefault();
		dispatch('drop', { panelId, direction });
	}
	
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}
</script>

{#if panel.type === 'leaf'}
	<!-- Leaf Panel: Render tabs and content -->
	<div class="leaf-panel" data-panel-id={panel.id}>
		<!-- Drop zones for splitting -->
		{#if draggedTabId && !panel.tabIds.includes(draggedTabId)}
			<div 
				class="drop-zone drop-zone-top"
				class:active={dropZonePanel === panel.id && dropZoneDirection === 'top'}
				on:dragenter={() => handleDropZoneEnter(panel.id, 'top')}
				on:dragleave={() => dispatch('dropzoneleave')}
				on:dragover={handleDragOver}
				on:drop={(e) => handleDropZoneDrop(e, panel.id, 'top')}
				role="region"
				aria-label="Drop zone top"
			>
				<div class="drop-indicator">Drop here to split horizontally</div>
			</div>
			
			<div 
				class="drop-zone drop-zone-bottom"
				class:active={dropZonePanel === panel.id && dropZoneDirection === 'bottom'}
				on:dragenter={() => handleDropZoneEnter(panel.id, 'bottom')}
				on:dragleave={() => dispatch('dropzoneleave')}
				on:dragover={handleDragOver}
				on:drop={(e) => handleDropZoneDrop(e, panel.id, 'bottom')}
				role="region"
				aria-label="Drop zone bottom"
			>
				<div class="drop-indicator">Drop here to split horizontally</div>
			</div>
			
			<div 
				class="drop-zone drop-zone-left"
				class:active={dropZonePanel === panel.id && dropZoneDirection === 'left'}
				on:dragenter={() => handleDropZoneEnter(panel.id, 'left')}
				on:dragleave={() => dispatch('dropzoneleave')}
				on:dragover={handleDragOver}
				on:drop={(e) => handleDropZoneDrop(e, panel.id, 'left')}
				role="region"
				aria-label="Drop zone left"
			>
				<div class="drop-indicator">Drop here to split vertically</div>
			</div>
			
			<div 
				class="drop-zone drop-zone-right"
				class:active={dropZonePanel === panel.id && dropZoneDirection === 'right'}
				on:dragenter={() => handleDropZoneEnter(panel.id, 'right')}
				on:dragleave={() => dispatch('dropzoneleave')}
				on:dragover={handleDragOver}
				on:drop={(e) => handleDropZoneDrop(e, panel.id, 'right')}
				role="region"
				aria-label="Drop zone right"
			>
				<div class="drop-indicator">Drop here to split vertically</div>
			</div>
		{/if}
		
		<!-- Tab Bar -->
		<div class="tab-bar">
			{#if panel.tabIds.length === 0}
				<div class="no-tabs-message">No tabs in this panel</div>
			{:else}
				{#each panel.tabIds as tabId}
					{@const tab = getTabById(tabId)}
					{#if tab}
						<div 
							class="tab"
							class:active={panel.activeTabId === tab.id}
							draggable="true"
							on:dragstart={(e) => handleTabDragStart(e, tab.id)}
							on:dragend={handleTabDragEnd}
							on:click={() => setActiveTab(tab.id)}
							role="tab"
							tabindex="0"
							aria-selected={panel.activeTabId === tab.id}
						>
							<span class="tab-title">{tab.title}</span>
							<button 
								class="tab-close"
								on:click|stopPropagation={() => closeTab(tab.id)}
								aria-label="Close {tab.title}"
							>
								<X size={14} />
							</button>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
		
		<!-- Content Area -->
		<div class="content-area">
			{#if !panel.activeTabId || panel.tabIds.length === 0}
				<div class="empty-panel">
					<p>No active tab</p>
				</div>
			{:else}
				{@const activeTab = getTabById(panel.activeTabId)}
				{#if activeTab}
					{#if activeTab.kind === 'graph'}
						<!-- Graph View -->
						<div class="graph-view">
							<h1>Graph View</h1>
							<div class="graph-placeholder">
								<p>Graph visualization will be rendered here</p>
								<div class="graph-mockup">
									<svg viewBox="0 0 400 300" class="graph-svg">
										<circle cx="100" cy="150" r="30" fill="#0e639c" />
										<circle cx="200" cy="80" r="30" fill="#0e639c" />
										<circle cx="200" cy="220" r="30" fill="#0e639c" />
										<circle cx="300" cy="150" r="30" fill="#0e639c" />
										<line x1="100" y1="150" x2="200" y2="80" stroke="#888" stroke-width="2" />
										<line x1="100" y1="150" x2="200" y2="220" stroke="#888" stroke-width="2" />
										<line x1="200" y1="80" x2="300" y2="150" stroke="#888" stroke-width="2" />
										<line x1="200" y1="220" x2="300" y2="150" stroke="#888" stroke-width="2" />
									</svg>
								</div>
							</div>
						</div>
					{:else if activeTab.kind === 'editor'}
						<!-- Editor View -->
						<div class="editor-view">
							<div class="editor-header">
								<h2>{activeTab.title}</h2>
							</div>
							<textarea 
								class="editor-textarea"
								placeholder="Document content will appear here..."
							></textarea>
						</div>
					{:else if activeTab.kind === 'template'}
						<!-- Template View -->
						<div class="template-view">
							<h2>Template: {activeTab.title}</h2>
							<p>Template editor placeholder</p>
						</div>
					{/if}
				{/if}
			{/if}
		</div>
	</div>
{:else if panel.type === 'split'}
	<!-- Split Panel: Render two child panels -->
	<div 
		class="split-panel"
		class:horizontal={panel.orientation === 'horizontal'}
		class:vertical={panel.orientation === 'vertical'}
	>
		<div class="split-first" style="flex: {panel.ratio};">
			<svelte:self 
				panel={panel.first} 
				{draggedTabId} 
				{dropZonePanel} 
				{dropZoneDirection}
				on:dragstart
				on:dragend
				on:dropzoneenter
				on:dropzoneleave
				on:drop
			/>
		</div>
		
		<div class="splitter"></div>
		
		<div class="split-second" style="flex: {1 - panel.ratio};">
			<svelte:self 
				panel={panel.second} 
				{draggedTabId} 
				{dropZonePanel} 
				{dropZoneDirection}
				on:dragstart
				on:dragend
				on:dropzoneenter
				on:dropzoneleave
				on:drop
			/>
		</div>
	</div>
{/if}

<style>
	/* Leaf Panel */
	.leaf-panel {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		position: relative;
		background-color: #1e1e1e;
	}
	
	/* Drop Zones */
	.drop-zone {
		position: absolute;
		z-index: 100;
		background-color: rgba(14, 99, 156, 0.1);
		border: 2px dashed transparent;
		transition: all 0.2s ease;
		pointer-events: all;
	}
	
	.drop-zone.active {
		background-color: rgba(14, 99, 156, 0.3);
		border-color: #0e639c;
	}
	
	.drop-zone-top {
		top: 0;
		left: 0;
		right: 0;
		height: 25%;
	}
	
	.drop-zone-bottom {
		bottom: 0;
		left: 0;
		right: 0;
		height: 25%;
	}
	
	.drop-zone-left {
		top: 25%;
		bottom: 25%;
		left: 0;
		width: 25%;
	}
	
	.drop-zone-right {
		top: 25%;
		bottom: 25%;
		right: 0;
		width: 25%;
	}
	
	.drop-indicator {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #0e639c;
		font-size: 0.9rem;
		font-weight: 600;
		text-align: center;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s ease;
	}
	
	.drop-zone.active .drop-indicator {
		opacity: 1;
	}
	
	/* Tab Bar */
	.tab-bar {
		display: flex;
		align-items: center;
		background-color: #252526;
		border-bottom: 1px solid #333;
		min-height: 35px;
		overflow-x: auto;
		overflow-y: hidden;
		flex-shrink: 0;
		position: relative;
		z-index: 1;
	}
	
	.no-tabs-message {
		padding: 0.5rem 1rem;
		color: #888;
		font-size: 0.85rem;
	}
	
	.tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background-color: transparent;
		border-right: 1px solid #333;
		color: #888;
		cursor: move;
		transition: background-color 0.2s ease, color 0.2s ease;
		white-space: nowrap;
		user-select: none;
	}
	
	.tab:hover {
		background-color: #2a2a2a;
		color: #ccc;
	}
	
	.tab.active {
		background-color: #1e1e1e;
		color: #fff;
		border-bottom: 2px solid #0e639c;
	}
	
	.tab-title {
		font-size: 0.85rem;
	}
	
	.tab-close {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 0.2rem;
		border-radius: 2px;
		opacity: 0.7;
		transition: opacity 0.2s ease, background-color 0.2s ease;
	}
	
	.tab-close:hover {
		opacity: 1;
		background-color: rgba(255, 255, 255, 0.1);
	}
	
	/* Content Area */
	.content-area {
		flex: 1;
		overflow: auto;
		background-color: #1e1e1e;
		position: relative;
	}
	
	.empty-panel {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #666;
	}
	
	/* Graph View */
	.graph-view {
		padding: 2rem;
		width: 100%;
		height: 100%;
	}
	
	.graph-view h1 {
		color: #fff;
		margin-bottom: 2rem;
	}
	
	.graph-placeholder {
		background-color: #252526;
		border: 1px solid #333;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
	}
	
	.graph-placeholder p {
		color: #888;
		margin-bottom: 2rem;
	}
	
	.graph-mockup {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 300px;
	}
	
	.graph-svg {
		max-width: 400px;
		width: 100%;
		height: auto;
	}
	
	/* Editor View */
	.editor-view {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	
	.editor-header {
		padding: 1rem 1.5rem;
		background-color: #252526;
		border-bottom: 1px solid #333;
	}
	
	.editor-header h2 {
		color: #fff;
		font-size: 1.1rem;
		margin: 0;
	}
	
	.editor-textarea {
		flex: 1;
		padding: 1.5rem;
		background-color: #1e1e1e;
		border: none;
		color: #ccc;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 14px;
		line-height: 1.6;
		resize: none;
	}
	
	.editor-textarea:focus {
		outline: none;
	}
	
	.editor-textarea::placeholder {
		color: #555;
	}
	
	/* Template View */
	.template-view {
		padding: 2rem;
		color: #ccc;
	}
	
	.template-view h2 {
		color: #fff;
		margin-bottom: 1rem;
	}
	
	/* Split Panel */
	.split-panel {
		display: flex;
		width: 100%;
		height: 100%;
	}
	
	.split-panel.horizontal {
		flex-direction: row;
	}
	
	.split-panel.vertical {
		flex-direction: column;
	}
	
	.split-first,
	.split-second {
		display: flex;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}
	
	.splitter {
		background-color: #333;
		flex-shrink: 0;
	}
	
	.horizontal .splitter {
		width: 4px;
		cursor: col-resize;
	}
	
	.vertical .splitter {
		height: 4px;
		cursor: row-resize;
	}
	
	.splitter:hover {
		background-color: #0e639c;
	}
</style>
