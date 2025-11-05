<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'isomorphic-dompurify';

	interface Props {
		content: string;
	}

	let { content }: Props = $props();

	// Configure marked for better rendering
	marked.setOptions({
		breaks: true, // Convert \n to <br>
		gfm: true, // GitHub Flavored Markdown
	});

	// Render markdown and sanitize HTML
	const html = $derived(() => {
		const rendered = marked.parse(content);
		return DOMPurify.sanitize(rendered);
	});
</script>

<div class="markdown-content">
	{@html html()}
</div>

<style>
	.markdown-content :global(p) {
		margin: 0.5rem 0;
	}

	.markdown-content :global(p:first-child) {
		margin-top: 0;
	}

	.markdown-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.markdown-content :global(code) {
		background-color: rgba(0, 0, 0, 0.05);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: 'Courier New', monospace;
		font-size: 0.875em;
	}

	.markdown-content :global(pre) {
		background-color: rgba(0, 0, 0, 0.05);
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 0.5rem 0;
	}

	.markdown-content :global(pre code) {
		background-color: transparent;
		padding: 0;
	}

	.markdown-content :global(a) {
		color: var(--ai-primary, #667eea);
		text-decoration: underline;
	}

	.markdown-content :global(a:hover) {
		color: var(--ai-primary-dark, #5568d3);
	}

	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	.markdown-content :global(li) {
		margin: 0.25rem 0;
	}

	.markdown-content :global(blockquote) {
		border-left: 4px solid rgba(0, 0, 0, 0.1);
		padding-left: 1rem;
		margin: 0.5rem 0;
		color: rgba(0, 0, 0, 0.6);
	}

	.markdown-content :global(h1),
	.markdown-content :global(h2),
	.markdown-content :global(h3),
	.markdown-content :global(h4),
	.markdown-content :global(h5),
	.markdown-content :global(h6) {
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.markdown-content :global(h1:first-child),
	.markdown-content :global(h2:first-child),
	.markdown-content :global(h3:first-child) {
		margin-top: 0;
	}

	.markdown-content :global(table) {
		border-collapse: collapse;
		width: 100%;
		margin: 0.5rem 0;
	}

	.markdown-content :global(th),
	.markdown-content :global(td) {
		border: 1px solid rgba(0, 0, 0, 0.1);
		padding: 0.5rem;
		text-align: left;
	}

	.markdown-content :global(th) {
		background-color: rgba(0, 0, 0, 0.05);
		font-weight: 600;
	}

	.markdown-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
	}

	.markdown-content :global(hr) {
		border: none;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
	}
</style>
