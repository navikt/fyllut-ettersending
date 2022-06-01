FROM node:16.15.0-alpine
ENV NODE_ENV production
ENV PORT 8080
WORKDIR /app

COPY node_modules node_modules
COPY package.json package.json
COPY server.js server.js
COPY public public

CMD ["node", "server.js"]

EXPOSE 8080
