FROM node:16-alpine3.14 as builder

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY puppeteer.config.cjs .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:16-alpine3.14

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY puppeteer.config.cjs .
RUN yarn install --frozen-lockfile --production
COPY --from=builder /app/dist/ .

CMD ["node", "index.js"]