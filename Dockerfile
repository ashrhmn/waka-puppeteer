FROM node:16-alpine3.14 as builder

WORKDIR /app
# RUN apt update && apt install -y chromium
COPY package.json .
COPY yarn.lock .
COPY puppeteer.config.cjs .
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:16-alpine3.14

WORKDIR /app
# RUN apt update && apt install -y chromium
COPY package.json .
COPY yarn.lock .
COPY puppeteer.config.cjs .
RUN yarn install --frozen-lockfile --production
COPY --from=builder /app/dist/. .

EXPOSE 4000

CMD ["node", "index.js"]