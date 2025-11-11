FROM node:20-alpine

WORKDIR /app
COPY *.json .
COPY libs libs

RUN npm install -g @nestjs/cli
# RUN npm i
