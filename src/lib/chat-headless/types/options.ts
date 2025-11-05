export interface ChatOptions {
	webhookUrl: string;
	webhookConfig?: {
		method?: 'GET' | 'POST';
		headers?: Record<string, string>;
	};
	mode?: 'window' | 'fullscreen';
	showWindowCloseButton?: boolean;
	showWelcomeScreen?: boolean;
	loadPreviousSession?: boolean;
	chatInputKey?: string;
	chatSessionKey?: string;
	defaultLanguage?: 'en';
	initialMessages?: string[];
	metadata?: Record<string, unknown>;
	i18n?: Record<string, Record<string, string>>;
	disabled?: boolean;
	allowFileUploads?: boolean;
	allowedFilesMimeTypes?: string;
	enableStreaming?: boolean;
}
