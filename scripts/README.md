# 🔧 Utility Scripts

Kumpulan script untuk maintenance dan troubleshooting.

---

## 📜 Available Scripts

### 1. **Reset Admin Password**

Reset password admin ke default (`admin123`).

**Linux/Mac:**
```bash
node scripts/reset-admin-password.js
```

**Windows:**
```cmd
node scripts\reset-admin-password.js
```

**Output:**
```
✅ Password admin berhasil direset!

📝 Credentials:
   Username: admin
   Password: admin123

⚠️  PENTING: Ganti password ini setelah login!
```

---

### 2. **Generate Password Hash**

Generate bcrypt hash untuk password baru.

**Syntax:**
```bash
node scripts/generate-password.js <your_password>
```

**Example:**
```bash
node scripts/generate-password.js MySecurePassword123
```

**Output:**
```
✅ Password Hash Generated

Password: MySecurePassword123
Hash: $2a$10$abcdef1234567890...

Gunakan hash ini untuk insert ke database:

INSERT INTO users (username, email, password, role)
VALUES ('username', 'email@example.com', '$2a$10$...', 'user');
```

**Use Case:**
1. Buat user baru
2. Reset password user yang lupa
3. Change password admin secara manual

---

## 🎯 Common Use Cases

### Lupa Password Admin

```bash
# Reset ke default
node scripts/reset-admin-password.js

# Atau generate password baru
node scripts/generate-password.js NewAdminPassword123

# Copy hash dan update ke database:
mysql -u root -p futsal_db -e "UPDATE users SET password='$2a$10$...' WHERE username='admin'"
```

### Buat User Baru via Script

```bash
# Generate hash
node scripts/generate-password.js userPassword123

# Insert ke database
mysql -u root -p futsal_db
```

```sql
INSERT INTO users (username, email, password, role, created_at)
VALUES ('newuser', 'newuser@example.com', '$2a$10$...', 'user', NOW());
```

### Database Fresh Install

Jika admin user tidak ada atau terhapus:

```bash
# 1. Import seed data (akan create admin)
mysql -u root -p futsal_db < database/seed.sql

# 2. Atau manual create:
node scripts/generate-password.js admin123
# Copy hash ke query:
mysql -u root -p futsal_db
```

```sql
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@futsal.com', '$2a$10$...', 'admin');
```

---

## ⚠️ Troubleshooting

### Error: Cannot find module 'mysql2'
```bash
npm install
```

### Error: Cannot connect to database
1. Cek MySQL running: `systemctl status mysql` (Linux) atau Services (Windows)
2. Cek file `.env` credentials
3. Cek database exists: `mysql -u root -p -e "SHOW DATABASES LIKE 'futsal_db'"`

### Error: User 'admin' not found
```bash
# Import seed data
mysql -u root -p futsal_db < database/seed.sql
```

---

## 🔐 Security Notes

1. ⚠️ **Jangan gunakan password default** di production!
2. ✅ Gunakan password yang kuat (min 8 karakter, kombinasi huruf, angka, simbol)
3. ✅ Ganti password admin segera setelah setup
4. ✅ Jangan commit file `.env` yang berisi credentials
5. ✅ Backup database sebelum reset password

---

## 📝 Custom Password di reset-admin-password.js

Edit file `scripts/reset-admin-password.js` line 24:

```javascript
const newPassword = 'admin123'; // Ganti dengan password baru
```

Atau lebih baik, generate hash terpisah:
```bash
node scripts/generate-password.js YourNewPassword
```

Lalu update manual di database.

---

**Happy Coding! 🚀**
