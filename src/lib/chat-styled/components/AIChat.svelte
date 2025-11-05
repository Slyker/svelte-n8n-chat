<script lang="ts">
	import { HeadlessChat, HeadlessLayout, HeadlessMessagesList, HeadlessInput, MarkdownMessage } from '../../chat-headless/index.js';
	import type { ChatOptions, ChatMessage, ChatStore } from '../../chat-headless/index.js';
	import type { Snippet } from 'svelte';

	interface Props {
		options: ChatOptions;
		title?: string;
		subtitle?: string;
		theme?: 'light' | 'dark';
		showClearButton?: boolean;
		inputPlaceholder?: string;
		clearButtonText?: string;
		// Custom snippets for avatars
		botAvatar?: Snippet;
		userAvatar?: Snippet;
		headerAvatar?: Snippet;
	}

	let { 
		options, 
		title,
		subtitle,
		theme = 'light',
		showClearButton = false,
		inputPlaceholder,
		clearButtonText,
		botAvatar,
		userAvatar,
		headerAvatar,
	}: Props = $props();

	// Get i18n messages from options
	const lang = options.defaultLanguage || 'en';
	const i18nMessages = options.i18n?.[lang] || {};
	
	// Compute final text values with i18n fallback
	const headerTitle = title ?? i18nMessages.title ?? 'AI Assistant';
	const headerSubtitle = subtitle ?? i18nMessages.subtitle ?? 'Powered by n8n';
	const placeholder = inputPlaceholder ?? i18nMessages.inputPlaceholder ?? 'Type your message...';
	const clearText = clearButtonText ?? i18nMessages.clearConversation ?? 'Clear';
</script>

