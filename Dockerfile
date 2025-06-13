FROM node:lts AS base
WORKDIR /usr/local/app

FROM base AS client-base
COPY client/package* ./
RUN npm install
COPY client/eslint.config.js client/index.html client/vite.config.js ./
COPY client/public ./public
COPY client/src ./src

FROM client-base AS client-dev
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM client-base AS client-build
ENV NODE_ENV=production
RUN npm run build

######### API SETUP #########

FROM base AS api-base
COPY api/package* ./

FROM api-base AS api-dev
ENV NODE_DENV=development
RUN npm install
COPY api/src ./src
CMD ["npm", "run", "dev"]

########## FINAL STAGE ##########

FROM api-base AS final
ENV NODE_ENV=production
RUN npm ci --production
COPY --link --from=client-build /usr/local/app/dist ./static
COPY --link api/src ./src
CMD ["node", "src/index.js"]
