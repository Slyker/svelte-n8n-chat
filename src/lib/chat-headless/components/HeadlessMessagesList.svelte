<script lang="ts" module>
	import type { ChatMessage } from '../types/index.js';
	import type { ChatStore } from '../stores/index.js';
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		renderMessage?: Snippet<[ChatMessage]>;
		renderTyping?: Snippet;
		renderEmpty?: Snippet;
	}

	let { renderMessage, renderTyping, renderEmpty }: Props = $props();

	const chatStore = getContext<ChatStore>('chatStore');

	const hasMessages = $derived(
		chatStore.initialMessages.length > 0 || chatStore.messages.length > 0
	);

	const showTypingIndicator = $derived(() => {
		if (!chatStore.waitingForResponse) {
			return false;
		}
		const allMessages = [...chatStore.initialMessages, ...chatStore.messages];
		return allMessages.length === 0 || allMessages[allMessages.length - 1].sender !== 'bot';
	});
</script>

{#if !hasMessages}
	{#if renderEmpty}
		{@render renderEmpty()}
	{:else}
		<div>No messages yet</div>
	{/if}
{:else}
	{#if chatStore.initialMessages.length > 0}
		{#each chatStore.initialMessages as message (message.id)}
			{#if renderMessage}
				{@render renderMessage(message)}
			{:else}
				<div>
					<strong>{message.sender}:</strong> {message.text}
				</div>
			{/if}
		{/each}
	{/if}

	{#each chatStore.messages as message (message.id)}
		{#if renderMessage}
			{@render renderMessage(message)}
		{:else}
			<div>
				<strong>{message.sender}:</strong> {message.text}
			</div>
		{/if}
	{/each}
	
	{#if showTypingIndicator}
		{#if renderTyping}
			{@render renderTyping()}
		{:else}
			<div>Typing...</div>
		{/if}
	{/if}
{/if}
