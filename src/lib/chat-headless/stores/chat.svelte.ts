import { v4 as uuidv4 } from 'uuid';
import * as api from '../api/index.js';
import { defaultOptions } from '../utils/defaults.js';
import { getI18nMessages } from '../utils/i18n.js';
import type {
	ChatMessage,
	ChatMessageText,
	ChatOptions,
	SendMessageResponse,
} from '../types/index.js';

const LOCAL_STORAGE_SESSION_ID_KEY = 'n8n-chat-session-id';

/**
 * Creates a user message
 */
function createUserMessage(text: string, files: File[] = []): ChatMessage {
	return {
		id: uuidv4(),
		text,
		sender: 'user',
		files,
	};
}

/**
 * Creates a bot message
 */
function createBotMessage(text: string = ''): ChatMessageText {
	return {
		id: uuidv4(),
		text,
		sender: 'bot',
	};
}

/**
 * Process message response
 */
function processMessageResponse(response: SendMessageResponse): string {
	let textMessage = response.output ?? response.text ?? response.message ?? '';

	if (textMessage === '' && Object.keys(response).length > 0) {
		try {
			textMessage = JSON.stringify(response, null, 2);
		} catch (e) {
			// Failed to stringify, keep empty
		}
	}

	return textMessage;
}

/**
 * Create the chat store using Svelte 5 runes
 */
export function createChatStore(providedOptions: ChatOptions) {
	// Merge provided options with defaults
	const options: ChatOptions = { ...defaultOptions, ...providedOptions };

	// Reactive state using $state
	let messages = $state<ChatMessage[]>([]);
	let currentSessionId = $state<string | null>(null);
	let waitingForResponse = $state(false);
	let ws = $state<WebSocket | null>(null);
	let isLoadingSession = $state(options.loadPreviousSession === true);

	// Derived state using $derived
	const initialMessages = $derived(
		(options.initialMessages ?? []).map((text) => createBotMessage(text))
	);

	// i18n messages
	const i18n = $derived(getI18nMessages(options));

	/**
	 * Load previous session from server
	 */
	async function loadPreviousSession(): Promise<string | undefined> {
		if (!options.loadPreviousSession) {
			isLoadingSession = false;
			return;
		}

		isLoadingSession = true;

		// Get or create sessionId
		let sessionId = localStorage.getItem(LOCAL_STORAGE_SESSION_ID_KEY);
		if (!sessionId) {
			sessionId = uuidv4();
			localStorage.setItem(LOCAL_STORAGE_SESSION_ID_KEY, sessionId);
		}

		try {
			const previousMessagesResponse = await api.loadPreviousSession(sessionId, options);

			const loadedMessages = (previousMessagesResponse?.data || []).map((message, index) => ({
				id: `${index}`,
				text: message.kwargs.content,
				sender: message.id.includes('HumanMessage') ? 'user' as const : 'bot' as const,
			}));

			if (loadedMessages.length > 0) {
				messages = loadedMessages;
			}

			// Set the session ID regardless of whether messages were loaded
			currentSessionId = sessionId;

			return sessionId;
		} catch (error) {
			console.error('Failed to load previous session:', error);
			// On error, still set the session ID so we can continue
			currentSessionId = sessionId;
			return sessionId;
		} finally {
			isLoadingSession = false;
		}
	}

	/**
	 * Start a new session
	 */
	async function startNewSession(): Promise<void> {
		const newSessionId = uuidv4();
		currentSessionId = newSessionId;
		localStorage.setItem(LOCAL_STORAGE_SESSION_ID_KEY, newSessionId);
	}

	/**
	 * Clear session and start fresh
	 */
	function clearSession(): void {
		// Clear messages
		messages = [];
		
		// Generate new session ID
		const newSessionId = uuidv4();
		currentSessionId = newSessionId;
		localStorage.setItem(LOCAL_STORAGE_SESSION_ID_KEY, newSessionId);
		
		// Close any active websocket
		closeWebSocket();
	}

	/**
	 * Send a message
	 */
	async function sendMessage(
		text: string,
		files: File[] = [],
	): Promise<SendMessageResponse | null> {
		const sentMessage = createUserMessage(text, files);
		messages = [...messages, sentMessage];
		waitingForResponse = true;

		if (!currentSessionId) {
			throw new Error('No active session');
		}

		try {
			if (options?.enableStreaming) {
				// Handle streaming
				let messageCreated = false;

				const handlers: api.StreamingEventHandlers = {
					onChunk: (chunk: string) => {
						console.log('[Streaming] Received chunk:', chunk);
						
						if (!messageCreated) {
							// Create the message only when we receive the first chunk
							const receivedMessage = createBotMessage(chunk);
							messages = [...messages, receivedMessage];
							messageCreated = true;
						} else {
							// Append to existing message
							const lastMsgIndex = messages.length - 1;
							const lastMsg = messages[lastMsgIndex];
							if (lastMsg && lastMsg.sender === 'bot' && 'text' in lastMsg) {
								// Create a new message object to trigger reactivity
								const updatedMsg = {
									...lastMsg,
									text: (lastMsg.text || '') + chunk,
								};
								messages = [...messages.slice(0, lastMsgIndex), updatedMsg];
							}
						}
					},
					onBeginMessage: () => {
						console.log('[Streaming] Message begin');
					},
					onEndMessage: () => {
						console.log('[Streaming] Message end');
					},
				};

				const { hasReceivedChunks } = await api.sendMessageStreaming(
					text,
					files,
					currentSessionId,
					options,
					handlers,
				);

				if (!hasReceivedChunks) {
					const lastMsg = messages[messages.length - 1];
					if (lastMsg && lastMsg.sender === 'bot' && 'text' in lastMsg) {
						lastMsg.text = '[No response received. This could happen if streaming is enabled in the trigger but disabled in agent node(s)]';
						messages = [...messages];
					}
				}
			} else {
				// Handle non-streaming
				const sendMessageResponse = await api.sendMessage(text, files, currentSessionId, options);

				if (sendMessageResponse?.executionStarted) {
					waitingForResponse = false;
					return sendMessageResponse;
				}

				const receivedMessage = createBotMessage();
				receivedMessage.text = processMessageResponse(sendMessageResponse);
				messages = [...messages, receivedMessage];
			}
		} catch (error) {
			const errorMessage = createBotMessage('Error: Failed to receive response');
			messages = [...messages, errorMessage];
			console.error('Chat API error:', error);
		} finally {
			waitingForResponse = false;
		}

		return null;
	}

	/**
	 * Close websocket connection
	 */
	function closeWebSocket() {
		if (ws) {
			ws.close();
			ws = null;
		}
	}

	/**
	 * Manually set loading session state
	 */
	function setLoadingSession(value: boolean) {
		isLoadingSession = value;
	}

	return {
		// Reactive state - expose as getters to maintain reactivity
		get messages() { return messages; },
		get currentSessionId() { return currentSessionId; },
		get waitingForResponse() { return waitingForResponse; },
		get initialMessages() { return initialMessages; },
		get ws() { return ws; },
		get i18n() { return i18n; },
		get isLoadingSession() { return isLoadingSession; },

		// Methods
		loadPreviousSession,
		startNewSession,
		clearSession,
		sendMessage,
		setLoadingSession,
		closeWebSocket,
	};
}

export type ChatStore = ReturnType<typeof createChatStore>;
