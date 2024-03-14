FROM node:20

WORKDIR /app

COPY playwright.config.ts playwright.config.ts
COPY tests/playwright tests/playwright
COPY package.json source-package.json
COPY devops-toolbox/scripts/secrets-entrypoint.sh ./secrets-entrypoint.sh

RUN apt-get update && \
  apt-get install -y jq bash && \
  rm -rf /var/lib/apt/lists/*

RUN jq 'del(.dependencies,.husky,."lint-staged",.scripts.prepare)  | .devDependencies |= {"@playwright/test":."@playwright/test", "dotenv":.dotenv}' source-package.json > package.json && \
  yarn --frozen-lockfile && \
  yarn run playwright install chrome --with-deps && \
  rm source-package.json && \
  # Bug with npm cache
  npm cache clean --force && \
  mkdir -p /.npm && \
  chown -R 10000:10000 /.npm && \
  # /Bug with npm cache
  chown -R 10000:10000 /app

USER 10000

ENTRYPOINT [ "./secrets-entrypoint.sh" ]
