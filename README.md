# n8n Chat Components for Svelte 5

A powerful, production-ready AI chat component library for Svelte 5, featuring both styled and headless implementations. Originally extracted from n8n, these components are now completely standalone with zero dependencies on n8n infrastructure.

## ✨ Features

### 🎨 Two Implementations
- **AIChat** - Professional styled chat with beautiful UI out of the box
- **Headless Components** - Unstyled, fully customizable building blocks

### 🚀 Core Capabilities
- ✅ **Real-time Streaming** - WebSocket-based streaming responses
- ✅ **Session Persistence** - Automatic localStorage-based session management
- ✅ **File Upload** - Built-in file attachment support
- ✅ **Internationalization** - Multi-language support with easy customization
- ✅ **TypeScript First** - Full type safety and IntelliSense
- ✅ **Svelte 5 Runes** - Modern reactive state with `$state` and `$derived`
- ✅ **Zero Dependencies** - Standalone, works anywhere
- ✅ **Accessibility** - ARIA labels, keyboard navigation, semantic HTML

## 📦 Installation

```bash
npm install svelte-n8n-chat
# or
pnpm add svelte-n8n-chat
# or
yarn add svelte-n8n-chat
```

## 🎯 Quick Start

### Option 1: Styled Chat (Fastest)

Get a working chat interface in under 1 minute:

```svelte
<script>
  import { AIChat } from 'svelte-n8n-chat';
  
  const options = {
    webhookUrl: 'https://your-n8n.com/webhook/chat',
    initialMessages: ['Hello! 👋', 'How can I help you today?'],
    enableStreaming: true,
  };
</script>

<div style="height: 600px;">
  <AIChat 
    {options} 
    title="AI Assistant" 
    subtitle="Powered by n8n"
    theme="light"
  />
</div>
```

### Option 2: Headless (Maximum Control)

Build your own UI with complete styling freedom:

```svelte
<script>
  import { 
    HeadlessChat, 
    HeadlessMessagesList, 
    HeadlessInput 
  } from 'svelte-n8n-chat';
  
  const options = {
    webhookUrl: 'https://your-n8n.com/webhook/chat',
    enableStreaming: true,
  };
</script>

<HeadlessChat {options}>
  {#snippet children(chatStore)}
    <div class="my-chat">
      <HeadlessMessagesList>
        {#snippet renderMessage(message)}
          <div class="message {message.sender}">
            <strong>{message.sender}:</strong>
            <p>{message.text}</p>
          </div>
        {/snippet}
      </HeadlessMessagesList>
      
      <HeadlessInput placeholder="Type your message..." />
    </div>
  {/snippet}
</HeadlessChat>

<style>
  .my-chat {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
  }
  
  .message {
    padding: 0.5rem;
    margin: 0.25rem 0;
    border-radius: 8px;
  }
  
  .message.user {
    background: #e3f2fd;
    align-self: flex-end;
  }
  
  .message.bot {
    background: #f5f5f5;
    align-self: flex-start;
  }
</style>
```

## 📚 Complete Documentation

### AIChat Component

The styled chat component with a professional UI ready to use.

#### Props

```typescript
interface AIChatProps {
  options: ChatOptions;           // Required: Chat configuration
  title?: string;                 // Header title
  subtitle?: string;              // Header subtitle
  theme?: 'light' | 'dark';       // Color theme (default: 'light')
  showClearButton?: boolean;      // Show clear session button (default: false)
  inputPlaceholder?: string;      // Input field placeholder
  clearButtonText?: string;       // Clear button label
}
```

#### ChatOptions

```typescript
interface ChatOptions {
  // Required
  webhookUrl: string;                    // Your n8n webhook URL
  
  // Optional - Session & Display
  initialMessages?: string[];            // Welcome messages
  showWelcomeScreen?: boolean;          // Show welcome screen (default: false)
  loadPreviousSession?: boolean;        // Load previous chat (default: false)
  
  // Optional - Streaming
  enableStreaming?: boolean;            // Enable real-time streaming (default: false)
  
  // Optional - Internationalization
  defaultLanguage?: string;             // Language code (default: 'en')
  i18n?: Record<string, I18nMessages>;  // Translations object
  
  // Optional - Advanced
  webhookConfig?: {
    method?: 'GET' | 'POST';           // HTTP method (default: 'POST')
    headers?: Record<string, string>;  // Custom headers
  };
}
```

#### Examples

**Basic Usage:**
```svelte
<script>
  import { AIChat } from 'svelte-n8n-chat';
  
  const options = {
    webhookUrl: 'https://your-n8n.com/webhook/abc123/chat'
  };
</script>

<AIChat {options} />
```

