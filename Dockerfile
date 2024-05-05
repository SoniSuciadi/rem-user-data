FROM node:21-alpine
WORKDIR /app

RUN apk add --no-cache

COPY . .

ARG PG_HOST \
    PG_PORT \
    PG_USER \
    PG_PASSWORD \
    PG_DATABASE

ENV PORT=4000 \
    NODE_ENV=production

RUN yarn config set network-timeout 600000 
RUN yarn install --production=true --verbose

RUN yarn add sharp --ignore-engines

EXPOSE 4000

CMD [ "yarn", "start" ]