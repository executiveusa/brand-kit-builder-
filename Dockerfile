FROM node:22-alpine AS web-build
WORKDIR /build/apps/web
COPY apps/web/package.json ./package.json
RUN npm install --no-audit --no-fund
COPY apps/web/ ./
RUN npm run build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8788 \
    PAULI_BRAND_STUDIO_ROOT=/app \
    PARE_WEB_DIST=/app/apps/web/dist
WORKDIR /app
COPY --chown=node:node interfaces/ ./interfaces/
COPY --chown=node:node studio/ ./studio/
COPY --from=web-build --chown=node:node /build/apps/web/dist ./apps/web/dist
USER node
EXPOSE 8788
CMD ["node", "interfaces/rest/server.mjs"]
