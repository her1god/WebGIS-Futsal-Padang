/**
 * Database Connection Configuration
 * Menggunakan MySQL2 dengan connection pool untuk performa optimal
 */

const mysql = require('mysql2');
require('dotenv').config();

// Konfigurasi connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'futsal_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promise wrapper untuk kemudahan penggunaan async/await
const promisePool = pool.promise();

/**
 * Test koneksi database
 * Fungsi ini akan dipanggil saat aplikasi pertama kali dijalankan
 */
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Database connected successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = {
    pool: promisePool,
    testConnection
};
