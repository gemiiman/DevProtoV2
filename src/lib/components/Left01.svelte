<!-- Left01: Document Management Panel (Collapsible Drawer) -->
<div class="left01-container">
	<div class="content-wrapper">
		<pre>Submission: [Pre-IND 12345]
-------------------
▼ m1-administrative/
    1.1-cover-letter.pdf
    1.2-form-1571.pdf
▼ m2-summaries/
    2.1-introduction.docx
    2.2-nonclinical-overview.docx
    2.3-clinical-overview.docx
▼ m3-quality/
    3.1-drug-substance.pdf
► m4-nonclinical/
► m5-clinical/</pre>
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
	
	pre {
		margin: 0;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 13px;
		line-height: 1.6;
		color: #cccccc;
		white-space: pre;
	}
</style>
