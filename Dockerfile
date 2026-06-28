FROM node:18-alpine AS build


# Crear usuario no-root
RUN addgroup -g 1001 -S nodegroup && \
    adduser -S nodeuser -G nodegroup -u 1001

WORKDIR /app

# Cambiar propietario
COPY --chown=nodeuser:nodegroup . .

USER nodeuser

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]