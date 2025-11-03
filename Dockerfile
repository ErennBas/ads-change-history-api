FROM node:18-alpine

WORKDIR /app

# package.json ve package-lock.json'ı kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm i

# Uygulama dosyalarını kopyala
COPY . .

# Port
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "server.js"]

