<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		renderHeader?: Snippet;
		renderBody?: Snippet;
		renderFooter?: Snippet;
		enableAutoScroll?: boolean;
	}

	let { renderHeader, renderBody, renderFooter, enableAutoScroll = true }: Props = $props();

	let chatBody: HTMLDivElement | undefined = $state();
	let messagesEndMarker: HTMLDivElement | undefined = $state();
	let shouldAutoScroll = $state(true);

	// Track if user is manually scrolling
	function handleScroll(event: Event) {
		if (!chatBody) return;
		
		const { scrollTop, scrollHeight, clientHeight } = chatBody;
		const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
		shouldAutoScroll = isAtBottom;
	}

	// Svelte action for auto-scrolling
	function autoScrollAction(node: HTMLElement) {
		if (!enableAutoScroll) return {};

		const observer = new MutationObserver(() => {
			if (shouldAutoScroll && messagesEndMarker) {
				messagesEndMarker.scrollIntoView({ behavior: 'smooth', block: 'end' });
			}
		});

		observer.observe(node, {
			childList: true,
			subtree: true,
			characterData: true
		});

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<div class="chat-layout">
	{#if renderHeader}
		<div class="chat-header">
			{@render renderHeader()}
		</div>
	{/if}

	{#if renderBody}
		<div class="chat-body" bind:this={chatBody} onscroll={handleScroll} use:autoScrollAction>
			{@render renderBody()}
			{#if enableAutoScroll}
				<div bind:this={messagesEndMarker} class="messages-end-marker"></div>
			{/if}
		</div>
	{/if}

	{#if renderFooter}
		<div class="chat-footer">
			{@render renderFooter()}
		</div>
	{/if}
</div>

<style>
	/* Minimal structural styles - user controls all styling via CSS */
	.chat-layout {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.chat-header {
		flex-shrink: 0;
	}

	.chat-body {
		flex: 1;
		overflow-y: auto;
	}

	.messages-end-marker {
		height: 1px;
		visibility: hidden;
	}

	.chat-footer {
		flex-shrink: 0;
	}
</style>
