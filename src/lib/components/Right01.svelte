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
		<!-- Top Context Bar -->
		<div class="copilot-context-bar">
			Context: {activeDocumentTitle}
		</div>
		
		<!-- Chat History -->
		<div class="chat-history">
			<div class="message user">> Where do I find the form for...?</div>
			<div class="message ai">Form 1571 is in 'm1-administrative'. [Click to open]</div>
		</div>

		<!-- Main Input Area -->
		<div class="chat-input-container">
			<input type="text" placeholder="Ask anything..." class="chat-input"/>
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
		font-size: 13px;
		color: #ccc;
	}
	
	.content-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding: 0;
	}

	.copilot-context-bar {
		padding: 0.75rem 1rem;
		font-size: 0.9em;
		color: #ccc;
		background-color: #1e1e1e;
		border-bottom: 1px solid #333;
		flex-shrink: 0;
	}


	.chat-history {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
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

	.chat-input-container {
		padding: 1rem;
		flex-shrink: 0;
	}

	.chat-input {
		width: 100%;
		padding: 1rem;
		background-color: #1e1e1e;
		border: 1px solid #333;
		border-radius: 8px;
		color: #fff;
		font-size: 14px;
		box-sizing: border-box;
		transition: border-color 0.2s ease;
	}
	.chat-input:focus {
		outline: none;
		border-color: #0e639c;
	}



</style>
