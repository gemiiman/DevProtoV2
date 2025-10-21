<script lang="ts">
	// Import stores
	import { isLeft01Open, isRight01Open, isTerminalOpen } from '$lib/stores/layout';
	
	// Import icons from lucide-svelte
	import { PanelLeft, TerminalSquare, PanelRight } from 'lucide-svelte';
</script>

<!-- Top00: Top Bar with Panel Toggle Buttons -->
<div class="top00-container">
	<div class="toggle-buttons">
		<!-- Toggle Left Panel Button -->
		<button
			class="toggle-button"
			class:active={$isLeft01Open}
			on:click={() => isLeft01Open.update(v => !v)}
			title="Toggle Left Panel"
			aria-label="Toggle Left Panel"
		>
			<PanelLeft size={18} />
		</button>
		
		<!-- Toggle Terminal Button -->
		<button
			class="toggle-button"
			class:active={$isTerminalOpen}
			on:click={() => isTerminalOpen.update(v => !v)}
			title="Toggle Terminal"
			aria-label="Toggle Terminal"
		>
			<TerminalSquare size={18} />
		</button>
		
		<!-- Toggle Right Panel Button -->
		<button
			class="toggle-button"
			class:active={$isRight01Open}
			on:click={() => isRight01Open.update(v => !v)}
			title="Toggle Right Panel"
			aria-label="Toggle Right Panel"
		>
			<PanelRight size={18} />
		</button>
	</div>
</div>

<style>
	.top00-container {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		background-color: #1e1e1e;
		border-bottom: 1px solid #333;
		min-height: 40px;
	}
	
	.toggle-buttons {
		display: flex;
		gap: 0.5rem;
	}
	
	.toggle-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: transparent;
		border: none;
		border-radius: 4px;
		color: #888;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.toggle-button:hover {
		background-color: #2a2a2a;
		color: #fff;
	}
	
	.toggle-button.active {
		background-color: #0e639c;
		color: #fff;
	}
	
	.toggle-button:active {
		transform: scale(0.95);
	}
</style>
