# Configuration des Agents Conversationnels dans Projects

## Vue d'ensemble
L'infrastructure agent conversationnelle de Projects se compose de :

-   **Un serveur MCP** avec accès en lecture aux données de Projects
-   **Une base de données vectorielle** pour l'indexation sémantique
    des documents (FAQ, bases de connaissances...)
-   **Des agents intelligents** :
    -   Un agent **\"Général\"** accessible sur toutes les pages via un
        bouton flottant
    -   Des **agents Spécialisés** configurables par les administrateurs

------------------------------------------------------------------------

## Table des Matières

1.  [Environnement des Agents](#environnement-des-agents)
2.  [Activation Globale](#activation-globale)
3.  [Trois Types de Configuration](#trois-types-de-configuration)
4.  [Vector Store RAG](#vector-store-rag)
5.  [Tracing Debugging](#tracing-debugging)
6.  [FAQ Troubleshooting](#faq-troubleshooting)

------------------------------------------------------------------------

## Environnement des Agents

En raison de l'évolution progressive du codebase et de la nécessité de
maintenir la compatibilité rétroactive pendant la migration des
plateformes, les agents peuvent fonctionner selon trois modes de
configuration différents :

| Mode                          | Gestion                        | Cas d'usage |
| ----------------------------- | ------------------------------ | ---------------------------------------- |
| OpenAI Natif                  | Plateforme OpenAI uniquement   | Agent général uniquement |
| Langchain (.env)              | Variables d'environnement     | Tests rapides, déploiements simples |
| Langchain (Base de Données)   | Formulaires administrateur     | Production, multi-agents personnalisés |

------------------------------------------------------------------------

## Activation Globale

Les agents ne sont actifs que si cette variable est définie :

```bash
NUXT_APP_CHATBOT_ENABLED=1
```

### Accès au Serveur MCP de Projects

```bash
NUXT_APP_MCP_SERVER_URL=<PROJECTS_FRONTEND_URL>/mcp/
```

> **Note :** Remplacez `<PROJECTS_FRONTEND_URL>` par l'URL réelle de
> votre instance Projects.

------------------------------------------------------------------------

## Trois Types de Configuration

### 1. Agent Entièrement Géré via OpenAI ⚠️

**Restriction :** Cette configuration n'est disponible que pour
l'**agent général**.

#### Paramètres OpenAI

```bash
# Clé API OpenAI
NUXT_APP_OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Identifiant et version d'un prompt créé sur la plateforme OpenAI
NUXT_APP_OPENAI_API_PROMPT_ID=pmpt_XXXXXXXXXXXXX
NUXT_APP_OPENAI_API_PROMPT_VERSION= # Laisser vide pour utiliser la dernière version

# Optionnellement : identifiant d'un vecteur store pour le RAG
NUXT_APP_OPENAI_API_VECTOR_STORE_ID=vs_XXXXXXXXXXXXX
```

#### Backend Chatbot

Pour ce mode, configurez le backend comme suit :

```bash
NUXT_PUBLIC_APP_CHATBOT_BACKEND=/api/chat-stream
```

------------------------------------------------------------------------

### 2. Agent via Langchain (Variables d'Environnement)

Cette méthode permet une configuration complète via `.env`.

#### Endpoint Backend

```bash
NUXT_PUBLIC_APP_CHATBOT_BACKEND=/api/chat-lg-stream
```

#### Provider d'Inférence

Configurez la clé API du provider choisi (actuellement supportés :
OpenAI, Anthropic, Mistral, Groq) :

```bash
NUXT_APP_LANGCHAIN_MODEL_API_KEY=<votre-clé-api>
```

#### Configuration Complète (.env)

```bash
# Prompt système
NUXT_APP_LANGCHAIN_PROMPT="You are a helpful assistant."

# Température (crée du random, 0 = déterministe)
NUXT_APP_LANGCHAIN_TEMPERATURE=0.7

# Nom complet du modèle avec prefix provider
NUXT_APP_LANGCHAIN_MODEL_NAME=openai:gpt-4o-mini

# Clé API (dupliquée ici pour simplicité, ou utilisez MODEL_API_KEY global ci-dessus)
NUXT_APP_LANGCHAIN_MODEL_API_KEY=<votre-clé-api>
```

------------------------------------------------------------------------

### 3. Agents Spécialisés (Configuration Administrateur) ✅ Recommandé pour la production

Ces agents sont créés via des formulaires dédiés par les
administrateurs. Le chatbot \"général\" peut être rattaché à ces agents
spécialisés depuis le panel admin.

#### Base de Données PostgreSQL Requis

Configuration de la connexion :

```bash
NUXT_APP_CHATBOT_PROMPT_DB=postgresql://username:password@host:port/database
```

#### Initialisation de la Base

La base doit être initialisée manuellement **(une seule fois, quel que
soit le nombre de pods accédant)** :

```bash
prisma --config ./prisma-chatbot-db/prisma-config.ts migrate deploy
```

⚠️ À exécuter à chaque évolution du schéma (migration).

#### Endpoint Backend

```bash
NUXT_PUBLIC_APP_CHATBOT_BACKEND=/api/chat-lg-stream
```

#### Multi-Provider API Keys

Vous pouvez ajouter plusieurs clés API pour différents providers :

```bash
NUXT_APP_LANGCHAIN_EXTRA_MODEL_API_KEYS='{
  "openai": "sk-proj-....",
  "groq": "gsk_....",
  "anthropic": "sk-ant-...."
}'
```

**Important :**

-   Utilisez le format JSON valide
-   Les guillemets doivent échapper correctement pour les valeurs
    multilignes
-   La correspondance se fait par préfixe provider dans le nom du modèle

#### Modèles Suggérés (Liste pour Admins)

```bash
NUXT_PUBLIC_APP_LLM_MODEL_SUGGESTIONS="openai:gpt-4o-mini|openai:gpt-4o|openai:gpt-5-nano|openai:gpt-5-mini|openai:gpt-5|openai:gpt-5.4-nano|openai:gpt-5.4-mini|openai:gpt-5.4"
```

#### Activation de la Fonctionnalité

```bash
NUXT_PUBLIC_APP_HAS_CHATBOT_PROMPT_DB=1
```
------------------------------------------------------------------------

### Note sur les Modèles dans Langchain 🔗

Nous supportons plusieurs providers (OpenAI, Mistral, Groq, Anthropic).

Le nom du modèle (`NUXT_APP_LANGCHAIN_MODEL_NAME`) doit être précédé du
**code provider**, par exemple :

| Provider    | Préfixe        | Exemple Complet |
| ----------- | -------------- | -------------------------------- |
| OpenAI      | `openai:`      | `openai:gpt-4o-mini` |
| Anthropic   | `anthropic:`   | `anthropic:claude-3-sonnet` |
| Groq        | `groq:`        | `groq:mixtral-8x7b-32768` |
| Mistral     | `mistral:`     | `mistral:mistral-large-latest` |

**Références officielles :**

-   Liste des préfixes : [LangChain.js Universal Chat
    Models](https://github.com/langchain-ai/langchainjs/blob/main/libs/langchain/src/chat_models/universal.ts)
-   Documentation intégrations : [LangChain JavaScript Chat
    Integrations](https://docs.langchain.com/docs/components/chat-models)

------------------------------------------------------------------------

## Gestion de la Mémoire 🧠

Pour limiter la consommation de tokens, vous pouvez restreindre le
nombre de messages précédents envoyés au moteur d'inférence :

```bash
# Défaut : 0 (tout l'historique)
# Valeurs > 0 limitent au nombre de messages spécifié
NUXT_APP_AGENT_MEMORY_SLIDING_WINDOW_SIZE=30
```

> **Important :** Tous les messages restent néanmoins conservés en base
> de données ; ce paramètre affecte uniquement ce qui est envoyé au
> provider d'inférence.

------------------------------------------------------------------------

## Vector Store RAG

⚠️ **Compatibilité :** Cette fonctionnalité ne fonctionne qu'avec
l'environnement **Langchain**.

### Configuration PostgreSQL + pgvector

Ajoutez une base PostgreSQL avec l'extension `pgvector` activée :

```bash
# URL de connexion à la base vectorielle
NUXT_APP_VECTOR_DB_URL=postgresql://user:pass@host:5432/vector_db

# Nom de la table contenant les collections/embeddings
NUXT_APP_VECTOR_TABLE_NAME=my_collection
```

### Modèle d'Embedding 🎯

Actuellement seul **OpenAI** est supporté pour les embeddings :

```bash
NUXT_APP_VECTOR_EMBEDDING_MODEL=text-embedding-3-small
NUXT_APP_VECTOR_EMBEDDING_API_KEY=sk-proj-....

# Doit correspondre aux dimensions du modèle choisie
NUXT_APP_VECTOR_EMBEDDING_DIMENSIONS=1536
```

### Prompt d'Outil de Recherche RAG

Ce prompt guide l'agent sur quand utiliser le RAG :

```bash
NUXT_APP_VECTOR_TOOL_PROMPT="Utilisez cet outil systématiquement pour rechercher dans la base de connaissances"
```

### Activation

```bash
NUXT_PUBLIC_APP_HAS_CHATBOT_PROMPT_DB=1
```

> **Remarque :** Ce même flag active également la base de prompts pour
> les agents spécialisés. Une installation unique suffit même si
> multiple services y accèdent simultanément.

------------------------------------------------------------------------

## Tracing Debugging

### Logs In-App (Débogage Local)

Activés par défaut à `false`, débruitable en production :

```bash
# Langchain traces
NUXT_APP_LANGCHAIN_TRACE=1

# Serveur MCP de Projects
NUXT_APP_MCP_SERVER_TRACE=1

# Middleware mémoire Langchain
NUXT_APP_AGENT_MEMORY_TRACE=1

# SorboBot API
NUXT_APP_SORBOBOT_API_TRACE=1
```

### Traces dans LangSmith ☁️

Prérequis : créer un compte sur
[LangSmith](https://smith.langchain.com/)

⚠️ Pour le RGPD, privilégiez l'endpoint EU :

```bash
LANGSMITH_TRACING=true

# Endpoint Europe (RGPD-friendly) ou US
LANGSMITH_ENDPOINT=https://eu.api.smith.langchain.com

# Clé API LangSmith
LANGSMITH_API_KEY=lsv2_...

# Nom du projet pour le grouping des traces
LANGSMITH_PROJECT=projects-chatbot
```

------------------------------------------------------------------------

## FAQ Troubleshooting

| Problème                           |  Solution Possible |
| ---------------------------------- | ---------------------------------------------------------- |
| Agent non actif                    | Vérifier `NUXT_APP_CHATBOT_ENABLED=1` |
| Erreur connection DB Vectorielle   | Vérifier extension `pgvector` installée |
| Modèle introuvable                 | Vérifier prefix provider (`openai:`, `anthropic:`...) |
| Tokens limités rapidement          | activer ou diminuer `MEMORY_SLIDING_WINDOW_SIZE` |
| Embeddings non chargés             | Vérifier compatibilité dimensions `EMBEDDING_DIMENSIONS` |
