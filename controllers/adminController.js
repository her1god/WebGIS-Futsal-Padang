/**
 * Admin Controller
 * Menangani logika untuk fitur admin
 */

const bcrypt = require('bcrypt');
const { LapanganModel, RatingModel } = require('../models/lapanganModel');
const PhotoModel = require('../models/photoModel');
const AnalyticsModel = require('../models/analyticsModel');

const adminController = {
    /**
     * Menampilkan dashboard admin
     */
    showDashboard: async (req, res) => {
        try {
            const lapanganList = await LapanganModel.getAll();
            const allRatings = await RatingModel.getAll();

            res.render('adminDashboard', {
                user: req.session.user,
                lapanganList: lapanganList,
                ratings: allRatings
            });
        } catch (error) {
            console.error('Error loading admin dashboard:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    /**
     * Menambah lapangan baru
     */
    addLapangan: async (req, res) => {
        try {
            const {
                nama_lapangan,
                alamat,
                latitude,
                longitude,
                harga_sewa,
                deskripsi,
                fasilitas,
                telepon,
                jam_operasional
            } = req.body;

            // Validasi input
            if (!nama_lapangan || !alamat || !latitude || !longitude || !harga_sewa) {
                return res.status(400).json({
                    success: false,
                    message: 'Field wajib harus diisi'
                });
            }

            // Simpan ke database
            await LapanganModel.create({
                nama_lapangan,
                alamat,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                harga_sewa: parseInt(harga_sewa),
                deskripsi: deskripsi || '',
                fasilitas: fasilitas || '',
                foto: 'default.jpg',
                telepon: telepon || '',
                jam_operasional: jam_operasional || ''
            });

            res.json({
                success: true,
                message: 'Lapangan berhasil ditambahkan'
            });
        } catch (error) {
            console.error('Error adding lapangan:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat menambah lapangan'
            });
        }
    },

    /**
     * Update data lapangan
     */
    updateLapangan: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                nama_lapangan,
                alamat,
                latitude,
                longitude,
                harga_sewa,
                deskripsi,
                fasilitas,
                foto,
                telepon,
                jam_operasional
            } = req.body;

            // Validasi input
            if (!nama_lapangan || !alamat || !latitude || !longitude || !harga_sewa) {
                return res.status(400).json({
                    success: false,
                    message: 'Field wajib harus diisi'
                });
            }

            // Update database
            await LapanganModel.update(id, {
                nama_lapangan,
                alamat,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                harga_sewa: parseInt(harga_sewa),
                deskripsi: deskripsi || '',
                fasilitas: fasilitas || '',
                foto: foto || 'default.jpg',
                telepon: telepon || '',
                jam_operasional: jam_operasional || ''
            });

            res.json({
                success: true,
                message: 'Lapangan berhasil diupdate'
            });
        } catch (error) {
            console.error('Error updating lapangan:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat mengupdate lapangan'
            });
        }
    },

    /**
     * Hapus lapangan
     */
    deleteLapangan: async (req, res) => {
        try {
            const { id } = req.params;

            // Hapus dari database
            const result = await LapanganModel.delete(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Lapangan tidak ditemukan'
                });
            }

            res.json({
                success: true,
                message: 'Lapangan berhasil dihapus'
            });
        } catch (error) {
            console.error('Error deleting lapangan:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat menghapus lapangan'
            });
        }
    },

    /**
     * Hapus rating (moderasi)
     */
    deleteRating: async (req, res) => {
        try {
            const { id } = req.params;

            // Hapus dari database
            const result = await RatingModel.delete(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Rating tidak ditemukan'
                });
            }

            res.json({
                success: true,
                message: 'Rating berhasil dihapus'
            });
        } catch (error) {
            console.error('Error deleting rating:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat menghapus rating'
            });
        }
    },

    /**
     * API: Get lapangan by ID (untuk edit form)
     */
    getLapanganById: async (req, res) => {
        try {
            const { id } = req.params;
            const lapangan = await LapanganModel.getById(id);

            if (!lapangan) {
                return res.status(404).json({
                    success: false,
                    message: 'Lapangan tidak ditemukan'
                });
            }

            res.json({
                success: true,
                data: lapangan
            });
        } catch (error) {
            console.error('Error fetching lapangan:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan'
            });
        }
    },

    /**
     * Upload foto lapangan (multiple)
     */
    uploadPhotos: async (req, res) => {
        try {
            const { lapanganId } = req.body;
            
            if (!lapanganId) {
                return res.status(400).json({
                    success: false,
                    message: 'ID Lapangan harus diisi'
                });
            }

            // Cek apakah lapangan ada
            const lapangan = await LapanganModel.getById(lapanganId);
            if (!lapangan) {
                return res.status(404).json({
                    success: false,
                    message: 'Lapangan tidak ditemukan'
                });
            }

            // Cek apakah ada file yang diupload
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Tidak ada foto yang diupload'
                });
            }

            // Simpan informasi foto ke database
            const photoData = req.files.map((file, index) => ({
                url: `/uploads/${file.filename}`,
                caption: req.body.caption || `Foto ${index + 1}`,
                isPrimary: index === 0 // Foto pertama jadi primary
            }));

            await PhotoModel.uploadPhotos(parseInt(lapanganId), photoData);

            res.json({
                success: true,
                message: `${req.files.length} foto berhasil diupload`,
                files: req.files.map(f => f.filename)
            });
        } catch (error) {
            console.error('Error uploading photos:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat upload foto'
            });
        }
    },

    /**
     * Get semua foto untuk lapangan tertentu
     */
    getPhotosByLapangan: async (req, res) => {
        try {
            const { id } = req.params;
            const photos = await PhotoModel.getPhotosByLapanganId(id);

            res.json({
                success: true,
                data: photos
            });
        } catch (error) {
            console.error('Error fetching photos:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat mengambil foto'
            });
        }
    },

    /**
     * Set foto sebagai primary
     */
    setPrimaryPhoto: async (req, res) => {
        try {
            const { photoId, lapanganId } = req.body;

            if (!photoId || !lapanganId) {
                return res.status(400).json({
                    success: false,
                    message: 'Photo ID dan Lapangan ID harus diisi'
                });
            }

            await PhotoModel.setPrimaryPhoto(photoId, lapanganId);

            res.json({
                success: true,
                message: 'Foto primary berhasil diupdate'
            });
        } catch (error) {
            console.error('Error setting primary photo:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan'
            });
        }
    },

    /**
     * Hapus foto
     */
    deletePhoto: async (req, res) => {
        try {
            const { id } = req.params;

            // Ambil info foto untuk mendapatkan path file
            const fs = require('fs');
            const path = require('path');
            
            // Query langsung untuk get photo by ID
            const { pool } = require('../models/db');
            const [photos] = await pool.query('SELECT * FROM lapangan_photos WHERE id = ?', [id]);
            
            if (photos.length > 0) {
                const photo = photos[0];
                const filePath = path.join(__dirname, '../public', photo.photo_url);
                
                // Hapus file fisik jika ada
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            // Hapus dari database
            await PhotoModel.deletePhoto(id);

            res.json({
                success: true,
                message: 'Foto berhasil dihapus'
            });
        } catch (error) {
            console.error('Error deleting photo:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat menghapus foto'
            });
        }
    },

    /**
     * Show Analytics Dashboard
     */
    showAnalytics: async (req, res) => {
        try {
            res.render('adminAnalytics', {
                user: req.session.user
            });
        } catch (error) {
            console.error('Error loading analytics:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    /**
     * Get general statistics
     */
    getGeneralStats: async (req, res) => {
        try {
            const stats = await AnalyticsModel.getGeneralStats();
            res.json({ success: true, data: stats });
        } catch (error) {
            console.error('Error fetching general stats:', error);
            res.status(500).json({ success: false, message: 'Error fetching stats' });
        }
    },

    /**
     * Get popular lapangan
     */
    getPopularLapangan: async (req, res) => {
        try {
            const popular = await AnalyticsModel.getPopularLapangan();
            res.json({ success: true, data: popular });
        } catch (error) {
            console.error('Error fetching popular lapangan:', error);
            res.status(500).json({ success: false, message: 'Error fetching data' });
        }
    },

    /**
     * Get rating distribution
     */
    getRatingDistribution: async (req, res) => {
        try {
            const distribution = await AnalyticsModel.getRatingDistribution();
            res.json({ success: true, data: distribution });
        } catch (error) {
            console.error('Error fetching rating distribution:', error);
            res.status(500).json({ success: false, message: 'Error fetching data' });
        }
    },

    /**
     * Get rating per month
     */
    getRatingPerMonth: async (req, res) => {
        try {
            const ratings = await AnalyticsModel.getRatingPerMonth();
            res.json({ success: true, data: ratings });
        } catch (error) {
            console.error('Error fetching rating per month:', error);
            res.status(500).json({ success: false, message: 'Error fetching data' });
        }
    }
};

module.exports = adminController;
