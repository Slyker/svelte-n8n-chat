# 🧪 Test de la gestion automatique des sessions

Ce fichier montre comment tester la fonctionnalité de gestion automatique des sessions.

## 🎯 Scénario de test

### 1. Premier chargement

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-n8n-instance.com/webhook/chat',
    initialMessages: ['Bonjour ! 👋']
  };
</script>

<AIChat {options} showClearButton={true} />
```

**Comportement attendu :**
1. ✅ Un UUID est généré automatiquement
2. ✅ Sauvegardé dans `localStorage` sous `n8n-chat-session-id`
3. ✅ Le message initial s'affiche
4. ✅ Vous pouvez envoyer des messages

### 2. Vérifier le localStorage

Ouvrez la console du navigateur et tapez :

```javascript
localStorage.getItem('n8n-chat-session-id')
// Devrait retourner quelque chose comme : "550e8400-e29b-41d4-a716-446655440000"
```

### 3. Envoyer quelques messages

Envoyez 2-3 messages dans le chat pour créer un historique.

### 4. Rafraîchir la page (F5)

**Comportement attendu :**
1. ✅ L'indicateur de chargement s'affiche brièvement
2. ✅ Les messages précédents sont rechargés depuis n8n
3. ✅ Vous retrouvez exactement votre conversation

### 5. Cliquer sur "Clear"

**Comportement attendu :**
1. ✅ Tous les messages disparaissent
2. ✅ Un nouvel UUID est généré et sauvegardé
3. ✅ Une nouvelle session démarre

Vérifiez à nouveau le localStorage :

```javascript
localStorage.getItem('n8n-chat-session-id')
// L'ID devrait être différent du précédent
```

### 6. Rafraîchir après Clear

**Comportement attendu :**
1. ✅ Aucun message n'est chargé (nouvelle session)
2. ✅ Le chat est vide et prêt pour une nouvelle conversation

## 🔍 Tests avancés

### Test 1 : Mode sans persistance

```svelte
<AIChat {options} enableSessionPersistence={false} />
```

**Comportement attendu :**
1. ❌ Pas d'ID sauvegardé dans localStorage
2. ❌ Pas de rechargement de messages au refresh
3. ✅ Chaque visite = nouvelle session temporaire

### Test 2 : Navigation privée

Ouvrez une fenêtre de navigation privée et testez le composant.

**Comportement attendu :**
1. ⚠️ localStorage peut être bloqué
2. ✅ Le composant doit continuer à fonctionner
3. ✅ Pas de crash, juste pas de persistance

### Test 3 : Deux onglets différents

1. Ouvrez le chat dans l'onglet A
2. Envoyez un message
3. Ouvrez le même chat dans l'onglet B
4. Rafraîchissez l'onglet B

**Comportement attendu :**
1. ✅ L'onglet B charge les messages de l'onglet A
2. ✅ Les deux onglets partagent la même session
3. ✅ Même ID dans localStorage pour les deux

### Test 4 : Clear dans un onglet

1. Onglet A et B ouverts sur le même chat
2. Dans l'onglet A, cliquez sur "Clear"
3. Rafraîchissez l'onglet B

**Comportement attendu :**
1. ✅ L'onglet B charge la nouvelle session (vide)
2. ✅ L'ancien historique n'est plus accessible
3. ✅ localStorage mis à jour pour les deux

## 🛠️ Debug

### Activer les logs du store

```svelte
<script>
  import { AIChat } from '@n8n/chat';
  
  const options = {
    webhookUrl: 'https://your-n8n-instance.com/webhook/chat',
    loadPreviousSession: true
  };
  
  // Ouvrez la console pour voir les logs
</script>

<AIChat {options} />
```

Dans la console, vous devriez voir :
- `[Chat] Session ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- `[Chat] Loading previous session...`
- `[Chat] Loaded X messages`

### Inspecter le state

Ajoutez temporairement dans le composant :

```svelte
<HeadlessChat {options}>
  {#snippet children(store)}
    <pre>{JSON.stringify({
      sessionId: store.currentSessionId,
      messagesCount: store.messages.length,
      isLoading: store.isLoadingSession
    }, null, 2)}</pre>
  {/snippet}
</HeadlessChat>
```

## ✅ Checklist de test

- [ ] UUID généré au premier chargement
- [ ] UUID sauvegardé dans localStorage
- [ ] Messages rechargés après refresh
- [ ] Bouton Clear génère nouveau UUID
- [ ] Nouvelle session démarre après Clear
- [ ] Mode sans persistance fonctionne
- [ ] Navigation privée ne crash pas
- [ ] Deux onglets partagent la session
- [ ] Clear synchronise les onglets

## 📝 Notes

- Le serveur n8n doit supporter le rechargement de session
- L'endpoint doit accepter un paramètre `sessionId`
- Les messages doivent être stockés côté serveur avec ce `sessionId`

## 🚨 Problèmes courants

### "Les messages ne se rechargent pas"

**Solutions :**
1. Vérifiez que `enableSessionPersistence={true}` (ou omis)
2. Vérifiez que votre serveur n8n supporte les sessions
3. Ouvrez la console pour voir les erreurs réseau

### "L'ID de session n'est pas sauvegardé"

**Solutions :**
1. Vérifiez que localStorage fonctionne (pas en navigation privée)
2. Vérifiez qu'aucun script ne bloque localStorage
3. Essayez de vider le cache du navigateur

### "Le bouton Clear ne fonctionne pas"

**Solutions :**
1. Vérifiez que `showClearButton={true}` est bien défini
2. Ouvrez la console pour voir les erreurs
3. Vérifiez que le composant reçoit bien les bonnes props

## 🎯 Critères de succès

Un test réussi doit démontrer :

1. ✅ Génération automatique de l'ID
2. ✅ Persistance dans localStorage
3. ✅ Rechargement des messages
4. ✅ Création de nouvelle session avec Clear
5. ✅ Synchronisation entre onglets
6. ✅ Gestion gracieuse des erreurs
7. ✅ Mode sans persistance fonctionnel

---

**Bonne chance pour vos tests ! 🚀**
