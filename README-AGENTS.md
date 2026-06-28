# Agents setup in Projects


La couche agent conversationnel de Projects est constituée :
- d'un serveur mcp ayant accès (en lecture) aux données de Projects
- d'une base de donnée vectorielle pour l'indexation sémantique de documents (faq...)
- d'agent proprement dit
  - un agent "général" accessible dans toutes les pages via un bouton flottant
  - des agents spécialisé configurable par les admins

## Environnement pour les agents

En raison de l'évolution du code et de la nécessité de maintenir le fonctionnement précédent le temps de migrer les plateformes, les agent peuvent avoir trois types de configuration :
- entièrement géré via OpenAI (propmpt, configuration et vector store sur la plateforme openai)
- via Langchain, configuré dans les variables d'environnement
- via Langchain, configuré par les admins ("agents specialisés")


### Général

#### Activation

Les agents ne sont actifs que si cette variable est présente:

```bash
NUXT_APP_CHATBOT_ENABLED=1
```

#### Accès des agents au serveur MCP de Projects

```bash
NUXT_APP_MCP_SERVER_URL=<PROJECTS_FRONTEND_URL>/mcp/
```

### Paramètres des agents

#### Entierement géré dans OpenAI

(cela n'est possible que pour l'agent général)

paramètres d'OpenAI

```bash
# clé d'api
NUXT_APP_OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# identifiant et version d'un prompt créé sur la plateforme opeanai
NUXT_APP_OPENAI_API_PROMPT_ID=pmpt_XXXXXXXXXXXXX
NUXT_APP_OPENAI_API_PROMPT_VERSION= # leave empty for the last version
# optionellement identifiant d'un store pour le RAG
NUXT_APP_OPENAI_API_VECTOR_STORE_ID=vs_XXXXXXXXXXXXX
```

le backend pour le chatbot doit être

```bash
NUXT_PUBLIC_APP_CHATBOT_BACKEND=/api/chat-stream
```


#### Agent langchain via l'environnement

le backend pour le chatbot est

```bash
NUXT_PUBLIC_APP_CHATBOT_BACKEND=/api/chat-lg-stream
```

On configure la clé du provider d'inférence (actuellement OpenAI, Anthropic, Mistral ou Groq)

```bash
NUXT_APP_LANGCHAIN_MODEL_API_KEY=...
```

l'agent et entièrement paramètré dans les `.env`

```bash
NUXT_APP_LANGCHAIN_PROMPT="You are a useful assistant" # system prompt
NUXT_APP_LANGCHAIN_TEMPERATURE=0.7 # temperature
NUXT_APP_LANGCHAIN_MODEL_NAME="openai:gpt-4o-mini"  # model name, see below
NUXT_APP_LANGCHAIN_MODEL_API_KEY=....
```

#### Agent spécialisés


