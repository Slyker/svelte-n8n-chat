<script lang="ts" module>
	import type { ChatOptions } from '../types/index.js';
	import type { ChatStore } from '../stores/index.js';
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { createChatStore } from '../stores/chat.svelte.js';
	import type { Snippet } from 'svelte';

	interface Props {
		options: ChatOptions;
		children: Snippet<[ChatStore]>;
	}

	let { options, children }: Props = $props();

	// Create the chat store
	const chatStore = createChatStore(options);

	// Provide the store to child components via context
	setContext('chatStore', chatStore);

	// Initialize session
	$effect(() => {
		(async () => {
			if (options.loadPreviousSession) {
				await chatStore.loadPreviousSession();
			}
			if (!options.showWelcomeScreen && !chatStore.currentSessionId) {
				await chatStore.startNewSession();
			}
		})();
	});
</script>

{@render children(chatStore)}
