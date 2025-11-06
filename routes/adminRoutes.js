/**
 * Admin Routes
 * Definisi rute untuk fitur admin
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../middlewares/upload');

// Middleware untuk cek apakah user adalah admin
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access Denied: Admin only');
};

// Dashboard admin
router.get('/dashboard', isAdmin, adminController.showDashboard);

// CRUD Lapangan
router.post('/lapangan', isAdmin, adminController.addLapangan);
router.get('/lapangan/:id', isAdmin, adminController.getLapanganById);
router.put('/lapangan/:id', isAdmin, adminController.updateLapangan);
router.delete('/lapangan/:id', isAdmin, adminController.deleteLapangan);

// Moderasi Rating
router.delete('/rating/:id', isAdmin, adminController.deleteRating);

// Upload & Manage Photos
router.post('/photos/upload', isAdmin, upload.array('photos', 10), adminController.uploadPhotos);
router.get('/photos/lapangan/:id', isAdmin, adminController.getPhotosByLapangan);
router.put('/photos/set-primary', isAdmin, adminController.setPrimaryPhoto);
router.delete('/photos/:id', isAdmin, adminController.deletePhoto);

// Analytics Dashboard
router.get('/analytics', isAdmin, adminController.showAnalytics);
router.get('/api/analytics/general-stats', isAdmin, adminController.getGeneralStats);
router.get('/api/analytics/popular-lapangan', isAdmin, adminController.getPopularLapangan);
router.get('/api/analytics/rating-distribution', isAdmin, adminController.getRatingDistribution);
router.get('/api/analytics/rating-per-month', isAdmin, adminController.getRatingPerMonth);

module.exports = router;
