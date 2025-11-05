# Chat Components

This directory contains two standalone chat implementations extracted from the n8n project:

## 📦 Packages

### 1. `chat-headless` - Headless Chat Components

A headless Svelte chat library with full styling control via Svelte 5 snippets. Provides chat functionality and state management while giving you complete control over the UI.

**Features:**
- 🎨 Full styling control using Svelte 5 snippets
- 🔄 Real-time streaming responses
- 💬 WebSocket support
- 📁 File upload support
- 💾 Session management with localStorage
- 🎯 Fully typed with TypeScript
- 🪶 Lightweight with minimal dependencies

**Components:**
- `HeadlessChat` - Main wrapper component
- `HeadlessMessagesList` - Message list component
- `HeadlessInput` - Input component
- `HeadlessLayout` - Layout component

**Example:**
```svelte
<script>
  import { HeadlessChat, HeadlessMessagesList, HeadlessInput } from 'svelte/chat-headless';
  
  const options = {
    webhookUrl: 'YOUR_WEBHOOK_URL',
    initialMessages: ['Hi! How can I help?'],
  };
</script>

<HeadlessChat {options}>
  {#snippet children(chatStore)}
    <HeadlessMessagesList>
      {#snippet renderMessage(message)}
        <div class="message {message.sender}">
          {message.text}
        </div>
      {/snippet}
    </HeadlessMessagesList>
    
    <HeadlessInput placeholder="Type your message..." />
  {/snippet}
</HeadlessChat>
```

### 2. `chat-styled` - Professional AI Chat UI

A professional AI chat interface built on top of `chat-headless` with modern, polished design.

**Features:**
- 🎨 Professional, modern design
- 🌓 Light & dark theme support
- 💬 Smooth animations
- 📱 Responsive design
- ♿ Accessible (ARIA labels, keyboard navigation)
- 🔧 Customizable via CSS variables

**Components:**
- `AIChat` - Complete styled chat component

**Example:**
```svelte
<script>
  import { AIChat } from 'svelte/chat-styled';
  
  const options = {
    webhookUrl: 'YOUR_WEBHOOK_URL',
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

## 🚀 Quick Start

Both packages are available as part of the main `svelte` library exports:

```bash
# Install dependencies
npm install
```

```svelte
<script>
  // Import from the main library
  import { 
    HeadlessChat, 
    HeadlessMessagesList, 
    HeadlessInput,
    AIChat 
  } from '$lib';
  
  // Or use path imports
  import { HeadlessChat } from '$lib/chat-headless';
  import { AIChat } from '$lib/chat-styled';
</script>
```

## 📋 Prerequisites

To use these chat components, you need:

1. A running n8n instance
2. A workflow with a **Chat Trigger** node
3. The webhook URL from that trigger
4. Your domain added to **Allowed Origins (CORS)** in the Chat Trigger

For streaming responses, enable **Streaming response** in the Chat Trigger node.

## 🎨 Customization

### Headless Components
Complete control via Svelte snippets - style everything yourself!

### Styled Components
Customize via CSS variables:

```css
:global(.ai-chat-container) {
  --ai-primary: #667eea;
  --ai-secondary: #764ba2;
  --ai-bg-primary: #ffffff;
  --ai-text-primary: #1f2937;
  /* ... and more */
}
```

## 📚 API Reference

### ChatOptions

```typescript
interface ChatOptions {
  webhookUrl: string;                    // Required: n8n webhook URL
  webhookConfig?: {
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
  };
  initialMessages?: string[];            // Initial bot messages
  enableStreaming?: boolean;             // Enable streaming responses
  allowFileUploads?: boolean;            // Enable file uploads
  allowedFilesMimeTypes?: string;        // Allowed file types
  loadPreviousSession?: boolean;         // Load previous chat session
  chatInputKey?: string;                 // Default: 'chatInput'
  chatSessionKey?: string;               // Default: 'sessionId'
  metadata?: Record<string, unknown>;    // Custom metadata
  // ... more options
}
```

### ChatMessage

```typescript
interface ChatMessage {
  id: string;
  text?: string;
  sender: 'user' | 'bot';
  files?: File[];
  type?: 'text' | 'component';
}
```

## 🔄 Comparison

| Feature | chat-headless | chat-styled |
|---------|---------------|-------------|
| Styling | Fully custom | Pre-styled |
| Bundle Size | ~30KB | ~60KB |
| Customization | Complete | CSS variables |
| Setup Time | More | Minimal |
| Use Case | Custom designs | Quick integration |

## 🏗️ Architecture

```
chat-styled
    ↓ uses
chat-headless
    ↓ connects to
n8n Chat Trigger Workflow
```

## 📦 Dependencies

- `uuid` - For generating unique message and session IDs
- `svelte` - Peer dependency (^5.0.0)

## 🤝 Original Source

These components were extracted from the n8n monorepo and made standalone:

- Original headless: `packages/frontend/@n8n/chat-headless-svelte`
- Original styled: `packages/frontend/@n8n/chat-styled-svelte`

They are fully independent and have no dependencies on the n8n infrastructure.

## 📝 License

Same license as n8n - see LICENSE.md in the root of this project.
