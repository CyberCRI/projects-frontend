ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-alpine AS base

ARG PORT=3000

WORKDIR /app
RUN apk add --no-cache bash

FROM base AS builder

WORKDIR /app
COPY --link package.json yarn.lock ./


RUN yarn install --pure-lockfile --non-interactive

COPY . .

RUN yarn prisma-chatbot-db:generate
RUN NODE_ENV=production yarn build

FROM base

COPY --from=builder /app/.output /app/.output
COPY devops-toolbox/scripts/secrets-entrypoint.sh ./secrets-entrypoint.sh


COPY --from=builder /app/prisma-chatbot-db/schema.prisma ./prisma-chatbot-db/schema.prisma
COPY --from=builder /app/prisma-chatbot-db/migrations ./prisma-chatbot-db/migrations

EXPOSE ${PORT}

ENTRYPOINT [ "./secrets-entrypoint.sh" ]

CMD [ "node", ".output/server/index.mjs" ]
