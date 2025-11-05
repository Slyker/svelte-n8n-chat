# AIChat Component Customization Guide

Le composant `AIChat` offre une personnalisation complète via des **variables CSS** (style props Svelte) et des **snippets Svelte**.

## 📝 Table des matières

- [Gestion automatique des sessions](#gestion-automatique-des-sessions)
- [Variables CSS (Style Props)](#variables-css-style-props)
  - [Couleurs](#couleurs)
  - [Espacement et Layout](#espacement-et-layout)
  - [Typographie](#typographie)
- [Snippets](#snippets)
  - [Avatars](#avatars)
- [Exemples](#exemples)

---

## Gestion automatique des sessions

Le composant `AIChat` gère **automatiquement** la persistance des sessions par défaut, sans aucune configuration nécessaire.

### ✅ Ce qui est géré automatiquement

- **Génération d'ID de session** : Un UUID unique est créé automatiquement
- **Sauvegarde dans localStorage** : L'ID de session est persisté sous la clé `n8n-chat-session-id`
- **Rechargement des messages** : Au retour de l'utilisateur, les messages précédents sont rechargés depuis le serveur
- **Bouton Clear** : Crée une nouvelle session et efface l'historique local

### 🎯 Utilisation

**Mode par défaut (avec persistance) :**
```svelte
<AIChat {options} />
```

**Mode sans persistance (session temporaire) :**
```svelte
<AIChat {options} enableSessionPersistence={false} />
```

### 🔧 Bouton Clear

Pour afficher le bouton de suppression de l'historique :

```svelte
<AIChat {options} showClearButton={true} />
```

Lorsque l'utilisateur clique sur "Clear" :
1. Tous les messages sont effacés
2. Un nouvel ID de session est généré
3. L'ancien historique reste sur le serveur mais n'est plus accessible
4. Une nouvelle conversation démarre

### 💡 Avantages

- **Zero configuration** : Fonctionne immédiatement sans setup
- **Expérience utilisateur fluide** : Les conversations persistent entre les visites
- **Contrôle total** : Possibilité de désactiver via `enableSessionPersistence={false}`
- **Respect de la vie privée** : Le bouton Clear permet de tout effacer facilement

---

## Variables CSS (Style Props)

Svelte permet de passer des variables CSS directement en utilisant le préfixe `--`. C'est la méthode **recommandée** pour personnaliser le composant.

### Couleurs

| Variable CSS | Description | Valeur par défaut |
|--------------|-------------|-------------------|
| `--ai-primary` | Couleur principale du chat | `#667eea` |
| `--ai-primary-dark` | Variante foncée de la couleur principale | `#5568d3` |
| `--ai-secondary` | Couleur secondaire (dégradés) | `#764ba2` |
| `--ai-bg-primary` | Couleur de fond principale | `#ffffff` (light) / `#1f2937` (dark) |
| `--ai-bg-secondary` | Couleur de fond secondaire | `#f8f9fa` (light) / `#111827` (dark) |
| `--ai-bg-tertiary` | Couleur de fond tertiaire | `#f3f4f6` (light) / `#374151` (dark) |
| `--ai-text-primary` | Couleur de texte principale | `#1f2937` (light) / `#f9fafb` (dark) |
| `--ai-text-secondary` | Couleur de texte secondaire | `#6b7280` (light) / `#d1d5db` (dark) |
| `--ai-text-tertiary` | Couleur de texte tertiaire | `#9ca3af` |
| `--ai-border` | Couleur des bordures | `#e5e7eb` (light) / `#374151` (dark) |
| `--ai-shadow` | Couleur de l'ombre | `rgba(0, 0, 0, 0.1)` |
| `--ai-shadow-lg` | Couleur de l'ombre large | `rgba(0, 0, 0, 0.15)` |

### Espacement et Layout

| Variable CSS | Description | Valeur par défaut |
|--------------|-------------|-------------------|
| `--ai-radius-sm` | Rayon de bordure petit | `6px` |
| `--ai-radius-md` | Rayon de bordure moyen | `12px` |
| `--ai-radius-lg` | Rayon de bordure large | `16px` |
| `--ai-header-padding` | Padding du header | `20px 24px` |
| `--ai-messages-padding` | Padding de la zone de messages | `24px` |
| `--ai-footer-padding` | Padding du footer | `16px 24px` |
| `--ai-message-gap` | Espacement entre les messages | `20px` |
| `--ai-avatar-size` | Taille des avatars | `32px` |
| `--ai-avatar-radius` | Rayon de bordure des avatars | `8px` |

### Typographie

| Variable CSS | Description | Valeur par défaut |
|--------------|-------------|-------------------|
| `--ai-font-family` | Famille de police | `-apple-system, BlinkMacSystemFont, 'Segoe UI', ...` |
| `--ai-font-size` | Taille de police par défaut | `15px` |
| `--ai-font-size-sm` | Taille de police petite | `13px` |
| `--ai-font-size-lg` | Taille de police large | `18px` |
| `--ai-line-height` | Hauteur de ligne | `1.5` |

---

## Snippets

Les snippets Svelte permettent de personnaliser complètement le rendu de certaines parties du composant.

### Avatars

Vous pouvez personnaliser les avatars en passant des snippets au composant. **Les snippets remplacent complètement la div parente**, vous donnant un contrôle total sur le style et la structure.

| Snippet | Description | Usage |
|---------|-------------|-------|
| `botAvatar` | Avatar de l'IA dans les messages | Snippet sans paramètres - remplace la div `.message-avatar.bot-avatar` |
| `userAvatar` | Avatar de l'utilisateur dans les messages | Snippet sans paramètres - remplace la div `.message-avatar.user-avatar` |
| `headerAvatar` | Avatar dans le header du chat | Snippet sans paramètres - remplace la div `.ai-avatar` |

**Important** : Quand vous passez un snippet d'avatar, vous devez créer votre propre élément conteneur avec les styles appropriés. Les snippets ont un contrôle total sur le rendu.

---

## Exemples

### Exemple 1 : Personnalisation des couleurs avec style props

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com'
  };
</script>

<AIChat 
  {options}
  --ai-primary="#ff6b6b"
  --ai-secondary="#4ecdc4"
  --ai-bg-primary="#f8f9fa"
  --ai-text-primary="#2d3436"
/>
```

### Exemple 2 : Personnalisation de la typographie

```svelte
<AIChat 
  {options}
  --ai-font-family="'Inter', sans-serif"
  --ai-font-size="16px"
  --ai-font-size-sm="14px"
  --ai-font-size-lg="20px"
  --ai-line-height="1.6"
/>
```

### Exemple 3 : Personnalisation des espacements

```svelte
<AIChat 
  {options}
  --ai-radius-md="8px"
  --ai-messages-padding="32px"
  --ai-message-gap="24px"
  --ai-avatar-size="40px"
  --ai-avatar-radius="50%"
/>
```

### Exemple 4 : Avatars personnalisés avec snippets

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com'
  };
</script>

<AIChat {options}>
  {#snippet botAvatar()}
    <div class="message-avatar bot-avatar">
      <img src="/bot-avatar.png" alt="Bot" style="width: 100%; height: 100%; border-radius: inherit; object-fit: cover;" />
    </div>
  {/snippet}
  
  {#snippet userAvatar()}
    <div class="message-avatar user-avatar">
      <img src="/user-avatar.png" alt="User" style="width: 100%; height: 100%; border-radius: inherit; object-fit: cover;" />
    </div>
  {/snippet}
  
  {#snippet headerAvatar()}
    <div class="ai-avatar">
      <img src="/logo.png" alt="Logo" style="width: 24px; height: 24px;" />
    </div>
  {/snippet}
</AIChat>
```

**Note** : Les snippets remplacent complètement la div parente. Vous devez donc créer votre propre conteneur avec les classes CSS appropriées (`.message-avatar`, `.ai-avatar`, etc.) si vous voulez conserver les styles par défaut.

### Exemple 5 : Avatar avec composant personnalisé

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  import CustomBotIcon from './CustomBotIcon.svelte';
  import CustomUserIcon from './CustomUserIcon.svelte';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com'
  };
</script>

<AIChat {options}>
  {#snippet botAvatar()}
    <div class="message-avatar bot-avatar">
      <CustomBotIcon size={16} />
    </div>
  {/snippet}
  
  {#snippet userAvatar()}
    <div class="message-avatar user-avatar">
      <CustomUserIcon size={16} />
    </div>
  {/snippet}
</AIChat>
```

### Exemple 5b : Avatar avec style personnalisé complet

```svelte
<AIChat {options}>
  {#snippet botAvatar()}
    <div class="custom-bot-avatar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
    </div>
  {/snippet}
  
  {#snippet userAvatar()}
    <div class="custom-user-avatar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
  {/snippet}
</AIChat>

<style>
  .custom-bot-avatar,
  .custom-user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .custom-bot-avatar {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
  
  .custom-user-avatar {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
  }
</style>
```

### Exemple 6 : Combinaison complète

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com',
    defaultLanguage: 'fr'
  };
</script>

<AIChat 
  {options}
  title="Mon Assistant IA"
  subtitle="Propulsé par n8n"
  theme="dark"
  showClearButton={true}
  
  --ai-primary="#10b981"
  --ai-secondary="#059669"
  --ai-bg-primary="#111827"
  --ai-bg-secondary="#1f2937"
  --ai-text-primary="#f9fafb"
  
  --ai-radius-md="16px"
  --ai-messages-padding="32px"
  --ai-avatar-size="36px"
  
  --ai-font-size="16px"
  --ai-font-family="'Poppins', sans-serif"
>
  {#snippet botAvatar()}
    <div class="message-avatar bot-avatar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
    </div>
  {/snippet}
  
  {#snippet userAvatar()}
    <div class="message-avatar user-avatar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
  {/snippet}
</AIChat>
```

### Exemple 7 : Variables CSS réactives

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com'
  };
  
  let primaryColor = $state('#667eea');
  let fontSize = $state('15px');
</script>

<div>
  <label>
    Couleur primaire:
    <input type="color" bind:value={primaryColor} />
  </label>
  
  <label>
    Taille de police:
    <input type="range" min="12" max="20" bind:value={fontSize} />
    {fontSize}px
  </label>
</div>

<AIChat 
  {options}
  --ai-primary={primaryColor}
  --ai-font-size="{fontSize}px"
/>
```

### Exemple 8 : Thème complet avec variables

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com'
  };
</script>

<AIChat 
  {options}
  title="Support Assistant"
  theme="light"
  showClearButton={true}
  
  <!-- Couleurs -->
  --ai-primary="#10b981"
  --ai-secondary="#059669"
  --ai-bg-primary="#ffffff"
  --ai-bg-secondary="#f0fdf4"
  --ai-bg-tertiary="#dcfce7"
  --ai-text-primary="#1f2937"
  --ai-text-secondary="#6b7280"
  --ai-border="#d1fae5"
  
  <!-- Layout -->
  --ai-radius-md="16px"
  --ai-radius-sm="8px"
  --ai-radius-lg="20px"
  --ai-header-padding="24px 28px"
  --ai-messages-padding="28px"
  --ai-footer-padding="20px 28px"
  --ai-message-gap="24px"
  --ai-avatar-size="36px"
  --ai-avatar-radius="12px"
  
  <!-- Typographie -->
  --ai-font-size="16px"
  --ai-font-size-sm="14px"
  --ai-font-size-lg="20px"
  --ai-font-family="'Inter', -apple-system, sans-serif"
  --ai-line-height="1.6"
>
  {#snippet botAvatar()}
    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">
      🤖
    </div>
  {/snippet}
</AIChat>
```

---

## 🎨 Conseils de personnalisation

1. **Style Props Svelte** : Utilisez le préfixe `--` pour passer des variables CSS directement au composant
2. **Réactivité** : Les variables CSS peuvent être liées à des variables réactives Svelte
3. **Valeurs par défaut** : Toutes les variables ont des valeurs par défaut, vous ne devez spécifier que celles que vous voulez changer
4. **Cohérence des couleurs** : Assurez-vous que vos couleurs personnalisées ont un bon contraste pour la lisibilité
5. **Accessibilité** : Gardez un ratio de contraste minimum de 4.5:1 pour le texte
6. **Performance** : Les snippets SVG sont plus performants que les images pour les icônes
7. **Thème sombre** : Testez toujours vos personnalisations en mode clair ET sombre

---

## 🔧 Isolation des variables CSS

Les variables CSS définies via les style props sont automatiquement isolées au composant grâce au `display: contents` wrapper de Svelte. Vous n'avez pas à vous soucier des conflits avec d'autres parties de votre application.

Si vous avez besoin d'un contrôle encore plus fin, vous pouvez envelopper le composant dans un div avec ses propres variables :

```svelte
<div class="custom-chat-wrapper">
  <AIChat {options} />
</div>

<style>
  .custom-chat-wrapper {
    --ai-primary: #your-color;
    --ai-radius-md: 20px;
  }
</style>
```

---

## 📚 Liste complète des variables CSS

Toutes les variables CSS internes disponibles :

### Couleurs
- `--ai-primary`, `--ai-primary-dark`, `--ai-secondary`
- `--ai-bg-primary`, `--ai-bg-secondary`, `--ai-bg-tertiary`
- `--ai-text-primary`, `--ai-text-secondary`, `--ai-text-tertiary`
- `--ai-border`, `--ai-shadow`, `--ai-shadow-lg`

### Layout
- `--ai-radius-sm`, `--ai-radius-md`, `--ai-radius-lg`
- `--ai-header-padding`, `--ai-messages-padding`, `--ai-footer-padding`
- `--ai-message-gap`, `--ai-avatar-size`, `--ai-avatar-radius`

### Typographie
- `--ai-font-size`, `--ai-font-size-sm`, `--ai-font-size-lg`
- `--ai-font-family`, `--ai-line-height`

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com'
  };
</script>

<AIChat {options}>
  {#snippet botAvatar()}
    <img src="/bot-avatar.png" alt="Bot" style="width: 100%; height: 100%; border-radius: inherit;" />
  {/snippet}
  
  {#snippet userAvatar()}
    <img src="/user-avatar.png" alt="User" style="width: 100%; height: 100%; border-radius: inherit;" />
  {/snippet}
  
  {#snippet headerAvatar()}
    <img src="/logo.png" alt="Logo" style="width: 24px; height: 24px;" />
  {/snippet}
</AIChat>
```

### Exemple 5 : Avatar avec composant personnalisé

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  import CustomBotIcon from './CustomBotIcon.svelte';
  import CustomUserIcon from './CustomUserIcon.svelte';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com'
  };
</script>

<AIChat {options}>
  {#snippet botAvatar()}
    <CustomBotIcon size={16} />
  {/snippet}
  
  {#snippet userAvatar()}
    <CustomUserIcon size={16} />
  {/snippet}
</AIChat>
```

### Exemple 6 : Combinaison complète

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com',
    defaultLanguage: 'fr'
  };
</script>

<AIChat 
  {options}
  title="Mon Assistant IA"
  subtitle="Propulsé par n8n"
  theme="dark"
  showClearButton={true}
  
  primaryColor="#10b981"
  secondaryColor="#059669"
  bgPrimary="#111827"
  bgSecondary="#1f2937"
  textPrimary="#f9fafb"
  
  borderRadius="16px"
  messagesPadding="32px"
  avatarSize="36px"
  
  fontSize="16px"
  fontFamily="'Poppins', sans-serif"
>
  {#snippet botAvatar()}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>
  {/snippet}
  
  {#snippet userAvatar()}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  {/snippet}
</AIChat>
```

### Exemple 7 : Thème personnalisé complet

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-webhook-url.com'
  };
  
  // Définir un thème personnalisé
  const customTheme = {
    // Couleurs
    primaryColor: '#8b5cf6',
    primaryDarkColor: '#7c3aed',
    secondaryColor: '#ec4899',
    bgPrimary: '#fafafa',
    bgSecondary: '#f5f5f5',
    bgTertiary: '#e5e5e5',
    textPrimary: '#171717',
    textSecondary: '#525252',
    textTertiary: '#a3a3a3',
    borderColor: '#e5e5e5',
    
    // Layout
    borderRadius: '16px',
    borderRadiusSm: '8px',
    borderRadiusLg: '20px',
    headerPadding: '24px 28px',
    messagesPadding: '28px',
    footerPadding: '20px 28px',
    messageGap: '24px',
    avatarSize: '36px',
    avatarBorderRadius: '12px',
    
    // Typographie
    fontSize: '16px',
    fontSizeSm: '14px',
    fontSizeLg: '20px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    lineHeight: '1.6'
  };
</script>

<AIChat 
  {options}
  {...customTheme}
  title="Assistant Violet"
  theme="light"
  showClearButton={true}
/>
```

---

## 🎨 Conseils de personnalisation

1. **Cohérence des couleurs** : Assurez-vous que vos couleurs personnalisées ont un bon contraste pour la lisibilité
2. **Responsive** : Les tailles et espacements doivent rester lisibles sur mobile
3. **Accessibilité** : Gardez un ratio de contraste minimum de 4.5:1 pour le texte
4. **Performance** : Les snippets SVG sont plus performants que les images pour les icônes
5. **Thème sombre** : Testez toujours vos personnalisations en mode clair ET sombre

---

## 🔧 Variables CSS avancées

Si vous avez besoin d'encore plus de contrôle, vous pouvez surcharger directement les variables CSS internes :

```svelte
<div class="custom-chat-wrapper">
  <AIChat {options} />
</div>

<style>
  .custom-chat-wrapper :global(.ai-chat-container) {
    --ai-primary: #your-color;
    --ai-radius-md: 20px;
    /* ... autres variables ... */
  }
</style>
```

Liste complète des variables CSS internes disponibles :
- `--ai-primary`, `--ai-primary-dark`, `--ai-secondary`
- `--ai-bg-primary`, `--ai-bg-secondary`, `--ai-bg-tertiary`
- `--ai-text-primary`, `--ai-text-secondary`, `--ai-text-tertiary`
- `--ai-border`, `--ai-shadow`, `--ai-shadow-lg`
- `--ai-radius-sm`, `--ai-radius-md`, `--ai-radius-lg`
- `--ai-header-padding`, `--ai-messages-padding`, `--ai-footer-padding`
- `--ai-message-gap`, `--ai-avatar-size`, `--ai-avatar-radius`
- `--ai-font-size`, `--ai-font-size-sm`, `--ai-font-size-lg`
- `--ai-font-family`, `--ai-line-height`
