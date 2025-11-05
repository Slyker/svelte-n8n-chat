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

	// Combine initial messages with chat messages
	const allMessages = $derived([...chatStore.initialMessages, ...chatStore.messages]);
	
	// Show typing indicator only if waiting AND last message is not a bot message (streaming)
	const showTypingIndicator = $derived(
		chatStore.waitingForResponse && 
		(allMessages.length === 0 || allMessages[allMessages.length - 1].sender !== 'bot')
	);
</script>

{#if allMessages.length === 0}
	{#if renderEmpty}
		{@render renderEmpty()}
	{:else}
		<div>No messages yet</div>
	{/if}
{:else}
	{#each allMessages as message (message.id)}
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
