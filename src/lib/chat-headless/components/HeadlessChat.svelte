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

	const chatStore = createChatStore(options);
	setContext('chatStore', chatStore);

	let initialized = $state(false);

	async function initializeSession() {
		if (options.loadPreviousSession) {
			await chatStore.loadPreviousSession();
		} else {
			chatStore.setLoadingSession(false);
		}

		if (!options.showWelcomeScreen && !chatStore.currentSessionId) {
			await chatStore.startNewSession();
		}
	}

	$effect(() => {
		if (initialized) return;
		initialized = true;
		void initializeSession();
	});
</script>

{@render children(chatStore)}
