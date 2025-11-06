# 🪟 Setup Guide untuk Windows

Panduan lengkap setup WebGIS Futsal Padang di Windows.

---

## 📋 Prerequisites

Install software berikut terlebih dahulu:

### 1. **Node.js** (v18 atau lebih baru)
- Download: https://nodejs.org/
- Pilih versi **LTS** (Long Term Support)
- Install dengan default settings
- Verifikasi: `node --version` dan `npm --version`

### 2. **MySQL** (v8.0 atau lebih baru)
- Download: https://dev.mysql.com/downloads/mysql/
- Atau gunakan **XAMPP** (sudah include MySQL + phpMyAdmin)
  - Download XAMPP: https://www.apachefriends.org/
- Catat password root MySQL yang Anda set saat install

### 3. **Git for Windows**
- Download: https://git-scm.com/download/win
- Install dengan default settings
- Verifikasi: `git --version`

### 4. **Code Editor** (Optional tapi recommended)
- **VS Code**: https://code.visualstudio.com/
- Atau editor favorit Anda

---

## 🚀 Langkah Setup

### **Step 1: Clone Repository**

Buka **Command Prompt** atau **PowerShell**:

```cmd
# Pindah ke folder Documents
cd C:\Users\%USERNAME%\Documents

# Clone repository dari GitHub
git clone https://github.com/her1god/WebGIS-Futsal-Padang.git

# Masuk ke folder project
cd WebGIS-Futsal-Padang
```

---

### **Step 2: Install Dependencies**

```cmd
# Install semua package dari package.json
npm install

# Tunggu hingga selesai (butuh waktu 1-3 menit)
```

Jika ada error, coba:
```cmd
npm install --legacy-peer-deps
```

---

### **Step 3: Setup Database**

#### **Opsi A: Menggunakan MySQL Command Line**

```cmd
# Login ke MySQL (masukkan password root Anda)
mysql -u root -p

# Atau jika MySQL tidak ditemukan, gunakan path lengkap:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

```sql
-- Buat database
CREATE DATABASE futsal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Keluar
EXIT;
```

```cmd
# Import schema (struktur tabel)
mysql -u root -p futsal_db < database\schema.sql

# Import seed data (admin + sample data)
mysql -u root -p futsal_db < database\seed.sql
```

#### **Opsi B: Menggunakan XAMPP/phpMyAdmin**

1. Buka phpMyAdmin (http://localhost/phpmyadmin)
2. Klik tab **"SQL"**
3. Copy paste isi file `database/schema.sql` → Execute
4. Copy paste isi file `database/seed.sql` → Execute
5. Selesai!

---

### **Step 4: Configure Environment Variables**

```cmd
# Copy file .env.example menjadi .env
copy .env.example .env

# Edit file .env dengan Notepad atau VS Code
notepad .env
```

Edit file `.env` sesuai dengan setup MySQL Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=futsal_db
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Secret (ganti dengan random string)
SESSION_SECRET=change_this_to_random_string_for_security

# Application
APP_NAME=WebGIS Futsal Padang
APP_URL=http://localhost:3000
```

⚠️ **PENTING:** Ganti `your_mysql_password_here` dengan password MySQL root Anda!

---

### **Step 5: Jalankan Aplikasi**

```cmd
# Jalankan aplikasi
npm start

# Atau untuk development mode (auto-restart):
npm run dev
```

Jika berhasil, Anda akan melihat:
```
✅ Database connected successfully!
🚀 WebGIS Futsal Padang Server Started
📍 Server running on: http://localhost:3000
```

---

### **Step 6: Akses Aplikasi**

Buka browser dan akses:
- **Homepage:** http://localhost:3000
- **Login Admin:** http://localhost:3000/login

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Ganti password ini setelah login pertama kali!**

---

## 🔄 Workflow Git (Linux ↔ Windows)

### **Update Code dari Linux:**

Di Windows, jalankan:
```cmd
cd C:\Users\%USERNAME%\Documents\WebGIS-Futsal-Padang

# Pull perubahan terbaru
git pull origin main

# Install dependencies baru (jika ada)
npm install

# Jalankan
npm start
```

