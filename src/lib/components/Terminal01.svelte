<script lang="ts">
	import { activeTabId, tabs } from '$lib/stores/layout';

	// 2. Define Contextual Content for Terminal
	const terminalContent: { [key: string]: string } = {
		'1.1-cover-letter.pdf': `[ Cross-Reference: FDA Guidance - Formal Correspondence ]
Guidance Excerpt: "All formal correspondence, including meeting requests, should follow standard business letter formats..."
CFR Reference: 21 CFR § 312.47 (Meetings) - Suggests formal procedures.
Note: Ensure date format is unambiguous (e.g., Month DD, YYYY).`,

		'1.2-form-1571.pdf': `[ Cross-Reference: Form FDA 1571 Instructions ]
Field 3: Sponsor Address - Must be complete mailing address.
Field 10: Phase(s) of Clinical Investigation - Indicate the specific phase(s) (e.g., Phase 1, Phase 2, Phase 3).
Reference: Instructions for Filling Out Form FDA 1571.`,

		'2.1-introduction.docx': `[ Cross-Reference: ICH M4E Guideline - Clinical Overview Introduction ]
Guideline Principle: "The introduction should concisely present the drug and therapeutic context... Avoid vague or overly promotional language."
Example: Instead of 'promising results', state the key finding directly.`,

		'2.2-nonclinical-overview.docx': `[ Cross-Reference: ICH M3(R2) Guideline - Nonclinical Safety Studies ]
Terminology Note: Use consistent terminology as defined in ICH guidelines and CTD structure. 'Drug substance' is preferred over 'drug compound' in Module 3 / Quality sections.
Data Interpretation: 'Significant' requires context - specify statistical significance (p-value) or describe the magnitude of the effect observed.
Source Data Example (Simulated): m4-nonclinical/study-4B.pdf, pg 82: "Group A vs Group B showed p=0.048".`,

		'2.3-clinical-overview.docx': `[ Cross-Reference: 21 CFR § 312.23(a)(6) - IND Content/Format - Protocols ]
Requirement: "(i) A protocol for each planned study..."
Content: Protocols should include objectives, design, methodology, statistical considerations, etc. Ensure the protocol number is cited correctly in the overview.`,

		'3.1-drug-substance.pdf': `[ Cross-Reference: ICH Q7 Guideline - Good Manufacturing Practice ]
Section 12: Validation - "Process validation for drug substances should confirm that the manufacturing process...consistently produces a drug substance meeting its predetermined specifications..."
Note: Placeholders like '[To be provided later]' are acceptable in early stages but must be resolved. Track completion status.`
	};

	// 3. Reactive Logic
	$: activeTab = $tabs.find(t => t.id === $activeTabId);
	$: displayContent = activeTab
		? terminalContent[activeTab.title] || `[ AI Data Source | Cross-Reference ]\n\nNo specific reference content found for ${activeTab.title}.` 
		: '[ AI Data Source | Cross-Reference ]\n\nNo document active. Open a file to see relevant source data or references.';

</script>

<div class="terminal01-container">
	<div class="content-wrapper">
		<pre>{displayContent}</pre>
	</div>
</div>

<style>
	.terminal01-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background-color: #1e1e1e;
		border-top: 1px solid #333;
		overflow: hidden;
	}

	.content-wrapper {
		flex: 1;
		overflow: auto;
		padding: 1rem;
	}

	pre {
		margin: 0;
		font-family: 'PT Serif', serif;
		font-size: 13px;
		line-height: 1.6;
		color: #cccccc;
		white-space: pre-wrap; /* Allow wrapping */
		word-wrap: break-word; /* Break long words */
	}
</style>
