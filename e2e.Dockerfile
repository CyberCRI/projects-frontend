FROM node:20

WORKDIR /app

COPY playwright.config.ts playwright.config.ts
COPY package.json source-package.json
COPY devops-toolbox/scripts/secrets-entrypoint.sh ./secrets-entrypoint.sh

RUN apt-get update && \
  apt-get install -y jq bash && \
  rm -rf /var/lib/apt/lists/*

RUN jq 'del(.dependencies,.husky,."lint-staged",.scripts.prepare)  | .devDependencies |= {"@playwright/test":."@playwright/test", "dotenv":.dotenv}' source-package.json > package.json && \
  yarn config set cache-folder /app/.yarn-cache && \
  yarn --frozen-lockfile && \
  yarn playwright install  && \
  yarn playwright install-deps && \
  rm source-package.json && \
  chown -R 10000:10000 /app

COPY tests/playwright tests/playwright

USER 10000

ENTRYPOINT [ "./secrets-entrypoint.sh" ]
