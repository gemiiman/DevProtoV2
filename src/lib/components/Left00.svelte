<script lang="ts">
	// Import stores and functions
	import { showFinder, showCommandPalette, openGraphTab, tabs, activeTabId } from '$lib/stores/layout';
	
	// Import icons from lucide-svelte
	import { Search, Network, Terminal } from 'lucide-svelte';
	
	// Check if graph tab is active
	$: isGraphActive = $tabs.some(tab => tab.kind === 'graph' && tab.id === $activeTabId);
</script>

<!-- Left00: Static Sidebar with Action Buttons -->
<div class="left00-container">
	<!-- Finder Button -->
	<button
		class="action-button"
		on:click={() => showFinder.set(true)}
		title="Finder"
		aria-label="Open Finder"
	>
		<Search size={20} />
	</button>
	
	<!-- Graph View Button -->
	<button
		class="action-button"
		class:active={isGraphActive}
		on:click={openGraphTab}
		title="Graph View"
		aria-label="Switch to Graph View"
	>
		<Network size={20} />
	</button>
	
	<!-- Command Palette Button -->
	<button
		class="action-button"
		on:click={() => showCommandPalette.set(true)}
		title="Command Palette (Cmd+P)"
		aria-label="Open Command Palette"
	>
		<Terminal size={20} />
	</button>
</div>

<style>
	.left00-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 0.5rem;
		background-color: #1e1e1e;
		border-right: 1px solid #333;
		min-width: 48px;
	}
	
	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: transparent;
		border: none;
		border-radius: 4px;
		color: #888;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.action-button:hover {
		background-color: #2a2a2a;
		color: #fff;
	}
	
	.action-button.active {
		background-color: #0e639c;
		color: #fff;
	}
	
	.action-button:active {
		transform: scale(0.95);
	}
</style>