<div class="ai-chat-container" data-theme={theme}>
	<HeadlessChat {options}>
		{#snippet children(store)}
			<HeadlessLayout>
				{#snippet renderHeader()}
					<header class="ai-chat-header">
						<div class="header-content">
							<div class="header-left">
								{#if headerAvatar}
									{@render headerAvatar()}
								{:else}
									<div class="ai-avatar">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</div>
								{/if}
								<div class="header-text">
									<h1>{headerTitle}</h1>
									<p>{headerSubtitle}</p>
								</div>
							</div>
							{#if showClearButton}
								<button 
									class="clear-button"
									onclick={() => store.clearSession()}
									aria-label="Clear conversation"
									title="Clear conversation"
								>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
									<span>{clearText}</span>
								</button>
							{/if}
						</div>
					</header>
				{/snippet}

				{#snippet renderBody()}
					<div class="ai-chat-messages">
						{#if store.isLoadingSession}
							<div class="loading-session">
								<div class="loading-spinner">
									<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.25"/>
										<path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
									</svg>
								</div>
								<p>Loading session...</p>
							</div>
						{:else}
							<HeadlessMessagesList>
							{#snippet renderMessage(message)}
								<div class="message-wrapper {message.sender}">
									{#if message.sender === 'bot'}
										{#if botAvatar}
											{@render botAvatar()}
										{:else}
											<div class="message-avatar bot-avatar">
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
													<path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
													<circle cx="9" cy="9" r="1" fill="currentColor"/>
													<circle cx="15" cy="9" r="1" fill="currentColor"/>
												</svg>
											</div>
										{/if}
									{/if}
									
									<div class="message-content">
										<div class="message-bubble {message.sender}">
											<MarkdownMessage content={message.text ?? ''} />
											{#if message.files && message.files.length > 0}
												<div class="message-files">
													{#each message.files as file}
														<div class="file-badge">
															<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
																<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" stroke-width="2"/>
																<polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2"/>
															</svg>
															<span>{file.name}</span>
														</div>
													{/each}
												</div>
											{/if}
										</div>
									</div>

									{#if message.sender === 'user'}
										{#if userAvatar}
											{@render userAvatar()}
										{:else}
											<div class="message-avatar user-avatar">
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
													<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>
											</div>
										{/if}
									{/if}
								</div>
							{/snippet}

							{#snippet renderTyping()}
								<div class="message-wrapper bot">
									{#if botAvatar}
										{@render botAvatar()}
									{:else}
										<div class="message-avatar bot-avatar">
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
												<path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
												<circle cx="9" cy="9" r="1" fill="currentColor"/>
												<circle cx="15" cy="9" r="1" fill="currentColor"/>
											</svg>
										</div>
									{/if}
									<div class="message-content">
										<div class="message-bubble bot typing-indicator">
											<div class="typing-dots">
												<span></span>
												<span></span>
												<span></span>
											</div>
										</div>
									</div>
								</div>
							{/snippet}

							{#snippet renderEmpty()}
								<div class="empty-state">
									<div class="empty-icon">
										<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</div>
									<h3>Start a conversation</h3>
									<p>Send a message to begin chatting with the AI assistant</p>
								</div>
							{/snippet}
						</HeadlessMessagesList>
						{/if}
					</div>
				{/snippet}

				{#snippet renderFooter()}
					<div class="ai-chat-footer">
						<HeadlessInput placeholder={placeholder}>
							{#snippet renderInput({ value, disabled, onInput, onKeyDown })}
								<div class="input-container">
									<textarea
										{value}
										{disabled}
										oninput={onInput}
										onkeydown={onKeyDown}
										placeholder={placeholder}
										class="message-input"
										rows="1"
									></textarea>
								</div>
							{/snippet}

							{#snippet renderSubmitButton({ disabled, onClick })}
								<button {disabled} onclick={onClick} class="send-button" aria-label="Send message">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor"/>
									</svg>
								</button>
							{/snippet}
						</HeadlessInput>
					</div>
				{/snippet}
			</HeadlessLayout>
		{/snippet}
	</HeadlessChat>
</div>

<style>
	.ai-chat-container {
		/* Default color variables */
		--ai-primary: #667eea;
		--ai-primary-dark: #5568d3;
		--ai-secondary: #764ba2;
		--ai-bg-primary: #ffffff;
		--ai-bg-secondary: #f8f9fa;
		--ai-bg-tertiary: #f3f4f6;
		--ai-text-primary: #1f2937;
		--ai-text-secondary: #6b7280;
		--ai-text-tertiary: #9ca3af;
		--ai-border: #e5e7eb;
		--ai-shadow: rgba(0, 0, 0, 0.1);
		--ai-shadow-lg: rgba(0, 0, 0, 0.15);
		
		/* Default spacing & layout variables */
		--ai-radius-sm: 6px;
		--ai-radius-md: 12px;
		--ai-radius-lg: 16px;
		--ai-header-padding: 20px 24px;
		--ai-messages-padding: 24px;
		--ai-footer-padding: 16px 24px;
		--ai-message-gap: 20px;
		--ai-avatar-size: 32px;
		--ai-avatar-radius: 8px;
		
		/* Default typography variables */
		--ai-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
		--ai-font-size: 15px;
		--ai-font-size-sm: 13px;
		--ai-font-size-lg: 18px;
		--ai-line-height: 1.5;
		
		font-family: var(--ai-font-family);
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--ai-bg-primary);
		border-radius: var(--ai-radius-md);
		overflow: hidden;
		box-shadow: 0 4px 6px -1px var(--ai-shadow-lg), 0 2px 4px -1px var(--ai-shadow);
	}

	.ai-chat-container[data-theme="dark"] {
		--ai-bg-primary: #1f2937;
		--ai-bg-secondary: #111827;
		--ai-bg-tertiary: #374151;
		--ai-text-primary: #f9fafb;
		--ai-text-secondary: #d1d5db;
		--ai-text-tertiary: #9ca3af;
		--ai-border: #374151;
		--ai-shadow: rgba(0, 0, 0, 0.3);
		--ai-shadow-lg: rgba(0, 0, 0, 0.5);
	}

	/* Scrollbar styles for the chat body */
	.ai-chat-container :global(.chat-body) {
		background: var(--ai-bg-secondary);
	}

	.ai-chat-container :global(.chat-body)::-webkit-scrollbar {
		width: 6px;
	}

	.ai-chat-container :global(.chat-body)::-webkit-scrollbar-track {
		background: transparent;
	}

	.ai-chat-container :global(.chat-body)::-webkit-scrollbar-thumb {
		background: var(--ai-border);
		border-radius: 3px;
	}

	.ai-chat-container :global(.chat-body)::-webkit-scrollbar-thumb:hover {
		background: var(--ai-text-tertiary);
	}

	/* Header */
	.ai-chat-header {
		background: linear-gradient(135deg, var(--ai-primary) 0%, var(--ai-secondary) 100%);
		padding: var(--ai-header-padding);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.ai-avatar {
		width: 40px;
		height: 40px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		backdrop-filter: blur(10px);
	}

	.header-text h1 {
		margin: 0;
		font-size: var(--ai-font-size-lg);
		font-weight: 600;
		color: white;
	}

	.header-text p {
		margin: 4px 0 0;
		font-size: var(--ai-font-size-sm);
		color: rgba(255, 255, 255, 0.8);
	}

	.clear-button {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		background: rgba(255, 255, 255, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.25);
		color: white;
		border-radius: 8px;
		font-size: var(--ai-font-size-sm);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		backdrop-filter: blur(10px);
	}

	.clear-button:hover {
		background: rgba(255, 255, 255, 0.25);
		border-color: rgba(255, 255, 255, 0.4);
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.clear-button:active {
		transform: translateY(0);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
	}

	.clear-button svg {
		flex-shrink: 0;
	}

	/* Messages */
	.ai-chat-messages {
		padding: var(--ai-messages-padding);
	}

	/* Loading Session State */
	.loading-session {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		color: var(--ai-text-secondary);
	}

	.loading-spinner {
		margin-bottom: 16px;
		animation: spin 1s linear infinite;
		color: var(--ai-primary);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.loading-session p {
		margin: 0;
		font-size: var(--ai-font-size-sm);
		font-weight: 500;
	}

	.messages-end-marker {
		height: 1px;
		visibility: hidden;
	}

	.message-wrapper {
		display: flex;
		gap: 12px;
		margin-bottom: var(--ai-message-gap);
		align-items: flex-start;
	}

	.message-wrapper.user {
		flex-direction: row-reverse;
	}

	.message-avatar {
		width: var(--ai-avatar-size);
		height: var(--ai-avatar-size);
		border-radius: var(--ai-avatar-radius);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.bot-avatar {
		background: linear-gradient(135deg, var(--ai-primary) 0%, var(--ai-secondary) 100%);
		color: white;
	}

	.user-avatar {
		background: var(--ai-bg-tertiary);
		color: var(--ai-text-secondary);
	}

	.message-content {
		max-width: 75%;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.message-bubble {
		padding: 12px 16px;
		border-radius: var(--ai-radius-md);
		font-size: var(--ai-font-size);
		line-height: var(--ai-line-height);
	}

	.message-bubble.bot {
		background: var(--ai-bg-primary);
		color: var(--ai-text-primary);
		border-bottom-left-radius: 4px;
		box-shadow: 0 1px 2px var(--ai-shadow);
	}

	.message-bubble.user {
		background: linear-gradient(135deg, var(--ai-primary) 0%, var(--ai-secondary) 100%);
		color: white;
		border-bottom-right-radius: 4px;
	}

	.message-bubble p {
		margin: 0;
		word-wrap: break-word;
		white-space: pre-wrap;
	}

	.message-files {
		margin-top: 8px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.file-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 10px;
		background: rgba(0, 0, 0, 0.1);
		border-radius: var(--ai-radius-sm);
		font-size: var(--ai-font-size-sm);
		max-width: fit-content;
	}

	/* Typing indicator */
	.typing-indicator {
		background: var(--ai-bg-primary);
	}

	.typing-dots {
		display: flex;
		gap: 4px;
		padding: 4px 0;
	}

	.typing-dots span {
		width: 8px;
		height: 8px;
		background: var(--ai-text-tertiary);
		border-radius: 50%;
		animation: typing 1.4s infinite ease-in-out;
	}

	.typing-dots span:nth-child(1) {
		animation-delay: -0.32s;
	}

	.typing-dots span:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes typing {
		0%, 60%, 100% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-10px);
		}
	}

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		text-align: center;
		color: var(--ai-text-secondary);
	}

	.empty-icon {
		width: 64px;
		height: 64px;
		background: var(--ai-bg-tertiary);
		border-radius: var(--ai-radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16px;
		color: var(--ai-text-tertiary);
	}

	.empty-state h3 {
		margin: 0 0 8px;
		font-size: var(--ai-font-size-lg);
		font-weight: 600;
		color: var(--ai-text-primary);
	}

	.empty-state p {
		margin: 0;
		font-size: var(--ai-font-size-sm);
		max-width: 300px;
	}

	/* Footer */
	.ai-chat-footer {
		padding: var(--ai-footer-padding);
		background: var(--ai-bg-primary);
		border-top: 1px solid var(--ai-border);
		display: flex;
		align-items: flex-end;
		gap: 8px;
	}

	.input-container {
		flex: 1;
		display: flex;
	}

	.message-input {
		width: 100%;
		padding: 12px 16px;
		border: 1px solid var(--ai-border);
		border-radius: 10px;
		font-size: var(--ai-font-size);
		font-family: inherit;
		color: var(--ai-text-primary);
		background: var(--ai-bg-secondary);
		resize: none;
		outline: none;
		transition: all 0.2s;
		max-height: 120px;
	}

	.message-input:focus {
		border-color: var(--ai-primary);
		background: var(--ai-bg-primary);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.message-input::placeholder {
		color: var(--ai-text-tertiary);
	}

	.send-button {
		width: 44px;
		height: 44px;
		background: linear-gradient(135deg, var(--ai-primary) 0%, var(--ai-secondary) 100%);
		border: none;
		border-radius: 10px;
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.send-button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}

	.send-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.send-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
