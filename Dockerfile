ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-alpine as base

ARG PORT=3000

WORKDIR /app

FROM base as builder

WORKDIR /app
COPY --link package.json yarn.lock ./

RUN yarn install --pure-lockfile --non-interactive

COPY . .

RUN NODE_ENV=production yarn build

FROM base

COPY --from=builder /app/.output /app/.output
COPY devops-toolbox/scripts/secrets-entrypoint.sh ./secrets-entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT [ "./secrets-entrypoint.sh" ]

CMD [ "node", ".output/server/index.mjs" ]
