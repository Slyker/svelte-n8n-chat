# 🎉 Version 2.1.0 - Gestion automatique des sessions

## 🚀 Nouvelle fonctionnalité majeure

### Gestion automatique des sessions dans AIChat

Le composant `AIChat` gère maintenant **automatiquement** la persistance des sessions sans aucune configuration !

#### ✨ Ce qui change

**AVANT (v2.0.x) :**
```svelte
<script>
  const options = {
    webhookUrl: 'https://...',
    loadPreviousSession: true  // ❌ À configurer manuellement
  };
</script>

<AIChat {options} />
```

**MAINTENANT (v2.1.0) :**
```svelte
<script>
  const options = {
    webhookUrl: 'https://...'
    // ✅ C'est tout ! La session est gérée automatiquement
  };
</script>

<AIChat {options} />
```

#### 🎯 Fonctionnalités incluses

- ✅ **Génération automatique d'ID de session** (UUID v4)
- ✅ **Sauvegarde dans localStorage** (`n8n-chat-session-id`)
- ✅ **Rechargement automatique des messages** au retour de l'utilisateur
- ✅ **Bouton Clear intelligent** qui génère une nouvelle session
- ✅ **Zero configuration** requise par défaut

#### 📋 Nouvelle prop

```typescript
enableSessionPersistence?: boolean  // default: true
```

**Utilisation :**

```svelte
<!-- Mode par défaut : sessions persistantes -->
<AIChat {options} />

<!-- Désactiver la persistance (sessions temporaires) -->
<AIChat {options} enableSessionPersistence={false} />

<!-- Avec bouton Clear -->
<AIChat {options} showClearButton={true} />
```

## 📚 Documentation

### Nouveaux fichiers

- **`SESSION_MANAGEMENT.md`** - Guide complet de la gestion des sessions
  - Vue d'ensemble du fonctionnement
  - Diagrammes de flux
  - Exemples de code pour différents cas d'usage
  - Dépannage et FAQ

### Fichiers mis à jour

- **`src/lib/chat-styled/README.md`** - Section "Gestion des sessions" ajoutée
- **`src/lib/chat-styled/CUSTOMIZATION.md`** - Documentation de `enableSessionPersistence`
- **`src/lib/chat-styled/types.ts`** - Documentation TypeScript complète

## 🔧 Changements techniques

### AIChat.svelte

```typescript
interface Props {
  // ... autres props
  enableSessionPersistence?: boolean; // Nouveau !
}

// Fusion automatique des options
const mergedOptions: ChatOptions = $derived({
  ...options,
  loadPreviousSession: enableSessionPersistence 
    ? true 
    : (options.loadPreviousSession ?? false),
});
```

### Comportement

1. **Par défaut** : `enableSessionPersistence={true}`
   - `loadPreviousSession` est automatiquement activé
   - L'ID de session est généré et sauvegardé
   - Les messages sont rechargés automatiquement

2. **Si désactivé** : `enableSessionPersistence={false}`
   - Respect de la configuration manuelle dans `options`
   - Aucune persistance automatique
   - Comportement identique à v2.0.x

## 💡 Cas d'usage

### Site e-commerce avec support

```svelte
<AIChat 
  {options}
  title="Support Client"
  showClearButton={true}
/>
```

✅ Les clients retrouvent leurs conversations
✅ Peuvent effacer et recommencer facilement

### Application SaaS

```svelte
<AIChat 
  {options}
  enableSessionPersistence={true}
/>
```

✅ Expérience fluide entre les sessions
✅ Historique complet disponible

### Kiosque public

```svelte
<AIChat 
  {options}
  enableSessionPersistence={false}
/>
```

✅ Chaque utilisateur a une session fraîche
✅ Aucune persistance pour plus de confidentialité

## 🔒 Sécurité

- Seul l'ID de session (UUID) est stocké localement
- Les messages restent sur votre serveur n8n
- L'utilisateur garde le contrôle (bouton Clear)
- Compatible RGPD

## 🆚 Différence HeadlessChat vs AIChat

### HeadlessChat (version sans style)

```svelte
<!-- Configuration manuelle requise -->
<HeadlessChat options={{ loadPreviousSession: true }}>
  {#snippet children(store)}
    <button onclick={() => store.clearSession()}>Clear</button>
  {/snippet}
</HeadlessChat>
```

⚠️ Vous devez gérer `loadPreviousSession` manuellement
⚠️ Vous devez implémenter votre propre bouton clear

### AIChat (version styled)

```svelte
<!-- Tout est automatique -->
<AIChat {options} showClearButton={true} />
```

✅ Gestion automatique de `loadPreviousSession`
✅ Bouton clear intégré
✅ Zero configuration

## 📦 Migration depuis v2.0.x

### Changement NON-BREAKING

Cette mise à jour est **rétrocompatible**. Vos projets v2.0.x continuent de fonctionner.

**Si vous aviez :**

```svelte
<script>
  const options = {
    webhookUrl: '...',
    loadPreviousSession: true
  };
</script>

<AIChat {options} />
```

**Vous pouvez maintenant simplifier en :**

```svelte
<script>
  const options = {
    webhookUrl: '...'
    // loadPreviousSession n'est plus nécessaire
  };
</script>

<AIChat {options} />
```

### Si vous NE voulez PAS la persistance automatique

```svelte
<AIChat {options} enableSessionPersistence={false} />
```

## 🎁 Bonus

Cette fonctionnalité rend `AIChat` encore plus simple à utiliser :

**Avant v2.1.0 :**
- 📝 Lire la doc sur `loadPreviousSession`
- ⚙️ Configurer dans `options`
- 🔧 Gérer le bouton clear manuellement

**Avec v2.1.0 :**
- ✅ `<AIChat {options} />`
- ✅ C'est tout !

## 🔗 Liens utiles

- [Documentation complète](./src/lib/chat-styled/README.md)
- [Guide de gestion des sessions](./SESSION_MANAGEMENT.md)
- [Guide de personnalisation](./src/lib/chat-styled/CUSTOMIZATION.md)
- [npm package](https://www.npmjs.com/package/svelte-n8n-chat)
- [GitHub](https://github.com/Slyker/svelte-n8n-chat)

## 📊 Stats

- **Fichiers modifiés** : 5
- **Lignes ajoutées** : 435+
- **Documentation** : 3 fichiers mis à jour + 1 nouveau guide
- **Breaking changes** : 0 ✅
- **Nouvelle prop** : `enableSessionPersistence`

---

**Profitez de v2.1.0 ! 🚀**
