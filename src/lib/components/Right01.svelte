<script lang="ts">
	import { activeTabId, tabs } from '$lib/stores/layout';

	// Define suggestions mapped to document titles
	// Add originalText and suggestedText where applicable
	const documentSuggestions: { [key: string]: Array<{ type: string; icon: string; text: string; ref?: string; actions: string[]; originalText?: string; suggestedText?: string }> } = {
		'1.1-cover-letter.pdf': [
			{ type: 'Formality & Completeness', icon: '✍️', text: "Review letter format, date, recipient details, and indication clarity.", actions: ['Apply Guidance', 'Dismiss'], originalText: "Date: Today, Oct 22", suggestedText: "Date: October 22, 2025" }
		],
		'1.2-form-1571.pdf': [
			{ type: 'Missing Information', icon: '⚠️', text: "Section 3 (Sponsor Address) and Section 10 (Phase of Investigation) appear incomplete.", actions: ['Show Fields', 'Dismiss'] }
		],
		'2.1-introduction.docx': [
			{ type: 'Vague Language', icon: '✍️', text: "Replace subjective phrases with specific conclusions.", actions: ['Rewrite', 'Dismiss'], originalText: "...showed promising results.", suggestedText: "...demonstrated inhibition of X." }
		],
		'2.2-nonclinical-overview.docx': [
			{ type: 'Inconsistent Terminology', icon: '⚠️', text: "Replace 'DRUG COMPOUND' with 'drug substance'.", ref: 'm3-quality/3.1-drug-substance.pdf', actions: ['Apply All', 'Dismiss'], originalText: "DRUG COMPOUND", suggestedText: "drug substance" },
			{ type: 'Specificity', icon: '✍️', text: "Clarify 'significant'.", actions: ['Clarify', 'Dismiss'], originalText: "Results were significant.", suggestedText: "Results showed statistical significance (p<0.05)." }
		],
		'2.3-clinical-overview.docx': [
			{ type: 'Missing Details', icon: '⚠️', text: "Missing Protocol Number and key study design elements.", actions: ['Add Details', 'Dismiss'] }
		],
		'3.1-drug-substance.pdf': [
			{ type: 'Placeholder Text', icon: 'ℹ️', text: "Section 'Process Validation' contains '[To be provided later]'.", actions: ['Mark Complete', 'Dismiss'] }
		]
	};

	// Reactive logic to get suggestions for the active tab
	$: activeTab = $tabs.find(t => t.id === $activeTabId);
	$: activeDocumentTitle = activeTab?.title || '[No active document]';
	$: suggestions = activeTab ? (documentSuggestions[activeTab.title] || []) : [];

</script>

