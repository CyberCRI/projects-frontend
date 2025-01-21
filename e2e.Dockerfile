FROM node:22

ARG PLAYWRIGHT_VERSION=1.46.1

WORKDIR /app

COPY playwright.config.ts playwright.config.ts
COPY devops-toolbox/scripts/secrets-entrypoint.sh ./secrets-entrypoint.sh

RUN npm install @playwright/test@${PLAYWRIGHT_VERSION} dotenv  && \
  # Bug with npm cache
  npm cache clean --force && \
  mkdir -p /.npm && \
  chown -R 10000:10000 /.npm && \
  # /Bug with npm cache
  chown -R 10000:10000 /app &&\
  npx -y playwright install --only-shell &&\
  mkdir /.cache &&\
  # Playwright installs in root user's folder, move it to root dir
  mv /root/.cache/ms-playwright /.cache/ &&\
  chown -R 10000:10000 /.cache/

COPY tests/playwright tests/playwright

USER 10000

ENTRYPOINT [ "./secrets-entrypoint.sh" ]