### **Push Perubahan dari Windows:**

```cmd
# Cek status
git status

# Add files yang diubah
git add .

# Commit dengan message
git commit -m "Update dari Windows: deskripsi perubahan"

# Push ke GitHub
git push origin main
```

### **Kembali ke Linux:**

Di Linux, jalankan:
```bash
cd /home/her1god/Documents/skripsi/webgis-futsal

# Pull perubahan dari Windows
git pull origin main

# Install dependencies baru (jika ada)
npm install

# Jalankan
npm start
```

---

## 📁 Folder Structure

```
C:\Users\YourName\Documents\WebGIS-Futsal-Padang\
│
├── controllers/          # Logic handlers
├── models/              # Database models
├── routes/              # API routes
├── views/               # EJS templates
├── public/              # Static files (CSS, JS, images)
│   ├── css/
│   ├── js/
│   └── uploads/         # User uploads (auto-created)
├── database/            # Database setup files
│   ├── schema.sql       # Database structure
│   ├── seed.sql         # Initial data
│   └── README.md        # Database guide
├── middlewares/         # Custom middlewares
├── utils/               # Helper functions
├── .env                 # Environment variables (DO NOT COMMIT!)
├── .env.example         # Template for .env
├── .gitignore           # Git ignore rules
├── app.js               # Main application
├── package.json         # Dependencies
└── README.md            # Project documentation
```

---

## ⚠️ Troubleshooting

### **Error: MySQL tidak ditemukan**
```cmd
# Set MySQL ke PATH atau gunakan path lengkap
set PATH=%PATH%;C:\Program Files\MySQL\MySQL Server 8.0\bin
```

### **Error: Port 3000 sudah digunakan**
```cmd
# Cari process yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill process (ganti PID dengan nomor yang muncul)
taskkill /PID <process_id> /F

# Atau ganti port di .env
# PORT=3001
```

### **Error: Cannot connect to database**
- Cek MySQL service running:
  - Windows + R → `services.msc` → Cari "MySQL" → Start
- Cek kredensial di file `.env`
- Cek firewall tidak block MySQL

### **Error: node_modules missing**
```cmd
# Hapus folder node_modules dan install ulang
rmdir /s /q node_modules
npm install
```

### **Error: Git conflict**
```cmd
# Lihat conflict
git status

# Reset ke HEAD (hati-hati, perubahan lokal hilang)
git reset --hard HEAD

# Pull ulang
git pull origin main
```

---

## 🔐 Security Notes

1. ✅ **Ganti password admin** default setelah login
2. ✅ **Jangan commit file .env** ke git
3. ✅ **Gunakan password MySQL yang kuat**
4. ✅ **Update SESSION_SECRET** di .env
5. ✅ **Backup database** secara berkala

---

## 🆘 Need Help?

Jika ada masalah:
1. Cek log error di terminal
2. Cek file `database/README.md` untuk database issues
3. Lihat dokumentasi di `README.md` utama
4. Check GitHub Issues: https://github.com/her1god/WebGIS-Futsal-Padang/issues

---

## 🎓 Tips untuk Development

### VS Code Extensions (Recommended):
- **ESLint** - JavaScript linting
- **Prettier** - Code formatter
- **GitLens** - Git visualization
- **MySQL** - Database management
- **Live Server** - Auto refresh browser

### NPM Scripts:
```cmd
npm start       # Normal mode
npm run dev     # Development mode (auto-restart)
npm test        # Run tests (jika ada)
```

### Database Management:
- **HeidiSQL**: https://www.heidisql.com/ (Free, bagus untuk Windows)
- **DBeaver**: https://dbeaver.io/ (Cross-platform)
- **MySQL Workbench**: https://dev.mysql.com/downloads/workbench/

---

**Happy Coding! 🚀⚽**

Untuk pertanyaan lebih lanjut, lihat dokumentasi lengkap di:
- Main README: `README.md`
- Database Guide: `database/README.md`
