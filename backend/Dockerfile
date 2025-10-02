# Gunakan image resmi Node.js versi 18-alpine sebagai dasar
FROM node:18-alpine

# Tetapkan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan caching Docker, sehingga 'npm install' hanya berjalan jika dependensi berubah
COPY package*.json ./

# Instal dependensi proyek
RUN npm install

# Salin semua sisa kode proyek ke dalam direktori kerja
COPY . .

# Jalankan proses build TypeScript ke JavaScript
RUN npm run build

# Ekspos port 3001, tempat aplikasi NestJS akan berjalan
EXPOSE 3001

# Perintah yang akan dijalankan saat container dimulai
# Menjalankan aplikasi dalam mode development dengan watch
CMD ["npm", "run", "start:dev"]