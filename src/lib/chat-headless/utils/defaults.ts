import type { ChatOptions } from '../types/index.js';

export const defaultOptions: ChatOptions = {
	webhookUrl: '',
	webhookConfig: {
		method: 'POST',
		headers: {},
	},
	mode: 'window',
	chatInputKey: 'chatInput',
	chatSessionKey: 'sessionId',
	loadPreviousSession: true,
	metadata: {},
	showWelcomeScreen: false,
	defaultLanguage: 'en',
	initialMessages: [],
	i18n: {
		en: {
			title: 'Hi there! 👋',
			subtitle: "Start a chat. We're here to help you 24/7.",
			footer: '',
			getStarted: 'New Conversation',
			inputPlaceholder: 'Type your question..',
			clearConversation: 'Clear',
		},
	},
	enableStreaming: false,
	allowFileUploads: false,
	allowedFilesMimeTypes: '',
	disabled: false,
};
