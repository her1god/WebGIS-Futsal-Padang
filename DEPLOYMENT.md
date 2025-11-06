# Deployment Guide - WebGIS Futsal Padang

## 📦 Deployment ke VPS/Cloud Server

### 1. Persiapan Server
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install mysql-server -y

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### 2. Upload Aplikasi
```bash
# Clone atau upload project ke server
git clone [repository-url]
cd webgis-futsal

# Install dependencies
npm install --production
```

### 3. Setup Database
```bash
# Login ke MySQL
sudo mysql -u root -p

# Create database
CREATE DATABASE futsal_db;
USE futsal_db;
SOURCE futsal_db.sql;
EXIT;
```

### 4. Konfigurasi Environment
```bash
# Edit .env file
nano .env
```

Update konfigurasi:
```env
DB_HOST=localhost
DB_USER=futsal_user
DB_PASSWORD=secure_password_here
DB_NAME=futsal_db
DB_PORT=3306

SESSION_SECRET=change_this_to_random_string

PORT=3000
NODE_ENV=production
```

### 5. Setup Firewall
```bash
# Allow port 3000
sudo ufw allow 3000

# Allow MySQL (optional, jika MySQL di server terpisah)
sudo ufw allow 3306
```

### 6. Jalankan dengan PM2
```bash
# Start aplikasi
pm2 start app.js --name webgis-futsal

# Setup auto-restart saat server reboot
pm2 startup
pm2 save

# Monitoring
pm2 logs webgis-futsal
pm2 status
```

### 7. Setup Nginx sebagai Reverse Proxy (Optional)
```bash
# Install Nginx
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/webgis-futsal
```

Config Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/webgis-futsal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Setup SSL dengan Let's Encrypt (Optional)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## 🐳 Deployment dengan Docker (Alternative)

### 1. Buat Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Buat docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=rootpassword
      - DB_NAME=futsal_db
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=futsal_db
    volumes:
      - mysql-data:/var/lib/mysql
      - ./futsal_db.sql:/docker-entrypoint-initdb.d/futsal_db.sql

volumes:
  mysql-data:
```

### 3. Jalankan
```bash
docker-compose up -d
```

---

## 📊 Monitoring & Maintenance

### PM2 Commands
```bash
# Status
pm2 status

# Logs
pm2 logs webgis-futsal

# Restart
pm2 restart webgis-futsal

# Stop
pm2 stop webgis-futsal

# Delete
pm2 delete webgis-futsal
```

### Database Backup
```bash
# Backup database
mysqldump -u root -p futsal_db > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u root -p futsal_db < backup_20250101.sql
```

### Update Aplikasi
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Restart PM2
pm2 restart webgis-futsal
```

---

## 🔒 Security Checklist

- [ ] Ganti password admin default
- [ ] Update SESSION_SECRET di .env
- [ ] Setup firewall (UFW/iptables)
- [ ] Install SSL certificate
- [ ] Batasi akses MySQL (bind-address = 127.0.0.1)
- [ ] Setup automatic backup
- [ ] Enable fail2ban untuk SSH protection
- [ ] Regular update sistem dan dependencies
- [ ] Monitor logs secara berkala

---

## 🚀 Performance Tips

1. **Enable Gzip Compression** di Nginx
2. **Setup CDN** untuk static files
3. **Database Indexing** untuk query cepat
4. **Caching** dengan Redis (optional)
5. **Load Balancer** untuk traffic tinggi

---

## 📞 Support

Jika mengalami masalah saat deployment, check:
- Server logs: `pm2 logs`
- Nginx error log: `/var/log/nginx/error.log`
- MySQL log: `/var/log/mysql/error.log`
