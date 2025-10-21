<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	
	// Import all layout stores
	import {
		isLeft01Open,
		isRight01Open,
		isTerminalOpen,
		showFinder,
		showCommandPalette,
		activeView
	} from '$lib/stores/layout';
	
	// Import panel components
	import Top00 from '$lib/components/Top00.svelte';
	import Left00 from '$lib/components/Left00.svelte';
	import Left01 from '$lib/components/Left01.svelte';
	import Right01 from '$lib/components/Right01.svelte';
	import Terminal01 from '$lib/components/Terminal01.svelte';
	
	// Panel size state
	let left01Width = 250; // Default width for Left01
	let right01Width = 300; // Default width for Right01
	let terminalHeight = 200; // Default height for Terminal01
	
	// Dragging state
	let isDraggingLeftSplitter = false;
	let isDraggingRightSplitter = false;
	let isDraggingTerminalSplitter = false;
	
	// Mouse event handlers for Left01 splitter (vertical)
	function startDragLeftSplitter() {
		isDraggingLeftSplitter = true;
	}
	
	// Mouse event handlers for Right01 splitter (vertical)
	function startDragRightSplitter() {
		isDraggingRightSplitter = true;
	}
	
	// Mouse event handlers for Terminal01 splitter (horizontal)
	function startDragTerminalSplitter() {
		isDraggingTerminalSplitter = true;
	}
	
	// Handle mouse move for all splitters
	function handleMouseMove(event: MouseEvent) {
		if (isDraggingLeftSplitter) {
			// Calculate new width based on mouse position
			// Left00 is 48px wide, so subtract that
			const newWidth = event.clientX - 48;
			if (newWidth >= 150 && newWidth <= 500) {
				left01Width = newWidth;
			}
		} else if (isDraggingRightSplitter) {
			// Calculate from the right edge
			const newWidth = window.innerWidth - event.clientX;
			if (newWidth >= 200 && newWidth <= 600) {
				right01Width = newWidth;
			}
		} else if (isDraggingTerminalSplitter) {
			// Calculate from the bottom edge
			const newHeight = window.innerHeight - event.clientY - 40; // 40px for Top00
			if (newHeight >= 100 && newHeight <= 500) {
				terminalHeight = newHeight;
			}
		}
	}
	
	// Stop dragging on mouse up
	function stopDragging() {
		isDraggingLeftSplitter = false;
		isDraggingRightSplitter = false;
		isDraggingTerminalSplitter = false;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={stopDragging} />

<!-- Main Application Layout -->
<div class="app-container">
	<!-- Top00 Bar -->
	<Top00 />
	
	<!-- Main Content Area: Horizontal Layout -->
	<div class="main-content">
		<!-- Left00: Static Sidebar -->
		<Left00 />
		
		<!-- Left01: Collapsible Panel (Drawer) -->
		{#if $isLeft01Open}
			<div class="left01-panel" style="width: {left01Width}px;">
				<Left01 />
			</div>
			
			<!-- Vertical Splitter between Left01 and Central Column -->
			<div
				class="splitter splitter-vertical"
				on:mousedown={startDragLeftSplitter}
				role="separator"
				aria-label="Resize left panel"
			></div>
		{/if}
		
		<!-- Central Column: Vertical Container for Middle00 (slot) and Terminal01 -->
		<div class="central-column">
			<!-- Middle00: Dynamic Content Area (slot) -->
			<div class="middle-content">
				<slot />
			</div>
			
			<!-- Terminal01: Collapsible Bottom Panel -->
			{#if $isTerminalOpen}
				<!-- Horizontal Splitter between Middle00 and Terminal01 -->
				<div
					class="splitter splitter-horizontal"
					on:mousedown={startDragTerminalSplitter}
					role="separator"
					aria-label="Resize terminal"
				></div>
				
				<div class="terminal-panel" style="height: {terminalHeight}px;">
					<Terminal01 />
				</div>
			{/if}
		</div>
		
		<!-- Right01: Collapsible Panel (Drawer) -->
		{#if $isRight01Open}
			<!-- Vertical Splitter between Central Column and Right01 -->
			<div
				class="splitter splitter-vertical"
				on:mousedown={startDragRightSplitter}
				role="separator"
				aria-label="Resize right panel"
			></div>
			
			<div class="right01-panel" style="width: {right01Width}px;">
				<Right01 />
			</div>
		{/if}
	</div>
</div>

<style>
	.app-container {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		user-select: none;
	}
	
	.main-content {
		display: flex;
		flex: 1;
		overflow: hidden;
	}
	
	.central-column {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		min-width: 0;
	}
	
	.middle-content {
		flex: 1;
		overflow: auto;
		min-height: 0;
	}
	
	/* Panel wrappers with dynamic sizing */
	.left01-panel,
	.right01-panel {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		flex-shrink: 0;
	}
	
	.terminal-panel {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		flex-shrink: 0;
	}
	
	/* Splitter styles */
	.splitter {
		background-color: #333;
		flex-shrink: 0;
		position: relative;
		transition: background-color 0.2s ease;
	}
	
	.splitter:hover {
		background-color: #0e639c;
	}
	
	.splitter:active {
		background-color: #1177bb;
	}
	
	/* Vertical splitters (between left/right panels) */
	.splitter-vertical {
		width: 4px;
		cursor: col-resize;
	}
	
	/* Horizontal splitter (between Middle00 and Terminal01) */
	.splitter-horizontal {
		height: 4px;
		cursor: row-resize;
	}
	
	/* Prevent text selection while dragging */
	:global(body.dragging) {
		cursor: col-resize !important;
		user-select: none !important;
	}
</style>
