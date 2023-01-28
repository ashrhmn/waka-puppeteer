FROM node:14-slim as builder

WORKDIR /app
# RUN apt update && apt install -y chromium
COPY package.json .
COPY yarn.lock .
# COPY puppeteer.config.cjs .
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:14-slim

RUN apt update
RUN apt install -y wget gnupg
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt update
RUN apt install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /app
# RUN apt update && apt install -y chromium
COPY package.json .
COPY yarn.lock .
COPY puppeteer.config.cjs .
RUN yarn install --frozen-lockfile --production
COPY --from=builder /app/dist/. .

EXPOSE 4000

CMD ["node", "index.js"]
