/**
 * Model untuk tabel lapangan_futsal
 * Menangani semua operasi database terkait lapangan futsal
 */

const { pool } = require('./db');

const LapanganModel = {
    /**
     * Mengambil semua data lapangan futsal
     * @returns {Promise<Array>} Array lapangan futsal
     */
    getAll: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    l.*,
                    COALESCE(AVG(r.rating), 0) as avg_rating,
                    COUNT(r.id) as total_reviews
                FROM lapangan_futsal l
                LEFT JOIN rating r ON l.id = r.lapangan_id
                GROUP BY l.id
                ORDER BY l.created_at DESC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mengambil data lapangan berdasarkan ID
     * @param {number} id - ID lapangan
     * @returns {Promise<Object>} Data lapangan
     */
    getById: async (id) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    l.*,
                    COALESCE(AVG(r.rating), 0) as avg_rating,
                    COUNT(r.id) as total_reviews
                FROM lapangan_futsal l
                LEFT JOIN rating r ON l.id = r.lapangan_id
                WHERE l.id = ?
                GROUP BY l.id
            `, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    /**
     * Menambah data lapangan baru
     * @param {Object} data - Data lapangan
     * @returns {Promise<Object>} Result insert
     */
    create: async (data) => {
        try {
            const [result] = await pool.query(
                `INSERT INTO lapangan_futsal 
                (nama_lapangan, alamat, latitude, longitude, harga_sewa, deskripsi, fasilitas, foto, telepon, jam_operasional) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.nama_lapangan,
                    data.alamat,
                    data.latitude,
                    data.longitude,
                    data.harga_sewa,
                    data.deskripsi,
                    data.fasilitas,
                    data.foto || 'default.jpg',
                    data.telepon,
                    data.jam_operasional
                ]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mengupdate data lapangan
     * @param {number} id - ID lapangan
     * @param {Object} data - Data yang akan diupdate
     * @returns {Promise<Object>} Result update
     */
    update: async (id, data) => {
        try {
            const [result] = await pool.query(
                `UPDATE lapangan_futsal 
                SET nama_lapangan = ?, alamat = ?, latitude = ?, longitude = ?, 
                    harga_sewa = ?, deskripsi = ?, fasilitas = ?, foto = ?, 
                    telepon = ?, jam_operasional = ?
                WHERE id = ?`,
                [
                    data.nama_lapangan,
                    data.alamat,
                    data.latitude,
                    data.longitude,
                    data.harga_sewa,
                    data.deskripsi,
                    data.fasilitas,
                    data.foto,
                    data.telepon,
                    data.jam_operasional,
                    id
                ]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Menghapus data lapangan
     * @param {number} id - ID lapangan
     * @returns {Promise<Object>} Result delete
     */
    delete: async (id) => {
        try {
            const [result] = await pool.query(
                'DELETE FROM lapangan_futsal WHERE id = ?',
                [id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Filter dan search lapangan
     * @param {Object} filters - Object berisi filter criteria
     * @returns {Promise<Array>} Array lapangan yang terfilter
     */
    filterAndSearch: async (filters) => {
        try {
            let query = `
                SELECT 
                    l.*,
                    COALESCE(AVG(r.rating), 0) as avg_rating,
                    COUNT(r.id) as total_reviews
                FROM lapangan_futsal l
                LEFT JOIN rating r ON l.id = r.lapangan_id
                WHERE 1=1
            `;
            
            const params = [];

            // Search by nama lapangan atau alamat
            if (filters.search) {
                query += ` AND (l.nama_lapangan LIKE ? OR l.alamat LIKE ?)`;
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm);
            }

            // Filter by harga minimum
            if (filters.minPrice) {
                query += ` AND l.harga_sewa >= ?`;
                params.push(filters.minPrice);
            }

            // Filter by harga maksimum
            if (filters.maxPrice) {
                query += ` AND l.harga_sewa <= ?`;
                params.push(filters.maxPrice);
            }

            query += ` GROUP BY l.id`;

            // Filter by minimum rating (setelah GROUP BY)
            if (filters.minRating) {
                query += ` HAVING avg_rating >= ?`;
                params.push(filters.minRating);
            }

            // Sorting
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case 'price_asc':
                        query += ` ORDER BY l.harga_sewa ASC`;
                        break;
                    case 'price_desc':
                        query += ` ORDER BY l.harga_sewa DESC`;
                        break;
                    case 'rating_desc':
                        query += ` ORDER BY avg_rating DESC`;
                        break;
                    case 'rating_asc':
                        query += ` ORDER BY avg_rating ASC`;
                        break;
                    case 'name_asc':
                        query += ` ORDER BY l.nama_lapangan ASC`;
                        break;
                    case 'name_desc':
                        query += ` ORDER BY l.nama_lapangan DESC`;
                        break;
                    default:
                        query += ` ORDER BY l.created_at DESC`;
                }
            } else {
                query += ` ORDER BY l.created_at DESC`;
            }

            const [rows] = await pool.query(query, params);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get min and max price untuk filter range
     * @returns {Promise<Object>} Min dan max harga
     */
    getPriceRange: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    MIN(harga_sewa) as min_price,
                    MAX(harga_sewa) as max_price
                FROM lapangan_futsal
            `);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
};

const UserModel = {
    /**
     * Membuat user baru (registrasi)
     * @param {Object} data - Data user
     * @returns {Promise<Object>} Result insert
     */
    create: async (data) => {
        try {
            const [result] = await pool.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [data.username, data.email, data.password, data.role || 'user']
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mencari user berdasarkan username
     * @param {string} username - Username
     * @returns {Promise<Object>} Data user
     */
    findByUsername: async (username) => {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mencari user berdasarkan email
     * @param {string} email - Email
     * @returns {Promise<Object>} Data user
     */
    findByEmail: async (email) => {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mencari user berdasarkan ID
     * @param {number} id - User ID
     * @returns {Promise<Object>} Data user
     */
    findById: async (id) => {
        try {
            const [rows] = await pool.query(
                'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
};

const RatingModel = {
    /**
     * Menambah rating dan ulasan
     * @param {Object} data - Data rating
     * @returns {Promise<Object>} Result insert
     */
    create: async (data) => {
        try {
            const [result] = await pool.query(
                `INSERT INTO rating (user_id, lapangan_id, rating, ulasan) 
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                rating = VALUES(rating), 
                ulasan = VALUES(ulasan)`,
                [data.user_id, data.lapangan_id, data.rating, data.ulasan]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mengambil semua rating untuk lapangan tertentu
     * @param {number} lapanganId - ID lapangan
     * @returns {Promise<Array>} Array rating
     */
    getByLapanganId: async (lapanganId) => {
        try {
            const [rows] = await pool.query(
                `SELECT r.*, u.username 
                FROM rating r
                JOIN users u ON r.user_id = u.id
                WHERE r.lapangan_id = ?
                ORDER BY r.created_at DESC`,
                [lapanganId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mengambil semua rating (untuk admin)
     * @returns {Promise<Array>} Array semua rating
     */
    getAll: async () => {
        try {
            const [rows] = await pool.query(
                `SELECT r.*, u.username, l.nama_lapangan 
                FROM rating r
                JOIN users u ON r.user_id = u.id
                JOIN lapangan_futsal l ON r.lapangan_id = l.id
                ORDER BY r.created_at DESC`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Menghapus rating
     * @param {number} id - ID rating
     * @returns {Promise<Object>} Result delete
     */
    delete: async (id) => {
        try {
            const [result] = await pool.query(
                'DELETE FROM rating WHERE id = ?',
                [id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Cek apakah user sudah memberikan rating untuk lapangan tertentu
     * @param {number} userId - ID user
     * @param {number} lapanganId - ID lapangan
     * @returns {Promise<Object>} Data rating jika ada
     */
    checkUserRating: async (userId, lapanganId) => {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM rating WHERE user_id = ? AND lapangan_id = ?',
                [userId, lapanganId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
};

module.exports = {
    LapanganModel,
    UserModel,
    RatingModel
};
