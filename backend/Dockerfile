# .nvmrc is the source of truth for the Node version. FROM cannot read a file,
# so the version is repeated here — change both together.
ARG NODE_VERSION=24.21.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# dev — the TypeScript watcher. docker-compose.yml bind-mounts the source over
# /app for hot reload; the node_modules installed here is kept visible by an
# anonymous volume.
FROM base AS dev
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

# build — the dev image plus a compile. Only its dist/ is carried forward.
FROM dev AS build
RUN npm run build

# prod — compiled output and production dependencies only: no source, no
# TypeScript, no dev dependencies.
FROM base AS prod
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
CMD ["node", "dist/server.js"]