**With All Options:**
```svelte
<script>
  import { AIChat } from 'svelte-n8n-chat';
  
  const options = {
    webhookUrl: 'https://your-n8n.com/webhook/abc123/chat',
    initialMessages: ['👋 Welcome!', 'How can I assist you today?'],
    enableStreaming: true,
    loadPreviousSession: true,
    defaultLanguage: 'en',
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
      }
    }
  };
</script>

<AIChat 
  {options} 
  title="Customer Support"
  subtitle="We're here to help"
  theme="dark"
  showClearButton={true}
/>
```

**Custom Styling with CSS Variables:**
```svelte
<AIChat {options} />

<style>
  :global(.ai-chat-container) {
    --ai-primary: #0066cc;
    --ai-primary-dark: #0052a3;
    --ai-bg-primary: #ffffff;
    --ai-text-primary: #1a1a1a;
    --ai-border: #e0e0e0;
  }
</style>
```

### Headless Components

Full control over styling and behavior using Svelte 5 snippets.

#### HeadlessChat

The main wrapper that manages state and provides the chat store to children.

```typescript
interface HeadlessChatProps {
  options: ChatOptions;
  children: Snippet<[ChatStore]>;  // Snippet receives chatStore
}
```

**ChatStore API:**
```typescript
interface ChatStore {
  // State (reactive)
  messages: ChatMessage[];           // All messages
  currentSessionId: string | null;   // Active session ID
  waitingForResponse: boolean;       // Loading state
  isLoadingSession: boolean;         // Session loading state
  initialMessages: ChatMessage[];    // Welcome messages
  i18n: I18nMessages;               // Current translations
  
  // Methods
  sendMessage(text: string, files?: File[]): Promise<void>;
  clearSession(): void;
  loadPreviousSession(): Promise<void>;
  startNewSession(): Promise<void>;
}
```

**Example:**
```svelte
<HeadlessChat {options}>
  {#snippet children(chatStore)}
    <div>
      <p>Session: {chatStore.currentSessionId}</p>
      <p>Messages: {chatStore.messages.length}</p>
      <button onclick={() => chatStore.clearSession()}>
        Clear
      </button>
    </div>
  {/snippet}
</HeadlessChat>
```

#### HeadlessMessagesList

Renders the list of messages with full customization.

```typescript
interface HeadlessMessagesListProps {
  renderMessage?: Snippet<[ChatMessage]>;  // Custom message renderer
  renderTyping?: Snippet;                  // Custom typing indicator
  renderEmpty?: Snippet;                   // Custom empty state
}
```

**Example - Basic:**
```svelte
<HeadlessMessagesList>
  {#snippet renderMessage(message)}
    <div class={message.sender}>
      {message.text}
    </div>
  {/snippet}
</HeadlessMessagesList>
```

**Example - Advanced:**
```svelte
<HeadlessMessagesList>
  {#snippet renderMessage(message)}
    <div class="message-wrapper">
      {#if message.sender === 'bot'}
        <img src="/bot-avatar.png" alt="Bot" />
      {/if}
      
      <div class="message-bubble {message.sender}">
        <p>{message.text}</p>
        
        {#if message.files && message.files.length > 0}
          <div class="attachments">
            {#each message.files as file}
              <span class="file">{file.name}</span>
            {/each}
          </div>
        {/if}
        
        <span class="timestamp">
          {new Date().toLocaleTimeString()}
        </span>
      </div>
      
      {#if message.sender === 'user'}
        <img src="/user-avatar.png" alt="User" />
      {/if}
    </div>
  {/snippet}
  
  {#snippet renderTyping()}
    <div class="typing-indicator">
      <span></span><span></span><span></span>
    </div>
  {/snippet}
  
  {#snippet renderEmpty()}
    <div class="empty-state">
      <h3>No messages yet</h3>
      <p>Start a conversation!</p>
    </div>
  {/snippet}
</HeadlessMessagesList>
```

#### HeadlessInput

Customizable input field for sending messages.

```typescript
interface HeadlessInputProps {
  placeholder?: string;
  renderInput?: Snippet<[InputRenderProps]>;
  renderSubmitButton?: Snippet<[ButtonRenderProps]>;
}

interface InputRenderProps {
  value: string;
  disabled: boolean;
  onInput: (e: Event) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  onSubmit: () => void;
}

interface ButtonRenderProps {
  disabled: boolean;
  onClick: () => void;
}
```