<div class="right01-container">
	<div class="content-wrapper">
		<div class="copilot-header">AI Copilot</div>
		
		<div class="suggestions-section">
			<div class="suggestions-for">Suggestions for: [{activeDocumentTitle}]</div>

			{#if suggestions.length > 0}
				{#each suggestions as suggestion (suggestion.text)}
					<div class="suggestion-card">
						<div class="suggestion-header">
							<span class="suggestion-icon">{suggestion.icon}</span> {suggestion.type}
						</div>
						<div class="suggestion-body">
							{suggestion.text}

							{#if suggestion.originalText && suggestion.suggestedText}
								<div class="suggestion-diff">
									<span class="diff-original">{suggestion.originalText}</span>
									<span class="diff-arrow">→</span>
									<span class="diff-suggested">{suggestion.suggestedText}</span>
								</div>
							{/if}

							{#if suggestion.ref}
								<div class="suggestion-ref">(See reference: {suggestion.ref})</div>
							{/if}
						</div>
						<div class="suggestion-actions">
							{#each suggestion.actions as action}
								<button class="action-button {
									action.toLowerCase().includes('apply') || action.toLowerCase().includes('rewrite') || action.toLowerCase().includes('clarify') || action.toLowerCase().includes('generate') ? 'accept' :
									action.toLowerCase().includes('dismiss') || action.toLowerCase().includes('ignore') ? 'ignore' :
									action.toLowerCase().replace(' ', '-')
								}">{action}</button>
							{/each}
						</div>
					</div>
				{/each}
			{:else if activeTab}
				<div class="no-suggestions">No specific suggestions for {activeDocumentTitle}.</div>
			{:else}
				<div class="no-suggestions">Open a document to see suggestions.</div>
			{/if}
		</div>

		<div class="divider"></div>

		<div class="chat-section">
			<div class="chat-history">
				<div class="message user">> Where do I find the form for...?</div>
				<div class="message ai">Form 1571 is in 'm1-administrative'. [Click to open]</div>
			</div>
			<input type="text" placeholder="Ask a question or type '/' for commands..." class="chat-input"/>
			</div>
	</div>
</div>

<style>
	.right01-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background-color: #252526;
		border-left: 1px solid #333;
		overflow: hidden;
		font-family: sans-serif; /* Use a standard UI font */
		font-size: 13px;
		color: #ccc;
	}
	
	.content-wrapper {
		flex: 1;
		overflow-y: auto; /* Allow vertical scrolling */
		padding: 0; /* Remove padding here, add to sections */
	}

	.copilot-header {
		padding: 0.75rem 1rem;
		font-weight: 600;
		color: #fff;
		background-color: #1e1e1e;
		border-bottom: 1px solid #333;
		position: sticky;
		top: 0;
		z-index: 1;
	}

	.suggestions-section {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.suggestions-for {
		font-size: 0.9em;
		color: #888;
		margin-bottom: 0.5rem;
	}

	.suggestion-card {
		background-color: #1e1e1e;
		border: 1px solid #333;
		border-radius: 4px;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.suggestion-header {
		font-weight: 600;
		color: #eee;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.suggestion-icon {
		display: inline-block;
	}

	.suggestion-body {
		line-height: 1.5;
		color: #ccc;
	}

	.suggestion-ref {
		font-size: 0.85em;
		color: #0e639c;
		cursor: pointer;
		margin-top: 0.25rem;
	}
	.suggestion-ref:hover {
		text-decoration: underline;
	}
	
	.definition {
		color: #aaa;
		margin-top: 0.25rem;
		display: block;
	}

	.suggestion-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
		border-top: 1px solid #333;
		padding-top: 0.75rem;
	}

	.action-button {
		font-size: 0.8em;
		padding: 0.25rem 0.6rem;
		border-radius: 3px;
		cursor: pointer;
		background-color: #3a3a3d;
		border: 1px solid #555;
		color: #ccc;
		transition: background-color 0.2s ease;
	}
	.action-button:hover {
		background-color: #4a4a4d;
		border-color: #777;
		color: #fff;
	}
	.action-button.accept {
		background-color: #094771;
		border-color: #0e639c;
		color: #fff;
	}
	.action-button.accept:hover { background-color: #0e639c; }
	.action-button.generate { /* Similar style to accept */
		background-color: #094771;
		border-color: #0e639c;
		color: #fff;
	}
	.action-button.generate:hover { background-color: #0e639c; }


	.divider {
		height: 1px;
		background-color: #333;
		margin: 1rem 0;
	}

	.chat-section {
		padding: 0 1rem 1rem 1rem; /* Padding bottom */
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.chat-history {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.message {
		padding: 0.5rem;
		border-radius: 4px;
		line-height: 1.4;
	}
	.message.user {
		background-color: #1e1e1e;
		color: #aaa;
	}
	.message.ai {
		background-color: #2a2a2a;
		color: #ccc;
	}

	.chat-input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		background-color: #1e1e1e;
		border: 1px solid #333;
		border-radius: 4px;
		color: #fff;
		font-size: 13px;
		box-sizing: border-box; /* Include padding in width */
	}
	.chat-input:focus {
		outline: none;
		border-color: #0e639c;
	}

	/* Add style for the new message */
	.no-suggestions {
		color: #888;
		font-style: italic;
		text-align: center;
		padding: 1rem;
	}

	/* Ensure styles exist for potential new button classes if needed */
	.action-button.apply-guidance { background-color: #094771; border-color: #0e639c; color: #fff; }
	.action-button.apply-guidance:hover { background-color: #0e639c; }
	.action-button.show-fields { background-color: #3a3a3d; border-color: #555; }
	.action-button.rewrite { background-color: #094771; border-color: #0e639c; color: #fff; }
	.action-button.rewrite:hover { background-color: #0e639c; }
	.action-button.apply-all { background-color: #094771; border-color: #0e639c; color: #fff; }
	.action-button.apply-all:hover { background-color: #0e639c; }
	.action-button.clarify { background-color: #094771; border-color: #0e639c; color: #fff; }
	.action-button.clarify:hover { background-color: #0e639c; }
	.action-button.add-details { background-color: #3a3a3d; border-color: #555; }
	.action-button.mark-complete { background-color: #3a3a3d; border-color: #555; }

	/* Add styles for the visual diff */
	.suggestion-diff {
		margin-top: 0.5rem;
		padding: 0.5rem;
		background-color: rgba(0,0,0,0.2);
		border-radius: 3px;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 0.9em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 1px solid #444;
	}

	.diff-original {
		color: #f87171; /* Red */
		text-decoration: line-through;
	}

	.diff-arrow {
		color: #888;
	}

	.diff-suggested {
		color: #4ade80; /* Green */
	}

</style>
