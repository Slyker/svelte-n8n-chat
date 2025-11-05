# AIChat - Styled Chat Component

Le composant `AIChat` est une solution complète et prête à l'emploi pour intégrer un chat IA dans votre application Svelte. Il offre une interface moderne et professionnelle avec de nombreuses options de personnalisation.

## 🚀 Installation

```bash
npm install @n8n/chat
```

## 📦 Utilisation de base

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-n8n-instance.com/webhook/chat',
    initialMessages: ['Hello! 👋'],
  };
</script>

<AIChat {options} />
```

## 🎨 Personnalisation

Le composant `AIChat` peut être personnalisé de deux manières :

1. **Variables CSS (Style Props)** - Méthode native de Svelte pour modifier les couleurs, espacements et typographie
2. **Snippets Svelte** - Pour personnaliser le rendu des avatars

### Variables CSS avec Style Props

Utilisez le préfixe `--` pour passer des variables CSS directement au composant :

```svelte
<AIChat 
  {options}
  --ai-primary="#10b981"
  --ai-secondary="#059669"
  --ai-bg-primary="#ffffff"
  --ai-radius-md="16px"
  --ai-font-size="16px"
  --ai-font-family="'Inter', sans-serif"
/>
```

**Voir [CUSTOMIZATION.md](./CUSTOMIZATION.md) pour la liste complète des variables disponibles.**

### Snippets pour Avatars

Vous pouvez personnaliser les avatars en passant des snippets :

```svelte
<AIChat {options}>
  {#snippet botAvatar()}
    <img src="/bot-icon.png" alt="Bot" />
  {/snippet}
  
  {#snippet userAvatar()}
    <img src="/user-icon.png" alt="User" />
  {/snippet}
  
  {#snippet headerAvatar()}
    <img src="/logo.png" alt="Logo" />
  {/snippet}
</AIChat>
```

## 📋 Props

### Options (obligatoire)

| Prop | Type | Description |
|------|------|-------------|
| `options` | `ChatOptions` | Configuration du chat (webhookUrl, etc.) |

### Textes et Labels

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `title` | `string` | `'AI Assistant'` | Titre dans le header |
| `subtitle` | `string` | `'Powered by n8n'` | Sous-titre dans le header |
| `inputPlaceholder` | `string` | `'Type your message...'` | Placeholder de l'input |
| `clearButtonText` | `string` | `'Clear'` | Texte du bouton clear |

### Apparence

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `theme` | `'light' \| 'dark'` | `'light'` | Thème du chat |
| `showClearButton` | `boolean` | `false` | Afficher le bouton de suppression |

### Gestion des sessions

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `enableSessionPersistence` | `boolean` | `true` | Active la persistance automatique des sessions |

**Note importante sur la gestion des sessions :**

Le composant `AIChat` gère **automatiquement** la persistance des sessions par défaut. Cela signifie que :

- ✅ Un ID de session unique est généré et sauvegardé dans le localStorage
- ✅ Les messages sont automatiquement rechargés au retour de l'utilisateur
- ✅ Le bouton "Clear" crée une nouvelle session et efface l'historique
- ✅ Aucune configuration manuelle nécessaire

Pour désactiver cette fonctionnalité (mode session temporaire) :

```svelte
<AIChat {options} enableSessionPersistence={false} />
```

### Snippets

| Prop | Type | Description |
|------|------|-------------|
| `botAvatar` | `Snippet` | Avatar de l'IA dans les messages |
| `userAvatar` | `Snippet` | Avatar de l'utilisateur dans les messages |
| `headerAvatar` | `Snippet` | Avatar/logo dans le header |

### Variables CSS - Couleurs

| Variable | Défaut |
|----------|--------|
| `--ai-primary` | `#667eea` |
| `--ai-primary-dark` | `#5568d3` |
| `--ai-secondary` | `#764ba2` |
| `--ai-bg-primary` | `#ffffff` / `#1f2937` |
| `--ai-bg-secondary` | `#f8f9fa` / `#111827` |
| `--ai-bg-tertiary` | `#f3f4f6` / `#374151` |
| `--ai-text-primary` | `#1f2937` / `#f9fafb` |
| `--ai-text-secondary` | `#6b7280` / `#d1d5db` |
| `--ai-text-tertiary` | `#9ca3af` |
| `--ai-border` | `#e5e7eb` / `#374151` |
| `--ai-shadow` | `rgba(0, 0, 0, 0.1)` |
| `--ai-shadow-lg` | `rgba(0, 0, 0, 0.15)` |

### Variables CSS - Espacement & Layout

| Variable | Défaut |
|----------|--------|
| `--ai-radius-sm` | `6px` |
| `--ai-radius-md` | `12px` |
| `--ai-radius-lg` | `16px` |
| `--ai-header-padding` | `20px 24px` |
| `--ai-messages-padding` | `24px` |
| `--ai-footer-padding` | `16px 24px` |
| `--ai-message-gap` | `20px` |
| `--ai-avatar-size` | `32px` |
| `--ai-avatar-radius` | `8px` |

### Variables CSS - Typographie

| Variable | Défaut |
|----------|--------|
| `--ai-font-family` | `-apple-system, ...` |
| `--ai-font-size` | `15px` |
| `--ai-font-size-sm` | `13px` |
| `--ai-font-size-lg` | `18px` |
| `--ai-line-height` | `1.5` |

## 🎯 Exemples

### Exemple 1 : Thème personnalisé

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com'
  };
</script>

<AIChat 
  {options}
  title="Support Bot"
  subtitle="Available 24/7"
  theme="dark"
  showClearButton={true}
  --ai-primary="#8b5cf6"
  --ai-secondary="#ec4899"
  --ai-font-size="16px"
  --ai-radius-md="20px"
/>
```

### Exemple 2 : Avatars personnalisés

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  import BotIcon from './BotIcon.svelte';
  import UserIcon from './UserIcon.svelte';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com'
  };
</script>

<AIChat {options}>
  {#snippet botAvatar()}
    <BotIcon size={16} />
  {/snippet}
  
  {#snippet userAvatar()}
    <UserIcon size={16} />
  {/snippet}
  
  {#snippet headerAvatar()}
    <img src="/company-logo.svg" alt="Logo" width="24" height="24" />
  {/snippet}
</AIChat>
```

### Exemple 3 : Avatars avec emojis

```svelte
<AIChat {options}>
  {#snippet botAvatar()}
    <div style="font-size: 16px;">🤖</div>
  {/snippet}
  
  {#snippet userAvatar()}
    <div style="font-size: 16px;">👤</div>
  {/snippet}
  
  {#snippet headerAvatar()}
    <div style="font-size: 20px;">💬</div>
  {/snippet}
</AIChat>
```

### Exemple 4 : Intégration i18n

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  let currentLang = $state('fr');
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com',
    defaultLanguage: currentLang,
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
  };
</script>

<div class="language-selector">
  <button onclick={() => currentLang = 'en'}>🇬🇧 EN</button>
  <button onclick={() => currentLang = 'fr'}>🇫🇷 FR</button>
</div>

{#key currentLang}
  <AIChat {options} />
{/key}
```

### Exemple 5 : Configuration complète

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-n8n-instance.com/webhook/chat',
    initialMessages: [
      'Welcome! 👋',
      'How can I help you today?'
    ],
    enableStreaming: true,
    loadPreviousSession: true,
    showWelcomeScreen: false,
    defaultLanguage: 'en',
  };
</script>

<div class="chat-container">
  <AIChat 
    {options}
    title="Support Assistant"
    subtitle="We're here to help"
    theme="light"
    showClearButton={true}
    inputPlaceholder="Ask us anything..."
    
    --ai-primary="#10b981"
    --ai-secondary="#059669"
    --ai-bg-primary="#ffffff"
    --ai-bg-secondary="#f0fdf4"
    --ai-text-primary="#1f2937"
    
    --ai-radius-md="16px"
    --ai-messages-padding="32px"
    --ai-avatar-size="36px"
    
    --ai-font-size="16px"
    --ai-font-family="'Inter', sans-serif"
  >
    {#snippet botAvatar()}
      <div class="custom-bot-avatar">🤖</div>
    {/snippet}
    
    {#snippet userAvatar()}
      <div class="custom-user-avatar">👤</div>
    {/snippet}
  </AIChat>
</div>

<style>
  .chat-container {
    width: 100%;
    max-width: 500px;
    height: 600px;
    margin: 0 auto;
  }
  
  .custom-bot-avatar,
  .custom-user-avatar {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
</style>
```

## 🎨 Guide de personnalisation avancée

Pour une personnalisation plus avancée, consultez le fichier [CUSTOMIZATION.md](./CUSTOMIZATION.md) qui contient :

- Liste complète de toutes les variables CSS
- Exemples de thèmes personnalisés
- Guide d'utilisation des snippets
- Bonnes pratiques pour la personnalisation
- Variables CSS internes pour un contrôle total

## 🔗 Voir aussi

- [ChatOptions](../chat-headless/README.md#chatoptions) - Configuration du chat
- [Headless Components](../chat-headless/README.md) - Composants sans style pour une personnalisation complète
- [CUSTOMIZATION.md](./CUSTOMIZATION.md) - Guide de personnalisation détaillé

## 📝 Notes

- Les valeurs par défaut des couleurs changent automatiquement selon le thème (`light` ou `dark`)
- Les snippets d'avatars doivent être dimensionnés pour s'adapter à leur conteneur
- Les variables CSS sont appliquées via l'attribut `style` du composant
- La propriété `i18n` dans `options` peut surcharger les props `title`, `subtitle`, etc.
