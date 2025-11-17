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

	function handleScroll() {
		if (!chatBody) return;

		const { scrollTop, scrollHeight, clientHeight } = chatBody;
		const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
		shouldAutoScroll = isAtBottom;
	}

	function autoScrollAction(node: HTMLElement) {
		if (!enableAutoScroll) return {};

		let rafId: number | null = null;

		const observer = new MutationObserver(() => {
			if (!shouldAutoScroll || !messagesEndMarker || rafId !== null) {
				return;
			}

			rafId = requestAnimationFrame(() => {
				rafId = null;
				messagesEndMarker?.scrollIntoView({ behavior: 'smooth', block: 'end' });
			});
		});

		observer.observe(node, {
			childList: true,
			subtree: true,
			characterData: true,
		});

		return {
			destroy() {
				if (rafId !== null) {
					cancelAnimationFrame(rafId);
					rafId = null;
				}
				observer.disconnect();
			},
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
