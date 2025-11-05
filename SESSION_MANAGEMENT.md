# 🔐 Gestion automatique des sessions - AIChat

## Vue d'ensemble

Le composant `AIChat` intègre une **gestion automatique et transparente des sessions** pour offrir la meilleure expérience utilisateur possible sans aucune configuration requise.

## ✨ Fonctionnement automatique

### 1. Génération d'ID de session

Dès le premier chargement du composant, un ID de session unique (UUID v4) est automatiquement :
- ✅ Généré
- ✅ Sauvegardé dans `localStorage` sous la clé `n8n-chat-session-id`
- ✅ Utilisé pour toutes les requêtes vers n8n

### 2. Persistance des conversations

Lors des visites suivantes :
- ✅ L'ID de session est récupéré depuis `localStorage`
- ✅ Les messages précédents sont automatiquement rechargés depuis le serveur n8n
- ✅ L'utilisateur retrouve sa conversation exactement où il l'avait laissée

### 3. Bouton "Clear"

Quand activé avec `showClearButton={true}`, le bouton permet de :
- ✅ Effacer tous les messages affichés
- ✅ Générer un nouvel ID de session
- ✅ Démarrer une nouvelle conversation fraîche
- ✅ L'ancienne session reste sur le serveur mais n'est plus accessible

## 🚀 Utilisation

### Configuration par défaut (recommandée)

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-n8n-instance.com/webhook/chat'
  };
</script>

