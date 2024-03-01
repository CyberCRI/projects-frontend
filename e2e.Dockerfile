FROM node:20

WORKDIR /app

ARG PLAYWRIGHT_VERSION=1.42.0

COPY playwright.config.ts playwright.config.ts

COPY tests/playwright tests/playwright

RUN npx -y "playwright@${PLAYWRIGHT_VERSION}" install --with-deps \
  && npx -y "playwright@${PLAYWRIGHT_VERSION}" install-deps

