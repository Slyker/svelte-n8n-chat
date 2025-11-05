<script lang="ts">
	import { AIChat, HeadlessChat, HeadlessMessagesList, HeadlessInput, HeadlessLayout } from '$lib';
	import type { ChatOptions } from '$lib';

	// Webhook URL input
	let webhookUrl = $state('https://your-n8n-instance.com/webhook/chat');
	let enableStreaming = $state(true);
	let currentLanguage = $state<'en' | 'fr'>('en');

	// Example configuration - replace with your actual n8n webhook URL
	const chatOptions = $derived<ChatOptions>({
		webhookUrl,
		initialMessages: ['Hello! 👋', 'How can I help you today?'],
		enableStreaming,
		loadPreviousSession: true,
		showWelcomeScreen: false,
		defaultLanguage: currentLanguage,
		i18n: {
			en: {
				title: 'AI Assistant',
				subtitle: 'Powered by n8n',
				inputPlaceholder: 'Type your message...',
				clearConversation: 'Clear Chat',
			},
			fr: {
				title: 'Assistant IA',
				subtitle: 'Propulsé par n8n',
				inputPlaceholder: 'Tapez votre message...',
				clearConversation: 'Effacer',
			},
		},
	});

	let selectedDemo = $state<'styled' | 'headless-basic' | 'headless-custom'>('styled');

	// Code examples as constants to avoid template literal parsing issues
	const styledExample = `<script>
  import { AIChat } from '$lib';
  const options = {
    webhookUrl: 'YOUR_WEBHOOK_URL',
    initialMessages: ['Hello! 👋']
  };
<\/script>

<AIChat {options} title="AI Assistant" />`;

	const headlessBasicExample = `<script>
  import { HeadlessChat, HeadlessMessagesList, HeadlessInput } from '$lib';
<\/script>

<HeadlessChat {options}>
  {#snippet children(chatStore)}
    <HeadlessMessagesList>
      {#snippet renderMessage(message)}
        <div class="message {message.sender}">
          {message.text}
        </div>
      {/snippet}
    </HeadlessMessagesList>
    <HeadlessInput />
  {/snippet}
</HeadlessChat>`;

	const headlessCustomExample = `<script>
  import { HeadlessChat, HeadlessLayout, HeadlessMessagesList, HeadlessInput } from '$lib';
<\/script>

<HeadlessChat {options}>
  {#snippet children(chatStore)}
    <HeadlessLayout>
      {#snippet renderHeader()}
        <div class="custom-header">
          <h3>Custom Chat</h3>
        </div>
      {/snippet}
      {#snippet renderBody()}
        <HeadlessMessagesList>
          {#snippet renderMessage(message)}
            <div class="message">{message.text}</div>
          {/snippet}
        </HeadlessMessagesList>
      {/snippet}
      {#snippet renderFooter()}
        <HeadlessInput />
      {/snippet}
    </HeadlessLayout>
  {/snippet}
</HeadlessChat>`;
</script>

