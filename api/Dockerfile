# Build Stage
FROM node:22.11.0-slim AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --silent --force

COPY . .
RUN yarn build

# Runtime Stage
FROM node:22.11.0-slim

WORKDIR /app

COPY --from=build /app/dist/src ./dist/src

COPY package.json yarn.lock ./
RUN yarn install --silent --force --production

EXPOSE 3000
CMD ["node", "dist/src/main.js"]