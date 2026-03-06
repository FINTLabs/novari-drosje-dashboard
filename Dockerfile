FROM node:25-alpine AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
