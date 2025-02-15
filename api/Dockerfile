# Build Stage
FROM node:22.11.0-slim AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --silent --force

COPY . .
RUN yarn build && yarn db:migrate

# Runtime Stage
FROM node:22.11.0-slim

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package.json yarn.lock ./
RUN yarn install --silent --force --production # Install only production dependencies

EXPOSE 3000
ENTRYPOINT ["yarn"]
CMD ["start:prod"]
