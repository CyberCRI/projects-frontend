FROM node:20-alpine

WORKDIR /app

COPY playwright.config.ts playwright.config.ts

COPY tests/playwright tests/playwright
COPY package.json source-package.json
COPY devops-toolbox/scripts/secrets-entrypoint.sh ./secrets-entrypoint.sh

RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache jq bash

RUN jq 'del(.dependencies,.husky,."lint-staged",.scripts.prepare)  | .devDependencies |= {"@playwright/test":."@playwright/test", "dotenv":.dotenv}' source-package.json > package.json && \
    npm install -D && \
    rm source-package.json

ENTRYPOINT [ "./secrets-entrypoint.sh" ]
