FROM node:18-alpine AS deps

WORKDIR /app

ARG NPM_REGISTRY=https://nexus.boxisoft.ir/repository/npm-group/
RUN npm config set registry ${NPM_REGISTRY}

COPY package.json package-lock.json ./
RUN npm install --force

FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG ENV_NAME=production
RUN npm config set registry ${NPM_REGISTRY} && npm run build:$ENV_NAME

FROM nginx:1.21.0-alpine AS runner

RUN addgroup -g 1001 -S nodejs \
  && adduser -S react -u 1001 -G nodejs

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R react:nodejs /usr/share/nginx/html
USER react

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]