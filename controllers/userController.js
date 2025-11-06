/**
 * User Controller
 * Menangani logika untuk fitur pengguna (user)
 */

const bcrypt = require('bcrypt');
const { LapanganModel, UserModel, RatingModel } = require('../models/lapanganModel');
const { sortByDistance } = require('../utils/haversine');

const userController = {
    /**
     * Menampilkan halaman utama (peta dan daftar lapangan)
     */
    showHomePage: async (req, res) => {
        try {
            const lapanganList = await LapanganModel.getAll();
            res.render('index', { 
                user: req.session.user || null,
                lapanganList: lapanganList
            });
        } catch (error) {
            console.error('Error loading home page:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    /**
     * API: Mendapatkan semua lapangan dalam format JSON
     */
    getAllLapangan: async (req, res) => {
        try {
            const lapanganList = await LapanganModel.getAll();
            res.json({
                success: true,
                data: lapanganList
            });
        } catch (error) {
            console.error('Error fetching lapangan:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching data'
            });
        }
    },

    /**
     * API: Mendapatkan lapangan terdekat berdasarkan lokasi user
     */
    getNearbyLapangan: async (req, res) => {
        try {
            const { latitude, longitude } = req.query;
            
            if (!latitude || !longitude) {
                return res.status(400).json({
                    success: false,
                    message: 'Latitude and longitude are required'
                });
            }

            const userLat = parseFloat(latitude);
            const userLon = parseFloat(longitude);

            // Ambil semua lapangan
            const lapanganList = await LapanganModel.getAll();

            // Hitung jarak dan urutkan berdasarkan jarak terdekat
            const sortedLapangan = sortByDistance(userLat, userLon, lapanganList);

            res.json({
                success: true,
                data: sortedLapangan
            });
        } catch (error) {
            console.error('Error calculating nearby lapangan:', error);
            res.status(500).json({
                success: false,
                message: 'Error calculating distance'
            });
        }
    },

    /**
     * Filter dan search lapangan
     */
    filterLapangan: async (req, res) => {
        try {
            const { search, minPrice, maxPrice, minRating, sortBy } = req.query;

            // Build filters object
            const filters = {};

            if (search && search.trim()) {
                filters.search = search.trim();
            }

            if (minPrice && !isNaN(minPrice)) {
                filters.minPrice = parseFloat(minPrice);
            }

            if (maxPrice && !isNaN(maxPrice)) {
                filters.maxPrice = parseFloat(maxPrice);
            }

            if (minRating && !isNaN(minRating)) {
                filters.minRating = parseFloat(minRating);
            }

            if (sortBy && ['price_asc', 'price_desc', 'rating_asc', 'rating_desc', 'name_asc', 'name_desc'].includes(sortBy)) {
                filters.sortBy = sortBy;
            }

            // Get filtered results
            const lapangan = await LapanganModel.filterAndSearch(filters);

            res.json({
                success: true,
                data: lapangan
            });
        } catch (error) {
            console.error('Error filtering lapangan:', error);
            res.status(500).json({
                success: false,
                message: 'Error filtering lapangan'
            });
        }
    },

    /**
     * Menampilkan halaman detail lapangan
     */
    showDetailLapangan: async (req, res) => {
        try {
            const { id } = req.params;
            const lapangan = await LapanganModel.getById(id);
            
            if (!lapangan) {
                return res.status(404).send('Lapangan not found');
            }

            // Ambil rating dan ulasan
            const ratings = await RatingModel.getByLapanganId(id);

            // Cek apakah user sudah memberikan rating
            let userRating = null;
            if (req.session.user) {
                userRating = await RatingModel.checkUserRating(req.session.user.id, id);
            }

            res.render('detailLapangan', {
                user: req.session.user || null,
                lapangan: lapangan,
                ratings: ratings,
                userRating: userRating
            });
        } catch (error) {
            console.error('Error loading detail page:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    /**
     * Menampilkan halaman login
     */
    showLoginPage: (req, res) => {
        if (req.session.user) {
            return res.redirect('/');
        }
        res.render('login', { error: null });
    },

    /**
     * Menampilkan halaman register
     */
    showRegisterPage: (req, res) => {
        if (req.session.user) {
            return res.redirect('/');
        }
        res.render('register', { error: null });
    },

    /**
     * Proses login user
     */
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Validasi input
            if (!username || !password) {
                return res.render('login', { 
                    error: 'Username dan password harus diisi' 
                });
            }

            // Cari user berdasarkan username
            const user = await UserModel.findByUsername(username);

            if (!user) {
                return res.render('login', { 
                    error: 'Username atau password salah' 
                });
            }

            // Verifikasi password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.render('login', { 
                    error: 'Username atau password salah' 
                });
            }

            // Set session
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            };

            // Redirect berdasarkan role
            if (user.role === 'admin') {
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/');
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.render('login', { 
                error: 'Terjadi kesalahan, silakan coba lagi' 
            });
        }
    },

    /**
     * Proses registrasi user baru
     */
    register: async (req, res) => {
        try {
            const { username, email, password, confirmPassword } = req.body;

            // Validasi input
            if (!username || !email || !password || !confirmPassword) {
                return res.render('register', { 
                    error: 'Semua field harus diisi' 
                });
            }

            if (password !== confirmPassword) {
                return res.render('register', { 
                    error: 'Password dan konfirmasi password tidak cocok' 
                });
            }

            if (password.length < 6) {
                return res.render('register', { 
                    error: 'Password minimal 6 karakter' 
                });
            }

            // Cek apakah username sudah ada
            const existingUser = await UserModel.findByUsername(username);
            if (existingUser) {
                return res.render('register', { 
                    error: 'Username sudah digunakan' 
                });
            }

            // Cek apakah email sudah ada
            const existingEmail = await UserModel.findByEmail(email);
            if (existingEmail) {
                return res.render('register', { 
                    error: 'Email sudah terdaftar' 
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Buat user baru
            await UserModel.create({
                username: username,
                email: email,
                password: hashedPassword,
                role: 'user'
            });

            res.redirect('/login');
        } catch (error) {
            console.error('Error during registration:', error);
            res.render('register', { 
                error: 'Terjadi kesalahan, silakan coba lagi' 
            });
        }
    },

    /**
     * Logout user
     */
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error during logout:', err);
            }
            res.redirect('/');
        });
    },

    /**
     * Menambah atau update rating
     */
    addRating: async (req, res) => {
        try {
            // Cek apakah user sudah login
            if (!req.session.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Anda harus login terlebih dahulu'
                });
            }

            const { lapangan_id, rating, ulasan } = req.body;

            // Validasi input
            if (!lapangan_id || !rating) {
                return res.status(400).json({
                    success: false,
                    message: 'Lapangan ID dan rating harus diisi'
                });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating harus antara 1-5'
                });
            }

            // Simpan rating
            await RatingModel.create({
                user_id: req.session.user.id,
                lapangan_id: parseInt(lapangan_id),
                rating: parseInt(rating),
                ulasan: ulasan || ''
            });

            res.json({
                success: true,
                message: 'Rating berhasil disimpan'
            });
        } catch (error) {
            console.error('Error adding rating:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat menyimpan rating'
            });
        }
    }
};

module.exports = userController;
