# 🚀 Panduan Instalasi Cepat - WebGIS Futsal Padang

## Langkah 1: Persiapan

### Install Software yang Dibutuhkan:
1. **Node.js** (v18+): https://nodejs.org/
2. **MySQL** (v8.0+): https://www.mysql.com/
3. **Git**: https://git-scm.com/

---

## Langkah 2: Setup Database

### Buka MySQL Client (cmd/terminal):
```bash
mysql -u root -p
```

### Jalankan perintah berikut:
```sql
CREATE DATABASE futsal_db;
USE futsal_db;
SOURCE futsal_db.sql;
EXIT;
```

Atau menggunakan phpMyAdmin:
1. Buka phpMyAdmin
2. Klik "New" untuk buat database baru
3. Nama: `futsal_db`, Collation: `utf8mb4_general_ci`
4. Klik tab "Import"
5. Pilih file `futsal_db.sql`
6. Klik "Go"

---

## Langkah 3: Konfigurasi Aplikasi

### Edit file `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Isi dengan password MySQL Anda
DB_NAME=futsal_db
DB_PORT=3306

SESSION_SECRET=futsal_secret_key_2025

PORT=3000
NODE_ENV=development
```

---

## Langkah 4: Install Dependencies

```bash
cd webgis-futsal
npm install
```

Tunggu hingga selesai (sekitar 1-2 menit).

---

## Langkah 5: Jalankan Aplikasi

### Mode Development (recommended untuk testing):
```bash
npm run dev
```

### Mode Production:
```bash
npm start
```

Aplikasi akan berjalan di: **http://localhost:3000**

---

## 🎉 Aplikasi Siap Digunakan!

### Akses Admin:
- URL: http://localhost:3000/login
- Username: `admin`
- Password: `admin123`

### Fitur yang Bisa Dicoba:
1. ✅ Lihat peta dan daftar lapangan
2. ✅ Klik "Cari Terdekat" (butuh GPS)
3. ✅ Klik detail lapangan
4. ✅ Login dan beri rating
5. ✅ Login sebagai admin untuk kelola data

---

## ⚠️ Troubleshooting

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Database connection failed"
- Pastikan MySQL sudah berjalan
- Cek konfigurasi di file `.env`
- Pastikan database `futsal_db` sudah dibuat

### Error: "Port 3000 already in use"
Ubah PORT di file `.env`:
```env
PORT=3001
```

### Error: "bcrypt error" di Windows
```bash
npm rebuild bcrypt --build-from-source
```

---

## 📞 Butuh Bantuan?

Baca dokumentasi lengkap di `README.md`
