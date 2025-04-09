FROM node:23-alpine AS builder

WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY app/ .

RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