**Example - Custom Input:**
```svelte
<HeadlessInput placeholder="Type here...">
  {#snippet renderInput({ value, disabled, onInput, onKeyDown })}
    <textarea
      {value}
      {disabled}
      oninput={onInput}
      onkeydown={onKeyDown}
      placeholder="Type your message..."
      rows="3"
    />
  {/snippet}
  
  {#snippet renderSubmitButton({ disabled, onClick })}
    <button {disabled} onclick={onClick}>
      Send Message →
    </button>
  {/snippet}
</HeadlessInput>
```

#### HeadlessLayout

Flexible layout component with header, body, and footer sections.

```typescript
interface HeadlessLayoutProps {
  renderHeader?: Snippet;
  renderBody?: Snippet;
  renderFooter?: Snippet;
  enableAutoScroll?: boolean;  // Auto-scroll to new messages (default: true)
}
```

**Example - Full Layout:**
```svelte
<HeadlessLayout enableAutoScroll={true}>
  {#snippet renderHeader()}
    <header class="chat-header">
      <h2>Support Chat</h2>
      <button onclick={() => chatStore.clearSession()}>
        Clear
      </button>
    </header>
  {/snippet}
  
  {#snippet renderBody()}
    <div class="messages">
      <HeadlessMessagesList>
        {#snippet renderMessage(message)}
          <div class="msg">{message.text}</div>
        {/snippet}
      </HeadlessMessagesList>
    </div>
  {/snippet}
  
  {#snippet renderFooter()}
    <footer class="chat-footer">
      <HeadlessInput />
      <span>Powered by n8n</span>
    </footer>
  {/snippet}
</HeadlessLayout>
```

## 🌍 Internationalization (i18n)

Complete multi-language support with easy customization.

### Available i18n Keys

```typescript
interface I18nMessages {
  title?: string;              // Header title
  subtitle?: string;           // Header subtitle  
  footer?: string;             // Footer text
  inputPlaceholder?: string;   // Input placeholder
  getStarted?: string;         // Start button text
  clearConversation?: string;  // Clear button text
}
```

### Setup i18n

```svelte
<script>
  import { AIChat } from 'svelte-n8n-chat';
  
  const options = {
    webhookUrl: 'https://your-n8n.com/webhook/chat',
    defaultLanguage: 'fr',  // Set default language
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
        clearConversation: 'Effacer la conversation',
      },
      es: {
        title: 'Asistente IA',
        subtitle: 'Desarrollado por n8n',
        inputPlaceholder: 'Escribe tu mensaje...',
        clearConversation: 'Borrar conversación',
      },
      de: {
        title: 'KI-Assistent',
        subtitle: 'Bereitgestellt von n8n',
        inputPlaceholder: 'Geben Sie Ihre Nachricht ein...',
        clearConversation: 'Unterhaltung löschen',
      }
    }
  };
</script>

<AIChat {options} showClearButton={true} />
```

### Dynamic Language Switching

```svelte
<script>
  import { AIChat } from 'svelte-n8n-chat';
  
  let currentLanguage = $state('en');
  
  const chatOptions = $derived({
    webhookUrl: 'https://your-n8n.com/webhook/chat',
    defaultLanguage: currentLanguage,
    i18n: {
      en: { /* ... */ },
      fr: { /* ... */ }
    }
  });
</script>

<select bind:value={currentLanguage}>
  <option value="en">English</option>
  <option value="fr">Français</option>
</select>

{#key currentLanguage}
  <AIChat options={chatOptions} />
{/key}
```

### Override Individual Texts

```svelte
<!-- Use props to override specific texts -->
<AIChat 
  {options}
  title="Custom Title"
  subtitle="Custom Subtitle"
  inputPlaceholder="Custom placeholder text"
  clearButtonText="Reset"
/>
```

## 🎨 Theming & Styling

### AIChat Themes

Built-in light and dark themes:

```svelte
<!-- Light theme (default) -->
<AIChat {options} theme="light" />

<!-- Dark theme -->
<AIChat {options} theme="dark" />
```

### CSS Variables

Customize colors and spacing via CSS variables:

```svelte
<AIChat {options} />

<style>
  :global(.ai-chat-container) {
    /* Colors */
    --ai-primary: #667eea;
    --ai-primary-dark: #5568d3;
    --ai-secondary: #764ba2;
    
    /* Backgrounds */
    --ai-bg-primary: #ffffff;
    --ai-bg-secondary: #f8f9fa;
    --ai-bg-tertiary: #f3f4f6;
    
    /* Text */
    --ai-text-primary: #1f2937;
    --ai-text-secondary: #6b7280;
    --ai-text-tertiary: #9ca3af;
    
    /* Borders & Shadows */
    --ai-border: #e5e7eb;
    --ai-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    /* Spacing */
    --ai-spacing-xs: 0.25rem;
    --ai-spacing-sm: 0.5rem;
    --ai-spacing-md: 1rem;
    --ai-spacing-lg: 1.5rem;
    --ai-spacing-xl: 2rem;
    
    /* Border radius */
    --ai-radius-sm: 4px;
    --ai-radius-md: 8px;
    --ai-radius-lg: 12px;
    --ai-radius-xl: 16px;
  }
</style>
```

