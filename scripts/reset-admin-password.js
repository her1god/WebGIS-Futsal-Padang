/**
 * Script untuk reset password admin
 * Jalankan: node scripts/reset-admin-password.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetAdminPassword() {
    console.log('\n========================================');
    console.log('🔐 Reset Admin Password');
    console.log('========================================\n');

    try {
        // Koneksi ke database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'futsal_db'
        });

        console.log('✅ Connected to database\n');

        // Hash password baru
        const newPassword = 'admin123'; // Ganti dengan password yang diinginkan
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password admin
        const [result] = await connection.execute(
            'UPDATE users SET password = ? WHERE username = ? AND role = ?',
            [hashedPassword, 'admin', 'admin']
        );

        if (result.affectedRows > 0) {
            console.log('✅ Password admin berhasil direset!\n');
            console.log('📝 Credentials:');
            console.log('   Username: admin');
            console.log('   Password: admin123');
            console.log('\n⚠️  PENTING: Ganti password ini setelah login!\n');
        } else {
            console.log('❌ User admin tidak ditemukan!');
            console.log('💡 Jalankan: mysql -u root -p futsal_db < database/seed.sql\n');
        }

        await connection.end();

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Pastikan MySQL running');
        console.log('   2. Cek kredensial di file .env');
        console.log('   3. Pastikan database futsal_db sudah dibuat\n');
        process.exit(1);
    }
}

// Jalankan script
resetAdminPassword();
