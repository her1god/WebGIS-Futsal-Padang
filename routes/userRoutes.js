/**
 * User Routes
 * Definisi rute untuk fitur user
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const PhotoModel = require('../models/photoModel');

// Middleware untuk cek apakah user sudah login
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

// Halaman utama (peta)
router.get('/', userController.showHomePage);

// API endpoints
router.get('/api/lapangan', userController.getAllLapangan);
router.get('/api/lapangan/nearby', userController.getNearbyLapangan);
router.get('/api/lapangan/filter', userController.filterLapangan);

// Detail lapangan
router.get('/lapangan/:id', userController.showDetailLapangan);

// Authentication routes
router.get('/login', userController.showLoginPage);
router.post('/login', userController.login);
router.get('/register', userController.showRegisterPage);
router.post('/register', userController.register);
router.get('/logout', userController.logout);

// Rating routes (harus login)
router.post('/api/rating', isAuthenticated, userController.addRating);

// Photo routes (public)
router.get('/api/photos/lapangan/:id', async (req, res) => {
    try {
        const photos = await PhotoModel.getPhotosByLapanganId(req.params.id);
        res.json({ success: true, data: photos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching photos' });
    }
});

module.exports = router;