## 🔧 Advanced Usage

### Session Management

```svelte
<script>
  import { HeadlessChat } from 'svelte-n8n-chat';
  
  const options = {
    webhookUrl: 'https://your-n8n.com/webhook/chat',
    loadPreviousSession: true,  // Auto-load previous chat
  };
</script>

<HeadlessChat {options}>
  {#snippet children(chatStore)}
    <div>
      <p>Session ID: {chatStore.currentSessionId}</p>
      
      <!-- Manual session control -->
      <button onclick={() => chatStore.clearSession()}>
        Start New Session
      </button>
      
      <button onclick={() => chatStore.loadPreviousSession()}>
        Reload Session
      </button>
    </div>
  {/snippet}
</HeadlessChat>
```

### Streaming Responses

Enable real-time streaming for a ChatGPT-like experience:

```svelte
<script>
  const options = {
    webhookUrl: 'https://your-n8n.com/webhook/chat',
    enableStreaming: true,  // Enable WebSocket streaming
  };
</script>

<AIChat {options} />
```

**n8n Setup for Streaming:**
1. In your Chat Trigger node, enable "Streaming response"
2. Make sure your agent/LLM nodes support streaming
3. That's it! The component handles the rest

### Loading States

```svelte
<HeadlessChat {options}>
  {#snippet children(chatStore)}
    {#if chatStore.isLoadingSession}
      <div class="loading">
        <p>Loading previous session...</p>
      </div>
    {:else}
      <HeadlessMessagesList>
        <!-- Messages -->
      </HeadlessMessagesList>
      
      <HeadlessInput />
      
      {#if chatStore.waitingForResponse}
        <div class="sending">Sending...</div>
      {/if}
    {/if}
  {/snippet}
</HeadlessChat>
```

### Custom Headers & Authentication

```svelte
<script>
  const options = {
    webhookUrl: 'https://your-n8n.com/webhook/chat',
    webhookConfig: {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer your-token',
        'X-Custom-Header': 'custom-value'
      }
    }
  };
</script>

<AIChat {options} />
```

## 🔌 n8n Setup

### Prerequisites

1. **n8n instance** running (cloud or self-hosted)
2. **Chat Trigger workflow** set up
3. **CORS configured** for your domain

### Step-by-Step Setup

1. **Create a workflow in n8n**
2. **Add a Chat Trigger node**
   - Set "Allowed Origins (CORS)" to your domain (e.g., `http://localhost:5173`)
   - Enable "Streaming response" for real-time updates (optional)
3. **Connect your AI/LLM nodes**
   - Add your preferred AI service (OpenAI, Claude, etc.)
   - Configure the agent/chain
4. **Copy the webhook URL**
   - Find it in the Chat Trigger node
   - Format: `https://your-n8n.com/webhook/{id}/chat`
5. **Use in your Svelte app**

```svelte
<script>
  import { AIChat } from 'svelte-n8n-chat';
  
  const options = {
    webhookUrl: 'YOUR_WEBHOOK_URL_HERE',
    enableStreaming: true,  // Match your n8n setup
  };
</script>

<AIChat {options} />
```

## 📦 TypeScript Types

All components are fully typed. Import types as needed:

```typescript
import type {
  ChatOptions,
  ChatMessage,
  ChatStore,
  I18nMessages,
  SendMessageResponse,
} from 'svelte-n8n-chat';
```

## 🧪 Development

Clone and develop locally:

```bash
# Clone
git clone https://github.com/your-repo/n8n-chat-svelte
cd n8n-chat-svelte

# Install
npm install

# Develop with live reload
npm run dev

# Build library
npm run build

# Run tests
npm test
```

## 📝 License

MIT License - same as n8n

## 🤝 Contributing

Contributions welcome! This library is standalone and no longer tied to the n8n monorepo.

## 🔗 Links

- [n8n](https://n8n.io) - Workflow automation
- [Svelte 5](https://svelte.dev) - UI framework
- [Documentation](./src/lib/CHAT_README.md) - Full docs

## 🆘 Support

- 📖 Check [CHAT_README.md](./src/lib/CHAT_README.md) for detailed docs
- 💬 Open an issue on GitHub
- 🌐 Visit n8n community forums

---

**Made with ❤️ for the Svelte and n8n communities**
