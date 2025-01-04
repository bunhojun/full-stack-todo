FROM node:22.11.0-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --silent --force

COPY . .
RUN yarn build
COPY dist .

EXPOSE 3000
ENTRYPOINT ["yarn"]
CMD ["start:dev"]
