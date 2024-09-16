FROM node:lts-alpine

RUN npm install -g npm@8.4.0

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY . .

ARG ENV_FILE=.env
COPY enviroments/${ENV_FILE} ./.env
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
RUN echo "SENTRY_AUTH_TOKEN"
RUN echo $SENTRY_AUTH_TOKEN
# Building app
RUN npm run build
RUN rm -rf pages
RUN rm -rf components
RUN rm -rf config
RUN rm -rf context
RUN rm -rf data
RUN rm -rf deploy
RUN rm -rf docker
RUN rm -rf enviroments
RUN rm -rf hooks
RUN rm -rf locales
RUN rm -rf plop-templates
RUN rm -rf styles
RUN rm -rf types
RUN rm -rf utils
RUN rm -rf *.yml
RUN rm -rf *.ts
RUN rm -rf *.js
RUN rm -rf *.sh
RUN rm -rf *.md
EXPOSE 8080/tcp

# Running the app
CMD [ "npm", "run", "start" ]
