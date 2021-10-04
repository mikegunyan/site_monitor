# --------------> The build image
FROM node:latest AS build
ARG NPM_TOKEN
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
   npm ci --only=production && \
   rm -f .npmrc

# --------------> The production image
# FROM node:lts-alpine@sha256:8c94a0291133e16b92be5c667e0bc35930940dfa7be544fb142e25f8e4510a45
# RUN apk add dumb-init
# ENV NODE_ENV production
# USER node
# WORKDIR /usr/src/app
# COPY --chown=node:node --from=mikegunyan/site_monitor /usr/src/app/node_modules /usr/src/app/node_modules
# COPY --chown=node:node . /usr/src/app
# CMD ["dumb-init", "node", "server/index.js"]