<AIChat {options} />
```

**Résultat :** Les sessions sont automatiquement gérées, rien d'autre à faire !

### Avec bouton de suppression

```svelte
<AIChat {options} showClearButton={true} />
```

**Résultat :** Un bouton "Clear" apparaît dans le header pour démarrer une nouvelle session.

### Mode sans persistance (sessions temporaires)

```svelte
<AIChat {options} enableSessionPersistence={false} />
```

**Résultat :** Chaque visite démarre une nouvelle session, rien n'est sauvegardé.

## 🔍 Détails techniques

### Clé localStorage

```
n8n-chat-session-id
```

### Format de l'ID de session

```
xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
```

Exemple : `550e8400-e29b-41d4-a716-446655440000`

### Flux de données

```
┌─────────────────────────────────────────┐
│  Premier chargement                     │
├─────────────────────────────────────────┤
│  1. Génération UUID                     │
│  2. Sauvegarde localStorage             │
│  3. Envoi ID au serveur n8n             │
│  4. Création session serveur            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Visite suivante                        │
├─────────────────────────────────────────┤
│  1. Lecture ID depuis localStorage      │
│  2. Requête GET vers n8n                │
│  3. Chargement messages existants       │
│  4. Affichage conversation              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Clic sur "Clear"                       │
├─────────────────────────────────────────┤
│  1. Effacement messages UI              │
│  2. Génération nouveau UUID             │
│  3. Sauvegarde nouveau ID               │
│  4. Nouvelle session démarrée           │
└─────────────────────────────────────────┘
```

## 🆚 Comparaison avec HeadlessChat

### AIChat (version styled)

```svelte
<!-- Gestion automatique activée par défaut -->
<AIChat {options} />
```

✅ Tout est géré automatiquement
✅ Aucune configuration nécessaire
✅ Parfait pour une utilisation rapide

### HeadlessChat (version sans style)

```svelte
<!-- Configuration manuelle requise -->
<HeadlessChat options={{ ...options, loadPreviousSession: true }}>
  {#snippet children(store)}
    <!-- Vous devez gérer store.clearSession() manuellement -->
  {/snippet}
</HeadlessChat>
```

⚠️ Requiert `loadPreviousSession: true` dans les options
⚠️ Vous devez implémenter votre propre bouton clear
⚠️ Plus de flexibilité mais plus de code

## 💡 Cas d'usage

### E-commerce - Support client

```svelte
<AIChat 
  {options} 
  title="Support Client"
  showClearButton={true}
  enableSessionPersistence={true}
/>
```

👍 Les clients peuvent reprendre leurs questions précédentes
👍 Le bouton Clear permet de démarrer un nouveau sujet

### Formulaire public - Collecte d'informations

```svelte
<AIChat 
  {options}
  title="Formulaire IA"
  enableSessionPersistence={false}
/>
```

👍 Chaque visiteur a une session unique
👍 Aucune persistance = plus de confidentialité

### Application interne - Assistant IA

```svelte
<AIChat 
  {options}
  title="Assistant d'entreprise"
  showClearButton={true}
  enableSessionPersistence={true}
/>
```

👍 Les employés retrouvent leurs conversations
👍 Historique complet disponible

## 🔒 Sécurité et confidentialité

### Données stockées localement

Seul l'**ID de session** est stocké dans localStorage. Les messages eux-mêmes sont :
- ✅ Stockés sur votre serveur n8n
- ✅ Jamais sauvegardés dans le navigateur
- ✅ Contrôlés par vos propres règles de sécurité

### Effacement des données

L'utilisateur peut à tout moment :
- ✅ Cliquer sur "Clear" pour démarrer une nouvelle session
- ✅ Vider son localStorage manuellement
- ✅ Le développeur peut désactiver la persistance globalement

### RGPD et conformité

- ✅ Stockage minimal (juste un UUID)
- ✅ Possibilité de désactiver la persistance
- ✅ L'utilisateur garde le contrôle (bouton Clear)
- ✅ Aucune donnée sensible dans localStorage

## 🎯 Avantages

### Pour les développeurs

1. **Zero configuration** : Fonctionne immédiatement
2. **Moins de code** : Pas besoin de gérer les sessions manuellement
3. **Maintenance facile** : Une seule prop pour tout contrôler
4. **TypeScript complet** : Types et documentation intégrés

### Pour les utilisateurs

1. **Expérience fluide** : Les conversations persistent naturellement
2. **Contrôle total** : Bouton Clear pour recommencer
3. **Rapidité** : Pas besoin de tout retaper à chaque visite
4. **Familiarité** : Comportement similaire aux apps de chat modernes

## 📊 Exemples de code complets

### Site vitrine avec chat support

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://n8n.company.com/webhook/support',
    initialMessages: [
      '👋 Bonjour ! Comment puis-je vous aider ?'
    ],
  };
</script>

<div class="support-widget">
  <AIChat 
    {options}
    title="Support en ligne"
    subtitle="Réponse en moins de 2 min"
    showClearButton={true}
    theme="light"
    --ai-primary="#3b82f6"
  />
</div>

<style>
  .support-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 600px;
  }
</style>
```

### Application SaaS - Assistant personnel

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  // Intégration avec votre système d'auth
  const userId = getUserId(); // Votre fonction
  
  const options = {
    webhookUrl: `https://app.company.com/webhook/assistant?user=${userId}`,
    defaultLanguage: 'fr',
  };
</script>

<AIChat 
  {options}
  title="Mon Assistant IA"
  showClearButton={true}
  enableSessionPersistence={true}
  --ai-primary="#10b981"
  --ai-font-family="'Inter', sans-serif"
/>
```

### Kiosque public - Pas de persistance

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://kiosk.museum.com/webhook/info',
    initialMessages: [
      'Bienvenue au musée !',
      'Posez-moi vos questions sur les expositions.'
    ],
  };
</script>

<AIChat 
  {options}
  title="Information Musée"
  enableSessionPersistence={false}
  theme="dark"
/>
```

## 🔧 Dépannage

### Les messages ne se rechargent pas

**Vérifiez :**
1. `enableSessionPersistence={true}` (ou omis, c'est le défaut)
2. Votre serveur n8n supporte le rechargement de session
3. localStorage n'est pas désactivé dans le navigateur

### L'ID de session n'est pas sauvegardé

**Causes possibles :**
1. localStorage désactivé (navigation privée)
2. Cookies/stockage bloqué par le navigateur
3. `enableSessionPersistence={false}` activé

### Je veux gérer les sessions moi-même

**Solution :**
Utilisez `HeadlessChat` au lieu de `AIChat` pour un contrôle total :

```svelte
<HeadlessChat options={{ ...options, loadPreviousSession: true }}>
  {#snippet children(store)}
    <!-- Votre UI personnalisée -->
    <button onclick={() => store.clearSession()}>
      Mon bouton custom
    </button>
  {/snippet}
</HeadlessChat>
```

## 📚 Ressources

- [Documentation AIChat](./src/lib/chat-styled/README.md)
- [Guide de personnalisation](./src/lib/chat-styled/CUSTOMIZATION.md)
- [Types TypeScript](./src/lib/chat-styled/types.ts)
- [Documentation n8n](https://docs.n8n.io)
