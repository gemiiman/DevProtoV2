<!-- Terminal01: Data Source Panel (Collapsible Bottom Drawer) -->
<div class="terminal01-container">
	<div class="content-wrapper">
		<pre>[ AI Data Source | Cross-Reference ]

AI Ref [ID: 8A42] for change in 2.2-nonclinical-overview.docx:

Suggestion: Change "significant" to "statistically significant (p&lt;0.05)".

Source Data (m4-nonclinical/study-4B.pdf, pg 82):
"Group A (control) vs Group B (test) showed a p-value of 0.048 in
mean tumor volume reduction."

Awaiting user confirmation... █</pre>
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
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 13px;
		line-height: 1.6;
		color: #cccccc;
		white-space: pre;
	}
</style>
