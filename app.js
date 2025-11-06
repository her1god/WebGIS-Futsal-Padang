/**
 * WebGIS Futsal Padang - Main Application
 * Sistem Informasi Geografis untuk Lapangan Futsal di Kota Padang
 * 
 * Teknologi:
 * - Backend: Node.js + Express.js
 * - Database: MySQL
 * - Frontend: EJS, Leaflet.js
 * - Autentikasi: bcrypt + express-session
 * - Arsitektur: MVC Pattern
 */

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Import database connection
const { testConnection } = require('./models/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Inisialisasi Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// Middleware Configuration
// ========================================

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'futsal_secret_key_2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set true jika menggunakan HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 jam
    }
}));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========================================
// Security Headers Middleware
// ========================================
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// ========================================
// Request Logging Middleware (Development)
// ========================================
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

// ========================================
// Routes
// ========================================

// User routes (public)
app.use('/', userRoutes);

// Admin routes (protected)
app.use('/admin', adminRoutes);

// ========================================
// Error Handling Middleware
// ========================================

// 404 Handler
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Halaman Tidak Ditemukan</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #4A90E2, #357ABD);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    color: white;
                    text-align: center;
                }
                .error-container {
                    background: white;
                    color: #2C3E50;
                    padding: 3rem;
                    border-radius: 10px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                }
                h1 { font-size: 5rem; margin: 0; color: #4A90E2; }
                h2 { font-size: 2rem; margin: 1rem 0; }
                a {
                    display: inline-block;
                    margin-top: 1.5rem;
                    padding: 0.8rem 2rem;
                    background: #4A90E2;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background 0.3s;
                }
                a:hover { background: #357ABD; }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>404</h1>
                <h2>Halaman Tidak Ditemukan</h2>
                <p>Maaf, halaman yang Anda cari tidak ada.</p>
                <a href="/">Kembali ke Beranda</a>
            </div>
        </body>
        </html>
    `);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>500 - Internal Server Error</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #dc3545, #c82333);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    color: white;
                    text-align: center;
                }
                .error-container {
                    background: white;
                    color: #2C3E50;
                    padding: 3rem;
                    border-radius: 10px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                }
                h1 { font-size: 5rem; margin: 0; color: #dc3545; }
                h2 { font-size: 2rem; margin: 1rem 0; }
                a {
                    display: inline-block;
                    margin-top: 1.5rem;
                    padding: 0.8rem 2rem;
                    background: #dc3545;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background 0.3s;
                }
                a:hover { background: #c82333; }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>500</h1>
                <h2>Internal Server Error</h2>
                <p>Maaf, terjadi kesalahan pada server.</p>
                <a href="/">Kembali ke Beranda</a>
            </div>
        </body>
        </html>
    `);
});

// ========================================
// Start Server
// ========================================

async function startServer() {
    try {
        // Test database connection
        await testConnection();

        // Start Express server
        app.listen(PORT, () => {
            console.log('\n========================================');
            console.log('🚀 WebGIS Futsal Padang Server Started');
            console.log('========================================');
            console.log(`📍 Server running on: http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📅 Started at: ${new Date().toLocaleString('id-ID')}`);
            console.log('========================================\n');
            console.log('📖 Available Routes:');
            console.log('   - http://localhost:3000/ (Home)');
            console.log('   - http://localhost:3000/login (Login)');
            console.log('   - http://localhost:3000/register (Register)');
            console.log('   - http://localhost:3000/admin/dashboard (Admin Dashboard)');
            console.log('\n💡 Tips:');
            console.log('   - Default admin: username=admin, password=admin123');
            console.log('   - Tekan Ctrl+C untuk menghentikan server');
            console.log('========================================\n');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Jalankan server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