<div class="container">
	<header class="page-header">
		<h1>Chat Components Demo</h1>
		<p>Standalone AI chat components extracted from n8n</p>
		
		<div class="webhook-input">
			<label for="webhook-url">n8n Webhook URL:</label>
			<input 
				id="webhook-url"
				type="text" 
				bind:value={webhookUrl}
				placeholder="https://your-n8n-instance.com/webhook/chat"
			/>
			
			<div class="streaming-toggle">
				<label>
					<input 
						type="checkbox" 
						bind:checked={enableStreaming}
					/>
					<span>Enable Streaming Responses</span>
				</label>
			</div>

			<div class="language-selector">
				<label>
					Language / Langue:
					<select bind:value={currentLanguage}>
						<option value="en">🇬🇧 English</option>
						<option value="fr">🇫🇷 Français</option>
					</select>
				</label>
			</div>
		</div>
	</header>

	<div class="demo-selector">
		<button 
			class:active={selectedDemo === 'styled'} 
			onclick={() => selectedDemo = 'styled'}
		>
			Styled Chat
		</button>
		<button 
			class:active={selectedDemo === 'headless-basic'} 
			onclick={() => selectedDemo = 'headless-basic'}
		>
			Headless (Basic)
		</button>
		<button 
			class:active={selectedDemo === 'headless-custom'} 
			onclick={() => selectedDemo = 'headless-custom'}
		>
			Headless (Custom)
		</button>
	</div>

	<div class="demo-content">
		{#if selectedDemo === 'styled'}
			<div class="demo-card">
				<h2>AIChat - Professional Styled Component</h2>
				<p>Ready-to-use AI chat with modern design. Just provide a webhook URL!</p>
				<div class="chat-wrapper">
					{#key `${webhookUrl}-${enableStreaming}-${currentLanguage}`}
						<AIChat 
							options={chatOptions} 
							theme="light"
							showClearButton={true}
						/>
					{/key}
				</div>
				<div class="code-snippet">
					<pre><code>{styledExample}</code></pre>
				</div>
			</div>

		{:else if selectedDemo === 'headless-basic'}
			<div class="demo-card">
				<h2>Headless Chat - Basic Example</h2>
				<p>Minimal styling - complete control over the UI</p>
				<div class="chat-wrapper basic-chat">
					{#key `${webhookUrl}-${enableStreaming}`}
						<HeadlessChat options={chatOptions}>
							{#snippet children(chatStore: any)}
								<div class="basic-chat-container">
									<HeadlessMessagesList>
										{#snippet renderMessage(message: any)}
											<div class="basic-message {message.sender}">
												<strong>{message.sender === 'user' ? 'You' : 'Bot'}:</strong>
												<p>{message.text}</p>
											</div>
										{/snippet}
										
										{#snippet renderTyping()}
											<div class="basic-typing">Bot is typing...</div>
										{/snippet}

										{#snippet renderEmpty()}
											<div class="basic-empty">No messages yet. Start chatting!</div>
										{/snippet}
									</HeadlessMessagesList>

									<HeadlessInput placeholder="Type your message..." />
								</div>
							{/snippet}
						</HeadlessChat>
					{/key}
				</div>
				<div class="code-snippet">
					<pre><code>{headlessBasicExample}</code></pre>
				</div>
			</div>

		{:else if selectedDemo === 'headless-custom'}
			<div class="demo-card">
				<h2>Headless Chat - Custom Styled</h2>
				<p>Full layout control with custom styling</p>
				<div class="chat-wrapper custom-chat">
					{#key `${webhookUrl}-${enableStreaming}`}
						<HeadlessChat options={chatOptions}>
							{#snippet children(chatStore: any)}
								<HeadlessLayout>
								{#snippet renderHeader()}
									<div class="custom-header">
										<div class="header-content">
											<div>
												<h3>🤖 Custom Chat</h3>
												<p>Session: {chatStore.currentSessionId?.slice(0, 8) ?? 'None'}</p>
											</div>
											<button 
												class="clear-session-btn"
												onclick={() => chatStore.clearSession()}
												aria-label="Clear session"
											>
												🗑️ Clear Session
											</button>
										</div>
									</div>
								{/snippet}

								{#snippet renderBody()}
									<div class="custom-messages">
										<HeadlessMessagesList>
											{#snippet renderMessage(message: any)}
												<div class="custom-message-wrapper {message.sender}">
													<div class="custom-message">
														{message.text}
													</div>
												</div>
											{/snippet}

											{#snippet renderTyping()}
												<div class="custom-typing">
													<span>●</span><span>●</span><span>●</span>
												</div>
											{/snippet}
										</HeadlessMessagesList>
									</div>
								{/snippet}

								{#snippet renderFooter()}
									<div class="custom-footer">
										<HeadlessInput placeholder="Type something...">
											{#snippet renderInput({ value, disabled, onInput, onKeyDown }: any)}
												<input
													type="text"
													{value}
													{disabled}
													oninput={onInput}
													onkeydown={onKeyDown}
													placeholder="Type something..."
													class="custom-input"
												/>
											{/snippet}

											{#snippet renderSubmitButton({ disabled, onClick }: any)}
												<button {disabled} onclick={onClick} class="custom-send">
													Send →
												</button>
											{/snippet}
										</HeadlessInput>
									</div>
								{/snippet}
							</HeadlessLayout>
						{/snippet}
					</HeadlessChat>
					{/key}
				</div>
				<div class="code-snippet">
					<pre><code>{headlessCustomExample}</code></pre>
				</div>
			</div>
		{/if}
	</div>

	<footer class="page-footer">
		<p>📚 See <code>src/lib/CHAT_README.md</code> for full documentation</p>
		<p>⚠️ Note: These examples require a valid n8n webhook URL to work properly</p>
	</footer>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-header h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.page-header p {
		color: #6b7280;
		font-size: 1.1rem;
	}

	.webhook-input {
		max-width: 600px;
		margin: 1.5rem auto 0;
		text-align: left;
	}

	.webhook-input label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #374151;
	}

	.webhook-input input[type="text"] {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 0.95rem;
		transition: border-color 0.2s;
	}

	.webhook-input input[type="text"]:focus {
		outline: none;
		border-color: #667eea;
	}

	.streaming-toggle {
		margin-top: 1rem;
	}

	.streaming-toggle label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-weight: 400;
		font-size: 0.95rem;
	}

	.streaming-toggle input[type="checkbox"] {
		width: auto;
		cursor: pointer;
	}

	.language-selector {
		margin-top: 1rem;
	}

	.language-selector label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 500;
		font-size: 0.95rem;
		color: #374151;
	}

	.language-selector select {
		padding: 0.5rem 0.75rem;
		border: 2px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.95rem;
		cursor: pointer;
		background: white;
		transition: border-color 0.2s;
	}

	.language-selector select:focus {
		outline: none;
		border-color: #667eea;
	}

	.demo-selector {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.demo-selector button {
		padding: 0.75rem 1.5rem;
		border: 2px solid #e5e7eb;
		background: white;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s;
	}

	.demo-selector button:hover {
		border-color: #667eea;
	}

	.demo-selector button.active {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-color: transparent;
	}

	.demo-card {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.demo-card h2 {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.demo-card > p {
		color: #6b7280;
		margin-bottom: 1.5rem;
	}

	.chat-wrapper {
		height: 500px;
		margin-bottom: 1.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		overflow: hidden;
	}

	.code-snippet {
		background: #1f2937;
		border-radius: 8px;
		padding: 1rem;
		overflow-x: auto;
	}

	.code-snippet pre {
		margin: 0;
		color: #f9fafb;
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.code-snippet code {
		color: #f9fafb;
	}

	/* Basic Chat Styles */
	.basic-chat-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 1rem;
		background: #f9fafb;
	}

	.basic-message {
		padding: 0.75rem;
		margin-bottom: 0.5rem;
		border-radius: 6px;
	}

	.basic-message.user {
		background: #dbeafe;
		margin-left: auto;
		max-width: 70%;
	}

	.basic-message.bot {
		background: #f3f4f6;
		max-width: 70%;
	}

	.basic-message p {
		margin: 0.25rem 0 0;
	}

	.basic-typing {
		padding: 0.75rem;
		color: #6b7280;
		font-style: italic;
	}

	.basic-empty {
		padding: 2rem;
		text-align: center;
		color: #9ca3af;
	}

	/* Custom Chat Styles */
	.custom-header {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		padding: 1.5rem;
	}

	.custom-header .header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.custom-header h3 {
		margin: 0 0 0.25rem;
	}

	.custom-header p {
		margin: 0;
		font-size: 0.875rem;
		opacity: 0.9;
	}

	.clear-session-btn {
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.4);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.clear-session-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		border-color: rgba(255, 255, 255, 0.6);
	}

	.clear-session-btn:active {
		transform: scale(0.98);
	}

	.custom-messages {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		background: #f0fdf4;
	}

	.custom-message-wrapper {
		display: flex;
		margin-bottom: 0.75rem;
	}

	.custom-message-wrapper.user {
		justify-content: flex-end;
	}

	.custom-message {
		max-width: 70%;
		padding: 0.75rem 1rem;
		border-radius: 12px;
	}

	.custom-message-wrapper.user .custom-message {
		background: #10b981;
		color: white;
		border-bottom-right-radius: 4px;
	}

	.custom-message-wrapper.bot .custom-message {
		background: white;
		border-bottom-left-radius: 4px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.custom-typing {
		display: flex;
		gap: 0.25rem;
		padding: 0.75rem 1rem;
		background: white;
		border-radius: 12px;
		max-width: fit-content;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.custom-typing span {
		animation: bounce 1.4s infinite ease-in-out;
	}

	.custom-typing span:nth-child(1) { animation-delay: -0.32s; }
	.custom-typing span:nth-child(2) { animation-delay: -0.16s; }

	@keyframes bounce {
		0%, 60%, 100% { transform: translateY(0); }
		30% { transform: translateY(-5px); }
	}

	.custom-footer {
		padding: 1rem;
		background: white;
		border-top: 1px solid #d1fae5;
		display: flex;
		gap: 0.5rem;
	}

	.custom-input {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid #d1fae5;
		border-radius: 8px;
		outline: none;
		font-size: 1rem;
	}

	.custom-input:focus {
		border-color: #10b981;
	}

	.custom-send {
		padding: 0.75rem 1.5rem;
		background: #10b981;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s;
	}

	.custom-send:hover:not(:disabled) {
		background: #059669;
	}

	.custom-send:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.page-footer {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid #e5e7eb;
		text-align: center;
		color: #6b7280;
	}

	.page-footer code {
		background: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
	}
</style>

