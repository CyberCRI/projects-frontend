#!/bin/bash
DIM=$'\033[2m'
RESET=$'\033[0m'

cat <<EOF
${DIM}
------------------------------------------------------------------------
|        ** GENERATE MCP KEY ENCRYPTION SECRET **                      |
| Mind that NUXT_APP_AGENT_SECRET_KEYS expect a json object            |
| with secret key indexed by a version number:                         |
|                                                                      |
|   NUXT_APP_AGENT_SECRET_KEYS='{"1": "abcdef", "2": "THE_NEW_KEY"}'   |
|                                                                      |
| Here is your new little secret... Hush, hush...                      |
------------------------------------------------------------------------
${RESET}
EOF

openssl rand -base64 32
