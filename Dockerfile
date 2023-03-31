FROM node:alpine AS base
RUN yarn global add turbo
WORKDIR /app
COPY . .

FROM base AS builder-api
RUN turbo prune --scope=api --docker

FROM node:alpine AS installer-api
WORKDIR /app

# first install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder-api /app/out/json/ .
COPY --from=builder-api /app/out/yarn.lock ./yarn.lock
RUN yarn install

# build the project
COPY --from=builder-api /app/out/full/ .
RUN yarn turbo run build --filter=api

FROM node:alpine AS runner-api
WORKDIR /app

USER node
COPY --from=installer-api /app/apps/api/package.json .
COPY --from=installer-api --chown=node:node /app/node_modules/ ./node_modules
COPY --from=installer-api --chown=node:node /app/apps/api/build/src .
COPY --from=installer-api --chown=node:node /app/apps/api/prisma ./prisma
COPY --from=installer-api --chown=node:node /app/apps/api/keys ./keys

CMD node app.js
