# Sistem Manajemen Pembayaran Air Yayasan Pongangan Indah

Ini adalah aplikasi full-stack untuk mengelola pencatatan meter, pembuatan tagihan, dan pembayaran iuran air untuk warga Yayasan Pongangan Indah.

## Tumpukan Teknologi

-   **Backend:** NestJS, TypeScript, Prisma, PostgreSQL
-   **Frontend Web:** Next.js, TypeScript, Tailwind CSS, Shadcn/UI
-   **Frontend Mobile:** React Native (Expo)
-   **Database:** PostgreSQL (dijalankan melalui Docker)
-   **DevOps:** Docker, GitHub Actions

---

## Cara Menjalankan Aplikasi (Lingkungan Pengembangan)

### 1. Prasyarat

-   Pastikan Anda telah menginstal [Docker](https://www.docker.com/products/docker-desktop/) dan [Node.js](https://nodejs.org/) (versi 18 atau lebih tinggi).
-   Memiliki `npm` atau `yarn` sebagai package manager.

### 2. Menjalankan Backend & Database

Backend dan database dijalankan bersamaan menggunakan Docker Compose untuk kemudahan.

1.  **Buat File Environment:**
    Di dalam direktori `backend/`, buat file baru bernama `.env` dan isi dengan konfigurasi berikut:
    ```env
    # URL Koneksi ke Database PostgreSQL di Docker
    DATABASE_URL="postgresql://user:password@db:5432/sistem_air_db?schema=public"

    # Kunci rahasia untuk menandatangani JSON Web Tokens (JWT)
    JWT_SECRET="rahasia-yang-sangat-aman-dan-panjang"
    ```

2.  **Jalankan Docker Compose:**
    Dari direktori **root** proyek, jalankan perintah:
    ```bash
    docker-compose up -d --build
    ```
    Perintah ini akan membangun image backend dan menjalankan kontainer untuk backend dan database di latar belakang.

3.  **Instalasi Dependensi (jika belum):**
    ```bash
    cd backend
    npm install
    ```

4.  **Migrasi & Seeding Database:**
    Setelah kontainer berjalan, jalankan perintah berikut dari dalam direktori `backend/` untuk menyiapkan skema database dan mengisi data awal.
    ```bash
    # Menerapkan migrasi skema ke database
    npx prisma migrate dev

    # Mengisi database dengan data warga awal dari file CSV
    npx prisma db seed
    ```

5.  **Verifikasi Backend:**
    Backend sekarang seharusnya berjalan. Anda dapat mengaksesnya di `http://localhost:3000`.

### 3. Menjalankan Frontend Web (Admin & Warga)

1.  **Pindah Direktori & Instal Dependensi:**
    ```bash
    cd frontend-web
    npm install
    ```

2.  **Jalankan Server Pengembangan:**
    ```bash
    npm run dev
    ```
    Aplikasi web sekarang akan berjalan di `http://localhost:3001`.

### 4. Menjalankan Frontend Mobile (Petugas Pencatat)

1.  **Pindah Direktori & Instal Dependensi:**
    ```bash
    cd frontend-mobile
    npm install
    ```

2.  **Jalankan Expo Metro Bundler:**
    ```bash
    npm start
    ```
    Ini akan membuka jendela browser dengan QR code.

3.  **Buka di Ponsel Anda:**
    -   Instal aplikasi **Expo Go** dari App Store atau Google Play Store.
    -   Pastikan ponsel dan komputer Anda terhubung ke jaringan Wi-Fi yang sama.
    -   Scan QR code menggunakan aplikasi Expo Go.

---

## Kredensial Login Default

Database di-seed dengan data berikut yang bisa Anda gunakan untuk login:

-   **Peran: ADMIN**
    -   **Email:** `admin@yayasan.local`
    -   **Password:** `password123`
    -   **Akses:** Gunakan kredensial ini di **aplikasi web** (`http://localhost:3001`) untuk mengakses dashboard admin.

-   **Peran: PETUGAS_PENCATAT**
    -   **Email:** `petugas@yayasan.local`
    -   **Password:** `password123`
    -   **Akses:** Gunakan kredensial ini di **aplikasi mobile** (Expo Go) untuk mengakses fitur pencatatan meter.

-   **Peran: WARGA**
    -   Database diisi dengan banyak data warga dari file CSV. Anda bisa menggunakan salah satu dari data tersebut.
    -   **Contoh Email:** `01010001@yayasan.local` (berdasarkan `nomor_rekening` di CSV)
    -   **Password (untuk semua warga):** `password123`
    -   **Akses:** Gunakan kredensial ini di **aplikasi web** (`http://localhost:3001`) untuk melihat tagihan pribadi.