FROM node:20

ARG PLAYWRIGHT_VERSION=1.42.1

WORKDIR /app

COPY playwright.config.ts playwright.config.ts
COPY devops-toolbox/scripts/secrets-entrypoint.sh ./secrets-entrypoint.sh

RUN apt-get update && \
  apt-get install -y jq bash && \
  rm -rf /var/lib/apt/lists/*

RUN npx -y playwright@${PLAYWRIGHT_VERSION} install --with-deps && \
  chown -R 10000:10000 /app

COPY tests/playwright tests/playwright

USER 10000

ENTRYPOINT [ "./secrets-entrypoint.sh" ]
