FROM node:26-alpine AS build

WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build
