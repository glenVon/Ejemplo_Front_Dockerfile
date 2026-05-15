# Etapa 1: Construcción (Build Stage)
FROM node:18-alpine AS builder
WORKDIR /app

# Copiamos solo los archivos de dependencias primero para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y construimos la aplicación
COPY . .
RUN npm run build 
# Nota: Si tu proyecto usa Vite en lugar de Create React App, 
# cambia la carpeta de destino abajo de /app/build a /app/dist

# Etapa 2: Producción (Production Stage)
FROM nginx:stable-alpine

# Limpiamos la carpeta por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos los archivos compilados desde la Etapa 1
COPY --from=builder /app/build /usr/share/nginx/html

# Exponemos el puerto 80 (el que abrimos en el Security Group de AWS)
EXPOSE 80

# Comando por defecto de Nginx
CMD ["nginx", "-g", "daemon off;"]
