# Hafif bir Node.js sürümü kullanıyoruz
FROM node:18-alpine

# Çalışma dizinini oluştur
WORKDIR /app

# Paket dosyalarını kopyala
COPY package.json .

# Bağımlılıkları yükle
RUN npm install

# Tüm proje dosyalarını kopyala
COPY . .

# Uygulamanın çalışacağı portu dışarı aç (expose)
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "server.js"]
