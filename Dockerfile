# ---- Base ----
FROM node:14-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . /app

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]