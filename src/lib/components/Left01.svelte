<script lang="ts">
	// Import the tab management function
	import { openEditorTab } from '$lib/stores/layout';
</script>

<!-- Left01: Document Management Panel (Collapsible Drawer) -->
<div class="left01-container">
	<div class="content-wrapper">
		<div class="file-tree">
			<div class="tree-header">Submission: [Pre-IND 12345]</div>
			<div class="tree-divider">-------------------</div>
			
			<!-- m1-administrative folder -->
			<div class="folder">
				<div class="folder-name">▼ m1-administrative/</div>
				<button class="file-item" on:click={() => openEditorTab('1.1-cover-letter.pdf')}>
					1.1-cover-letter.pdf
				</button>
				<button class="file-item" on:click={() => openEditorTab('1.2-form-1571.pdf')}>
					1.2-form-1571.pdf
				</button>
			</div>
			
			<!-- m2-summaries folder -->
			<div class="folder">
				<div class="folder-name">▼ m2-summaries/</div>
				<button class="file-item" on:click={() => openEditorTab('2.1-introduction.docx')}>
					2.1-introduction.docx
				</button>
				<button class="file-item" on:click={() => openEditorTab('2.2-nonclinical-overview.docx')}>
					2.2-nonclinical-overview.docx
				</button>
				<button class="file-item" on:click={() => openEditorTab('2.3-clinical-overview.docx')}>
					2.3-clinical-overview.docx
				</button>
			</div>
			
			<!-- m3-quality folder -->
			<div class="folder">
				<div class="folder-name">▼ m3-quality/</div>
				<button class="file-item" on:click={() => openEditorTab('3.1-drug-substance.pdf')}>
					3.1-drug-substance.pdf
				</button>
			</div>
			
			<!-- Collapsed folders -->
			<div class="folder-name">► m4-nonclinical/</div>
			<div class="folder-name">► m5-clinical/</div>
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
		color: #cccccc;
		margin-bottom: 0.25rem;
		user-select: none;
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
