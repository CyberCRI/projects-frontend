#!/bin/bash

# Usage: ./dl-openai-file.sh <vector_store_id> <file_id>
# Example: ./dl-openai-file.sh vs_1234567890abcdef file-abcdef
# orto get only text content:
# ./utilities/dl-openai-file.sh vs_1234567890abcdef file-abscdef | jq -r '.data.[0].text' > "../Definition of each Grid principle.docx.txt"

curl \
https://api.openai.com/v1/vector_stores/$1/files/$2/content \
-H "Authorization: Bearer $NUXT_APP_OPENAI_API_KEY"