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

function createUserMessage(text: string, files: File[] = []): ChatMessage {
	return {
		id: uuidv4(),
		text,
		sender: 'user',
		files,
	};
}

function createBotMessage(text: string = ''): ChatMessageText {
	return {
		id: uuidv4(),
		text,
		sender: 'bot',
	};
}

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

export function createChatStore(providedOptions: ChatOptions) {
	const options: ChatOptions = { ...defaultOptions, ...providedOptions };

	let messages = $state<ChatMessage[]>([]);
	let currentSessionId = $state<string | null>(null);
	let waitingForResponse = $state(false);
	let ws = $state<WebSocket | null>(null);
	let isLoadingSession = $state(options.loadPreviousSession === true);

	const initialMessages = $derived(
		(options.initialMessages ?? []).map((text) => createBotMessage(text))
	);

	const i18n = $derived(getI18nMessages(options));

	function appendMessage(entry: ChatMessage) {
		messages = [...messages, entry];
	}

	function replaceMessage(index: number, entry: ChatMessage) {
		if (index < 0 || index >= messages.length) return;
		const nextMessages = [...messages];
		nextMessages[index] = entry;
		messages = nextMessages;
	}

	async function loadPreviousSession(): Promise<string | undefined> {
		if (!options.loadPreviousSession) {
			isLoadingSession = false;
			return;
		}

		isLoadingSession = true;

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

			currentSessionId = sessionId;

			return sessionId;
		} catch (error) {
			console.error('Failed to load previous session:', error);
			currentSessionId = sessionId;
			return sessionId;
		} finally {
			isLoadingSession = false;
		}
	}

	async function startNewSession(): Promise<void> {
		const newSessionId = uuidv4();
		currentSessionId = newSessionId;
		localStorage.setItem(LOCAL_STORAGE_SESSION_ID_KEY, newSessionId);
	}

	function clearSession(): void {
		messages = [];
		const newSessionId = uuidv4();
		currentSessionId = newSessionId;
		localStorage.setItem(LOCAL_STORAGE_SESSION_ID_KEY, newSessionId);
		closeWebSocket();
	}

	async function sendMessage(
		text: string,
		files: File[] = [],
	): Promise<SendMessageResponse | null> {
		const sentMessage = createUserMessage(text, files);
		appendMessage(sentMessage);
		waitingForResponse = true;

		if (!currentSessionId) {
			throw new Error('No active session');
		}

		try {
			if (options?.enableStreaming) {
				let messageCreated = false;
				let streamingMessageIndex: number | null = null;

				const handlers: api.StreamingEventHandlers = {
					onBeginMessage: () => {
						streamingMessageIndex = null;
					},
					onChunk: (chunk: string) => {
						if (!messageCreated) {
							const receivedMessage = createBotMessage(chunk);
							appendMessage(receivedMessage);
							streamingMessageIndex = messages.length - 1;
							messageCreated = true;
						} else {
							if (streamingMessageIndex === null) return;
							const lastMsg = messages[streamingMessageIndex];
							if (!lastMsg || lastMsg.sender !== 'bot' || !('text' in lastMsg)) {
								return;
							}
							const updatedMsg = {
								...lastMsg,
								text: (lastMsg.text || '') + chunk,
							};
							replaceMessage(streamingMessageIndex, updatedMsg);
						}
					},
					onEndMessage: () => {
						streamingMessageIndex = null;
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
					const lastIndex = messages.length - 1;
					const lastMsg = messages[lastIndex];
					if (lastMsg && lastMsg.sender === 'bot' && 'text' in lastMsg) {
						replaceMessage(lastIndex, {
							...lastMsg,
							text: '[No response received. This could happen if streaming is enabled in the trigger but disabled in agent node(s)]',
						});
					}
				}
			} else {
				const sendMessageResponse = await api.sendMessage(text, files, currentSessionId, options);

				if (sendMessageResponse?.executionStarted) {
					waitingForResponse = false;
					return sendMessageResponse;
				}

				const receivedMessage = createBotMessage();
				receivedMessage.text = processMessageResponse(sendMessageResponse);
				appendMessage(receivedMessage);
			}
		} catch (error) {
			const errorMessage = createBotMessage('Error: Failed to receive response');
			appendMessage(errorMessage);
			console.error('Chat API error:', error);
		} finally {
			waitingForResponse = false;
		}

		return null;
	}

	function closeWebSocket() {
		if (ws) {
			ws.close();
			ws = null;
		}
	}

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
