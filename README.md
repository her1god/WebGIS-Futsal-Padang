# 🗺️ WebGIS Lapangan Futsal Kota Padang

Sistem Informasi Geografis (WebGIS) berbasis web untuk direktori lapangan futsal di Kota Padang. Aplikasi ini menyediakan informasi spasial lapangan futsal dengan peta digital interaktif, pencarian lokasi terdekat menggunakan algoritma Haversine, dan sistem rating dari pengguna.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Express](https://img.shields.io/badge/Express-v4.18-blue)
![MySQL](https://img.shields.io/badge/MySQL-v8.0-orange)
![Leaflet](https://img.shields.io/badge/Leaflet-v1.9-green)

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Folder](#-struktur-folder)
- [Instalasi](#-instalasi)
- [Konfigurasi Database](#-konfigurasi-database)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Penggunaan](#-penggunaan)
- [Algoritma Haversine](#-algoritma-haversine)
- [Keamanan](#-keamanan)
- [Screenshot](#-screenshot)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

### 👤 Fitur Pengguna (User)
- ✅ **Peta Interaktif**: Melihat lokasi lapangan futsal di peta berbasis Leaflet.js
- ✅ **Daftar Lapangan**: Melihat daftar lengkap lapangan futsal dengan detail informasi
- ✅ **Pencarian Terdekat**: Mencari lapangan terdekat dengan algoritma Haversine berdasarkan GPS pengguna
- ✅ **Detail Lapangan**: Informasi lengkap (nama, alamat, harga, fasilitas, jam operasional, rating)
- ✅ **Sistem Rating**: Memberikan rating (1-5 bintang) dan ulasan terhadap lapangan
- ✅ **Autentikasi**: Login dan registrasi akun pengguna

### 👨‍💼 Fitur Admin
- ✅ **Dashboard Admin**: Panel kontrol untuk mengelola sistem
- ✅ **CRUD Lapangan**: Tambah, edit, dan hapus data lapangan futsal
- ✅ **Moderasi Rating**: Melihat dan menghapus rating/ulasan yang tidak pantas
- ✅ **Manajemen Data**: Kelola semua data lapangan dan user review

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** (v18+): Runtime JavaScript
- **Express.js** (v4.18): Web framework
- **MySQL** (v8.0): Database relational
- **bcrypt**: Hashing password
- **express-session**: Session management
- **dotenv**: Environment variable management

### Frontend
- **HTML5**: Struktur halaman web
- **CSS3**: Styling dan layout responsif
- **JavaScript (ES6)**: Interaksi client-side
- **EJS**: Template engine
- **Leaflet.js**: Library peta interaktif
- **Font Awesome**: Icon library

### Arsitektur
- **MVC Pattern** (Model-View-Controller)
- **Clean Code Principles**
- **RESTful API**

---

## 📁 Struktur Folder

```
webgis-futsal/
│
├── public/                    # File statis
│   ├── css/
│   │   └── style.css          # Stylesheet utama
│   ├── js/
│   │   ├── map.js             # Logic peta Leaflet & Haversine
│   │   └── admin.js           # Logic admin dashboard
│   └── images/                # Gambar dan asset
│
├── views/                     # Template EJS
│   ├── index.ejs              # Halaman utama (peta)
│   ├── login.ejs              # Halaman login
│   ├── register.ejs           # Halaman registrasi
│   ├── detailLapangan.ejs     # Detail lapangan
│   └── adminDashboard.ejs     # Dashboard admin
│
├── routes/                    # Definisi rute
│   ├── userRoutes.js          # Rute user
│   └── adminRoutes.js         # Rute admin
│
├── controllers/               # Logika bisnis
│   ├── userController.js      # Controller user
│   └── adminController.js     # Controller admin
│
├── models/                    # Database layer
│   ├── db.js                  # Koneksi database
│   └── lapanganModel.js       # Model & query database
│
├── utils/                     # Helper functions
│   └── haversine.js           # Algoritma Haversine
│
├── app.js                     # File utama aplikasi
├── package.json               # Dependencies
├── .env                       # Environment variables
├── futsal_db.sql              # Database schema
└── README.md                  # Dokumentasi
```

---

## 🚀 Instalasi

### 1. Prasyarat
Pastikan sudah terinstal:
- **Node.js** versi 18 atau lebih tinggi ([Download](https://nodejs.org/))
- **MySQL** versi 8.0 atau lebih tinggi ([Download](https://www.mysql.com/))
- **Git** ([Download](https://git-scm.com/))

### 2. Clone Repository
```bash
cd webgis-futsal
```

### 3. Install Dependencies
```bash
npm install
```

Packages yang akan diinstall:
- express
- mysql2
- bcrypt
- ejs
- dotenv
- express-session
- body-parser

---

## 🗄️ Konfigurasi Database

### 1. Buat Database
Buka MySQL client (phpMyAdmin, MySQL Workbench, atau terminal):

```bash
mysql -u root -p
```

### 2. Import Database Schema
```bash
mysql -u root -p < futsal_db.sql
```

Atau bisa juga import manual:
```sql
SOURCE futsal_db.sql;
```

Database akan membuat:
- **Database**: `futsal_db`
- **Tabel**: `users`, `lapangan_futsal`, `rating`
- **Data Sample**: 6 lapangan futsal di Kota Padang
- **Admin Default**: username=`admin`, password=`admin123`

### 3. Konfigurasi Environment Variables

Edit file `.env` sesuai konfigurasi MySQL Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=futsal_db
DB_PORT=3306

# Session Secret
SESSION_SECRET=futsal_secret_key_2025

# Server Configuration
PORT=3000
NODE_ENV=development
```

---

## ▶️ Menjalankan Aplikasi

### Development Mode (dengan auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server akan berjalan di: **http://localhost:3000**

### Output Console
```
========================================
🚀 WebGIS Futsal Padang Server Started
========================================
📍 Server running on: http://localhost:3000
🌍 Environment: development
📅 Started at: [tanggal dan waktu]
========================================

📖 Available Routes:
   - http://localhost:3000/ (Home)
   - http://localhost:3000/login (Login)
   - http://localhost:3000/register (Register)
   - http://localhost:3000/admin/dashboard (Admin Dashboard)

💡 Tips:
   - Default admin: username=admin, password=admin123
   - Tekan Ctrl+C untuk menghentikan server
========================================
```

---

## 📖 Penggunaan

### 🏠 Halaman Utama
1. Buka browser dan akses: `http://localhost:3000`
2. Peta akan menampilkan lokasi lapangan futsal di Kota Padang
3. Klik marker di peta untuk melihat info lapangan
4. Klik card lapangan di sidebar untuk zoom ke lokasi

### 📍 Fitur Pencarian Terdekat
1. Klik tombol **"Cari Terdekat"** di sidebar
2. Browser akan meminta izin akses lokasi GPS
3. Setelah diizinkan, sistem akan:
   - Menampilkan marker merah di lokasi Anda
   - Menghitung jarak ke semua lapangan (menggunakan Haversine)
   - Mengurutkan lapangan berdasarkan jarak terdekat
   - Menampilkan jarak dalam kilometer

### 🔐 Login & Registrasi
**Registrasi Pengguna Baru:**
1. Klik **"Register"** di navbar
2. Isi form: username, email, password
3. Klik **"Daftar"**
4. Redirect ke halaman login

**Login:**
1. Klik **"Login"** di navbar
2. Masukkan username dan password
3. User biasa → redirect ke home
4. Admin → redirect ke admin dashboard

**Kredensial Admin Default:**
- Username: `admin`
- Password: `admin123` (Ganti setelah login pertama!)

### ⭐ Memberikan Rating
1. Login terlebih dahulu
2. Buka halaman detail lapangan
3. Pilih rating (1-5 bintang)
4. Tulis ulasan (opsional)
5. Klik **"Kirim Rating"**

### 👨‍💼 Dashboard Admin
1. Login sebagai admin
2. Akses: `http://localhost:3000/admin/dashboard`

**Kelola Lapangan:**
- **Tambah**: Klik tombol "Tambah Lapangan", isi form, simpan
- **Edit**: Klik icon edit, ubah data, simpan
- **Hapus**: Klik icon hapus, konfirmasi

**Moderasi Rating:**
- Lihat semua rating dari user
- Hapus rating yang tidak pantas

---

## 🧮 Algoritma Haversine

Algoritma Haversine digunakan untuk menghitung jarak antara dua titik koordinat di permukaan bumi.

### Formula
```
d = 2 × R × arcsin(√(sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)))
```

Dimana:
- `d` = jarak antara dua titik (km)
- `R` = radius bumi (6371 km)
- `lat1, lon1` = koordinat titik pertama (latitude, longitude)
- `lat2, lon2` = koordinat titik kedua
- `Δlat` = lat2 - lat1
- `Δlon` = lon2 - lon1

### Implementasi
File: `utils/haversine.js`

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius bumi dalam km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100;
}
```

### Penggunaan di Backend
```javascript
const { sortByDistance } = require('./utils/haversine');

const userLat = -0.9471;
const userLon = 100.4172;
const sortedLapangan = sortByDistance(userLat, userLon, lapanganList);
```

---

## 🔒 Keamanan

### 1. Password Hashing
- Menggunakan **bcrypt** dengan salt rounds 10
- Password tidak pernah disimpan dalam bentuk plain text

```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

### 2. Session Management
- Session disimpan server-side dengan `express-session`
- Cookie HTTPOnly untuk mencegah XSS
- Session timeout: 24 jam

### 3. Input Validation
- Validasi di sisi server dan client
- Sanitasi input untuk mencegah SQL Injection
- Prepared statements dengan MySQL2

### 4. Middleware Autentikasi
```javascript
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};
```

### 5. Middleware Admin Authorization
```javascript
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access Denied');
};
```

### 6. Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

---

## 📸 Screenshot

### Halaman Utama (Peta)
- Peta interaktif dengan marker lapangan
- Sidebar daftar lapangan dengan informasi singkat
- Navbar dengan menu navigasi

### Detail Lapangan
- Informasi lengkap lapangan
- Peta lokasi spesifik
- Form rating dan daftar ulasan

### Dashboard Admin
- Tabel data lapangan
- Form tambah/edit lapangan
- Tabel rating untuk moderasi

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📝 Catatan Pengembangan

### Todo List
- [ ] Upload foto lapangan
- [ ] Filter lapangan berdasarkan harga
- [ ] Sistem booking online
- [ ] Notifikasi email
- [ ] Export data ke PDF/Excel
- [ ] Multi-language support

### Known Issues
- Geolocation mungkin tidak akurat di beberapa browser
- Map loading lambat di koneksi internet lambat

---

## 📄 Lisensi

**MIT License**

Copyright (c) 2025 her1god - WebGIS Futsal Padang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

---

## 👨‍💻 Author

**Heri Ramadhan**
- Universitas/Institusi: [xxx]
- Program Studi: [xxx]
- Tahun: 2025

---

## 📞 Kontak & Support

Jika ada pertanyaan atau issues:
- Email: [email@example.com]
- GitHub Issues: [Link repository]

---

## 🙏 Acknowledgments

- **Leaflet.js** - Library peta interaktif open-source
- **OpenStreetMap** - Data peta gratis
- **Express.js** - Web framework yang powerful
- **MySQL** - Database yang handal
- **Node.js Community** - Ekosistem yang luar biasa

---

**⭐ Jangan lupa berikan star jika project ini bermanfaat!**

---

*ZzZ*
