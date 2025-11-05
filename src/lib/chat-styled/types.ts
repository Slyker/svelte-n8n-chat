import type { Snippet } from 'svelte';
import type { ChatOptions } from '../chat-headless/types/index.js';

/**
 * Props for the AIChat component
 * 
 * For CSS customization, use Svelte's style props with the -- prefix:
 * @example
 * ```svelte
 * <AIChat 
 *   {options}
 *   --ai-primary="#10b981"
 *   --ai-font-size="16px"
 * />
 * ```
 */
export interface AIChatProps {
	/**
	 * Chat configuration options
	 */
	options: ChatOptions;

	/**
	 * Title displayed in the header
	 * @default 'AI Assistant'
	 */
	title?: string;

	/**
	 * Subtitle displayed in the header
	 * @default 'Powered by n8n'
	 */
	subtitle?: string;

	/**
	 * Theme of the chat
	 * @default 'light'
	 */
	theme?: 'light' | 'dark';

	/**
	 * Show the clear conversation button
	 * @default false
	 */
	showClearButton?: boolean;

	/**
	 * Placeholder text for the input field
	 * @default 'Type your message...'
	 */
	inputPlaceholder?: string;

	/**
	 * Text for the clear button
	 * @default 'Clear'
	 */
	clearButtonText?: string;

	// Custom snippets for avatars

	/**
	 * Custom snippet for bot avatar in messages
	 */
	botAvatar?: Snippet;

	/**
	 * Custom snippet for user avatar in messages
	 */
	userAvatar?: Snippet;

	/**
	 * Custom snippet for header avatar/logo
	 */
	headerAvatar?: Snippet;
}

/**
 * Available CSS custom properties for styling the AIChat component.
 * Use these with Svelte's style props (--variable-name="value").
 * 
 * @example
 * ```svelte
 * <AIChat 
 *   {options}
 *   --ai-primary="#10b981"
 *   --ai-font-size="16px"
 *   --ai-radius-md="20px"
 * />
 * ```
 */
export interface AIChatCSSVariables {
	// Colors
	'--ai-primary'?: string;
	'--ai-primary-dark'?: string;
	'--ai-secondary'?: string;
	'--ai-bg-primary'?: string;
	'--ai-bg-secondary'?: string;
	'--ai-bg-tertiary'?: string;
	'--ai-text-primary'?: string;
	'--ai-text-secondary'?: string;
	'--ai-text-tertiary'?: string;
	'--ai-border'?: string;
	'--ai-shadow'?: string;
	'--ai-shadow-lg'?: string;

	// Spacing & Layout
	'--ai-radius-sm'?: string;
	'--ai-radius-md'?: string;
	'--ai-radius-lg'?: string;
	'--ai-header-padding'?: string;
	'--ai-messages-padding'?: string;
	'--ai-footer-padding'?: string;
	'--ai-message-gap'?: string;
	'--ai-avatar-size'?: string;
	'--ai-avatar-radius'?: string;

	// Typography
	'--ai-font-family'?: string;
	'--ai-font-size'?: string;
	'--ai-font-size-sm'?: string;
	'--ai-font-size-lg'?: string;
	'--ai-line-height'?: string;
}