Ces agents sont créé par les admins via des formulaires dédiés.
(le chatbot "général" peut être affecté à un de ces agents via un onglet de l'admin)

Cela nécessite une base de données Postgres, configurée via :

```bash
NUXT_APP_CHATBOT_PROMPT_DB=postgresql://...
```

La base doit être intialisée "à la main" (**Une seule fois, quelque oit le nombre de pods qui y accedent**),
puis à chaque évolution du schéma ("migration") via :

```bash
prisma --config ./prisma-chatbot-db/prisma-config.ts migrate deploy
```

Le backend pour le chatbot est aussi

```bash
NUXT_PUBLIC_APP_CHATBOT_BACKEND=/api/chat-lg-stream
```

et on configure toujours la clé du provider d'inférence (actuellement OpenAI, Anthropic, Mistral ou Groq)

```bash
NUXT_APP_LANGCHAIN_MODEL_API_KEY=...
```

Dans ce contexte (agent spécialisé) on peut éventuellement ajouter d'autres clés d'api (pour les autres providers) via

```bash
NUXT_APP_LANGCHAIN_EXTRA_MODEL_API_KEYS='{
"openai": "sk-proj-....",
"groq:": "gsk_....",
"anthropic": "sk-ant-...."
}'
```

Noter le format JSON et les quotes pour une valeur multiligne.

La clé sera matchée par le provider prefix du nom du modèle.

On peut indiquer une liste de modèles suggérés pour les admin (voir "Note sur les modèles dans langchain")

```bash
NUXT_PUBLIC_APP_LLM_MODEL_SUGGESTIONS="openai:gpt-4o-mini|openai:gpt-4o|openai:gpt-5-nano|openai:gpt-5-mini|openai:gpt-5|openai:gpt-5.4-nano|openai:gpt-5.4-mini|openai:gpt-5.4"
```

Enfin, on active la fonctionalité (agents specialisés) avec :

```bash
NUXT_PUBLIC_APP_HAS_CHATBOT_PROMPT_DB=1
```


#### Note sur les modèles dans langchain

Nous supportons plusieurs providers (actuellement: openai, mistral, groq, anthropic)

Le nom du modèle `NUXT_APP_LANGCHAIN_MODEL_NAME` (ou dans le formulaires pour les agents spécialisé) doit être préfixé du code du provider,
par exemple `openai:` pour OpenAi, ce qui donne le nom complete `openai:gpt-4o-mini`

Voir la liste des préfixes sur https://github.com/langchain-ai/langchainjs/blob/443253bd5336597d3619f2e21a8d5a814202997e/libs/langchain/src/chat_models/universal.ts#L734 et and https://docs.langchain.com/oss/javascript/integrations/chat

#### Gestion de la mémoire dans langchain

Pour limiter le nombre de tokens consommés, le nombre de message précédents de la conversation qui sont envoyés au oteur d'inférence peut être limité via :

```bash
# unset or 0 to use full history
NUXT_APP_AGENT_MEMORY_SLIDING_WINDOW_SIZE=30
```
(Tous les messages restent néanmoins conservés en base de données)


## Vector Store (RAG)

Note: cela ne marche qu'avec l'environnement Langchain.

Il faut ajouter une base postgres (avec l'extension `pgvector` activée) et indiquer la table des collections :

```bash
NUXT_APP_VECTOR_DB_URL=postgresql://...
NUXT_APP_VECTOR_TABLE_NAME='my_collection'
```

On paramètre le modèle d'embedding (**pour l'instant seul OpenAI est supporté**)

```bash
NUXT_APP_VECTOR_EMBEDDING_MODEL=text-embedding-3-small
NUXT_APP_VECTOR_EMBEDDING_API_KEY=sk-proj-....
NUXT_APP_VECTOR_EMBEDDING_DIMENSIONS=1536 # doit matcher les dimensions du modèle d'embedding
```

On indique aussi un prompt pour le l'outil de récupération des données, qui permettra à l'agent de décider quand y faire appel

```bash
NUXT_APP_VECTOR_TOOL_PROMPT="Always use this tool"
```

On peut alors activer la fonctionnalité via

```bash
NUXT_PUBLIC_APP_HAS_CHATBOT_PROMPT_DB=1
```

## Tracing

### In-App

Logs de déboggage (déactivés par défaut)

```bash
# Langchain
NUXT_APP_LANGCHAIN_TRACE='1'
# serveur MCP de Projects
NUXT_APP_MCP_SERVER_TRACE='1'
# memory middlewre de langchain
NUXT_APP_AGENT_MEMORY_TRACE='1'
# Sorbobot
NUXT_APP_SORBOBOT_API_TRACE='1'
```

### Dans Langsmith

Nécessite de créer un compte sur Langsmith.
(Attention à bien choisir "eu" pour les datas et le rgpd)

```bash
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://eu.api.smith.langchain.com # ou https://api.smith.langchain.com
LANGSMITH_API_KEY=lsv2_...
LANGSMITH_PROJECT="my-project"
```
