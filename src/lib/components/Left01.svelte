<script lang="ts">
	// Import the tab management function
	import { openEditorTab } from '$lib/stores/layout';
	
	// Define folder structure with expand/collapse state
	interface FileItem {
		name: string;
	}
	
	interface Folder {
		name: string;
		expanded: boolean;
		files: FileItem[];
	}
	
	// Reactive folder tree
	let tree: Folder[] = [
		{
			name: 'm1-administrative',
			expanded: true,
			files: [
				{ name: '1.1-cover-letter.pdf' },
				{ name: '1.2-form-1571.pdf' }
			]
		},
		{
			name: 'm2-summaries',
			expanded: true,
			files: [
				{ name: '2.1-introduction.docx' },
				{ name: '2.2-nonclinical-overview.docx' },
				{ name: '2.3-clinical-overview.docx' }
			]
		},
		{
			name: 'm3-quality',
			expanded: true,
			files: [
				{ name: '3.1-drug-substance.pdf' }
			]
		},
		{
			name: 'm4-nonclinical',
			expanded: false,
			files: []
		},
		{
			name: 'm5-clinical',
			expanded: false,
			files: []
		}
	];
	
	// Ensure this function correctly updates the array to trigger reactivity
	function toggleFolder(folder: Folder) {
		folder.expanded = !folder.expanded;
		tree = [...tree]; // Reassign to trigger Svelte's reactivity
	}
</script>

<!-- Left01: Document Management Panel (Collapsible Drawer) -->
<div class="left01-container">
	<div class="content-wrapper">
		<div class="file-tree">
			<div class="tree-header">Submission: [Pre-IND 12345]</div>
			<div class="tree-divider">-------------------</div>
			
			<!-- Dynamic folder tree -->
			{#each tree as folder}
				<div class="folder">
					<button 
						class="folder-name"
						on:click={() => toggleFolder(folder)}
						aria-expanded={folder.expanded}
					>
						{folder.expanded ? '▼' : '►'} {folder.name}/
					</button>
					
					{#if folder.expanded}
						{#each folder.files as file}
							<button class="file-item" on:click={() => openEditorTab(file.name)}>
								{file.name}
							</button>
						{/each}
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.left01-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background-color: #252526;
		border-right: 1px solid #333;
		overflow: hidden;
	}
	
	.content-wrapper {
		flex: 1;
		overflow: auto;
		padding: 1rem;
	}
	
	.file-tree {
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 13px;
		line-height: 1.6;
		color: #cccccc;
	}
	
	.tree-header {
		margin-bottom: 0.25rem;
		color: #fff;
	}
	
	.tree-divider {
		margin-bottom: 0.5rem;
		color: #666;
	}
	
	.folder {
		margin-bottom: 0.5rem;
	}
	
	.folder-name {
		display: block;
		width: 100%;
		padding: 0.25rem 0;
		background: transparent;
		border: none;
		color: #cccccc;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 13px;
		text-align: left;
		cursor: pointer;
		margin-bottom: 0.25rem;
		user-select: none;
		transition: background-color 0.2s ease, color 0.2s ease;
		border-radius: 2px;
	}
	
	.folder-name:hover {
		background-color: #2a2a2a;
		color: #fff;
	}
	
	.file-item {
		display: block;
		width: 100%;
		padding: 0.25rem 0 0.25rem 1.5rem;
		background: transparent;
		border: none;
		color: #cccccc;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 13px;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;
		border-radius: 2px;
	}
	
	.file-item:hover {
		background-color: #2a2a2a;
		color: #fff;
	}
	
	.file-item:active {
		background-color: #0e639c;
	}
</style>
