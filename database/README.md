# 🗄️ Database Setup Guide

Panduan lengkap setup database untuk WebGIS Futsal Padang.

## 📋 Prerequisites

- MySQL 8.0 atau lebih baru
- MySQL client/terminal
- Akses root atau user dengan privilege CREATE DATABASE

---

## 🚀 Quick Setup (Cara Cepat)

### 1. Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE futsal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Import Schema
```bash
mysql -u root -p futsal_db < database/schema.sql
```

### 3. Import Seed Data (Optional)
```bash
mysql -u root -p futsal_db < database/seed.sql
```

### 4. Verify
```bash
mysql -u root -p futsal_db -e "SHOW TABLES;"
```

---

## 📝 Step by Step Setup

### **Linux/Mac:**

```bash
# 1. Login ke MySQL
mysql -u root -p

# 2. Buat database
CREATE DATABASE futsal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Buat user khusus (recommended untuk production)
CREATE USER 'futsal_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON futsal_db.* TO 'futsal_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 4. Import schema
mysql -u futsal_user -p futsal_db < database/schema.sql

# 5. Import seed data
mysql -u futsal_user -p futsal_db < database/seed.sql
```

### **Windows:**

```cmd
# 1. Login ke MySQL (CMD atau PowerShell)
mysql -u root -p

# 2. Buat database
CREATE DATABASE futsal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 3. Import schema (di CMD/PowerShell)
mysql -u root -p futsal_db < database\schema.sql

# 4. Import seed data
mysql -u root -p futsal_db < database\seed.sql
```

---

## 🔐 Default Credentials

### Admin Account (dari seed.sql):
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** admin

⚠️ **PENTING:** Ganti password ini setelah login pertama kali!

### Sample User (dari seed.sql):
- **Username:** `user1`
- **Password:** `user123`
- **Role:** user

---

## 📊 Database Structure

### Tables:

1. **users**
   - User authentication & authorization
   - Fields: id, username, email, password (hashed), role, created_at

2. **lapangan_futsal**
   - Data lapangan futsal
   - Fields: id, nama_lapangan, alamat, latitude, longitude, harga_sewa, deskripsi, fasilitas, telepon, jam_operasional, created_at, updated_at

3. **rating**
   - User reviews & ratings
   - Fields: id, user_id, lapangan_id, rating (1-5), ulasan, created_at, updated_at

4. **lapangan_photos**
   - Photos for each lapangan
   - Fields: id, lapangan_id, photo_url, caption, is_primary, created_at

5. **lapangan_with_rating** (VIEW)
   - Aggregated view with average ratings
   - Used for efficient queries

---

## 🔧 Configuration

Update file `.env` dengan kredensial database Anda:

```env
DB_HOST=localhost
DB_USER=futsal_user
DB_PASSWORD=your_secure_password
DB_NAME=futsal_db
DB_PORT=3306
```

---

## 🛠️ Maintenance Commands

### Backup Database:
```bash
# Full backup (schema + data)
mysqldump -u root -p futsal_db > backup_$(date +%Y%m%d).sql

# Schema only
mysqldump -u root -p --no-data futsal_db > schema_backup.sql

# Data only
mysqldump -u root -p --no-create-info futsal_db > data_backup.sql
```

### Restore Database:
```bash
mysql -u root -p futsal_db < backup_file.sql
```

### Reset Database:
```bash
mysql -u root -p futsal_db -e "DROP DATABASE futsal_db; CREATE DATABASE futsal_db;"
mysql -u root -p futsal_db < database/schema.sql
mysql -u root -p futsal_db < database/seed.sql
```

---

## 🔐 Generate New Password Hash

Jika ingin membuat user baru atau reset password:

### Method 1: Node.js Script
```bash
node -e "console.log(require('bcryptjs').hashSync('your_new_password', 10))"
```

### Method 2: Gunakan fix-admin-password.js
```bash
# Edit password di fix-admin-password.js
node fix-admin-password.js
```

Kemudian insert/update di database:
```sql
INSERT INTO users (username, email, password, role) 
VALUES ('newuser', 'email@example.com', '$2a$10$HashedPasswordHere', 'user');
```

---

## 📊 Sample Queries

### Check Total Data:
```sql
SELECT 'Lapangan' as Type, COUNT(*) as Total FROM lapangan_futsal
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Ratings', COUNT(*) FROM rating;
```

### View Average Ratings:
```sql
SELECT 
    l.nama_lapangan,
    ROUND(AVG(r.rating), 2) as avg_rating,
    COUNT(r.id) as total_reviews
FROM lapangan_futsal l
LEFT JOIN rating r ON l.id = r.lapangan_id
GROUP BY l.id;
```

### Top Rated Lapangan:
```sql
SELECT * FROM lapangan_with_rating 
ORDER BY avg_rating DESC, total_reviews DESC 
LIMIT 5;
```

---

## ⚠️ Troubleshooting

### Error: Access denied
```bash
# Cek user privileges
mysql -u root -p -e "SELECT user, host FROM mysql.user;"
mysql -u root -p -e "SHOW GRANTS FOR 'futsal_user'@'localhost';"
```

### Error: Unknown database
```bash
# Cek database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'futsal_db';"
```

### Error: Table doesn't exist
```bash
# Re-import schema
mysql -u root -p futsal_db < database/schema.sql
```

### Error: Charset issues
```bash
# Set proper charset
mysql -u root -p futsal_db -e "ALTER DATABASE futsal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## 🔒 Security Best Practices

1. ✅ **Ganti password default admin** setelah setup
2. ✅ **Gunakan user database khusus** (bukan root)
3. ✅ **Set strong password** untuk database user
4. ✅ **Restrict network access** ke MySQL (bind-address)
5. ✅ **Regular backup** database
6. ✅ **Jangan commit file .env** ke git
7. ✅ **Use SSL/TLS** untuk koneksi database di production

---

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)
- [MySQL Best Practices](https://dev.mysql.com/doc/refman/8.0/en/security-guidelines.html)

---

**Happy Coding! 🚀⚽**
