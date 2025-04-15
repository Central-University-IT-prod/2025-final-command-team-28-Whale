FROM node:20.15.0-alpine AS builder
RUN mkdir -p /tmp/app
WORKDIR /tmp/app
COPY ./ ./
RUN npm install
RUN npm run build

FROM nginx:1.27.4-alpine
WORKDIR /var/www/app
COPY --from=builder /tmp/app/dist/ /usr/share/nginx/html
COPY --from=builder /tmp/app/nginx.conf /etc/nginx/nginx.conf
