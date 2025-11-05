import type { ChatOptions } from '../types/index.js';

export interface I18nMessages {
	title?: string;
	subtitle?: string;
	footer?: string;
	getStarted?: string;
	inputPlaceholder?: string;
	clearConversation?: string;
}

/**
 * Get i18n message by key for the current language
 */
export function getI18nMessage(
	options: ChatOptions,
	key: keyof I18nMessages
): string | undefined {
	const lang = options.defaultLanguage || 'en';
	const i18n = options.i18n || {};
	
	return i18n[lang]?.[key];
}

/**
 * Get all i18n messages for the current language
 */
export function getI18nMessages(options: ChatOptions): I18nMessages {
	const lang = options.defaultLanguage || 'en';
	const i18n = options.i18n || {};
	
	return (i18n[lang] || {}) as I18nMessages;
}
