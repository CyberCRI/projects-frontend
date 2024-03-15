FROM node:20

ARG PLAYWRIGHT_VERSION=1.42.1

WORKDIR /app

COPY playwright.config.ts playwright.config.ts
COPY package.json source-package.json
COPY devops-toolbox/scripts/secrets-entrypoint.sh ./secrets-entrypoint.sh

RUN apt-get update && \
  apt-get install -y jq bash && \
  rm -rf /var/lib/apt/lists/*

RUN jq 'del(.dependencies,.husky,."lint-staged",.scripts.prepare)  | .devDependencies |= {"@playwright/test":."@playwright/test", "dotenv":.dotenv}' source-package.json > package.json && \
  yarn && \
  yarn --list && \
  npx -y playwright install --with-deps && \
  npx -y playwright install chrome && \
  chown -R 10000:10000 /app && \
  # Bug with npm cache
  npm cache clean --force && \
  mkdir -p /.npm && \
  chown -R 10000:10000 /.npm && \
  # /Bug with npm cache
  rm /app/source-package.json

COPY tests/playwright tests/playwright

USER 10000

ENTRYPOINT [ "./secrets-entrypoint.sh" ]
