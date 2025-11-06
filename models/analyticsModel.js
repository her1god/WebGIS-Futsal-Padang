/**
 * Model untuk Analytics Dashboard
 */

const { pool } = require('./db');

const AnalyticsModel = {
    /**
     * Get statistik umum
     */
    async getGeneralStats() {
        const queries = {
            totalLapangan: 'SELECT COUNT(*) as count FROM lapangan_futsal',
            totalUsers: "SELECT COUNT(*) as count FROM users WHERE role = 'user'",
            totalReviews: 'SELECT COUNT(*) as count FROM rating',
            avgRating: 'SELECT AVG(rating) as avg FROM rating'
        };

        const [lapangan] = await pool.query(queries.totalLapangan);
        const [users] = await pool.query(queries.totalUsers);
        const [reviews] = await pool.query(queries.totalReviews);
        const [avgRating] = await pool.query(queries.avgRating);

        return {
            total_lapangan: lapangan[0].count,
            total_users: users[0].count,
            total_reviews: reviews[0].count,
            avg_rating: parseFloat(avgRating[0].avg || 0).toFixed(1)
        };
    },

    /**
     * Get lapangan paling populer (berdasarkan rating)
     */
    async getPopularLapangan(limit = 5) {
        const query = `
            SELECT 
                l.id,
                l.nama_lapangan,
                l.alamat,
                l.harga_sewa,
                COALESCE(AVG(r.rating), 0) as avg_rating,
                COUNT(r.id) as total_reviews
            FROM lapangan_futsal l
            LEFT JOIN rating r ON l.id = r.lapangan_id
            GROUP BY l.id
            ORDER BY avg_rating DESC, total_reviews DESC
            LIMIT ?
        `;

        const [rows] = await pool.query(query, [limit]);
        return rows;
    },

    /**
     * Get rating distribution (berapa banyak rating 1-5 bintang)
     */
    async getRatingDistribution() {
        const query = `
            SELECT 
                rating,
                COUNT(*) as count
            FROM rating
            GROUP BY rating
            ORDER BY rating ASC
        `;

        const [rows] = await pool.query(query);
        return rows;
    },

    /**
     * Get rating per bulan (6 bulan terakhir)
     */
    async getRatingPerMonth(months = 6) {
        const query = `
            SELECT 
                YEAR(created_at) as year,
                MONTH(created_at) as month,
                COUNT(*) as total_ratings,
                AVG(rating) as avg_rating
            FROM rating
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
            GROUP BY YEAR(created_at), MONTH(created_at)
            ORDER BY year ASC, month ASC
        `;

        const [rows] = await pool.query(query, [months]);
        return rows;
    },

    /**
     * Get user registration per bulan
     */
    async getUserRegistrationPerMonth(months = 6) {
        const query = `
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COUNT(*) as count
            FROM users
            WHERE role = 'user' AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month ASC
        `;

        const [rows] = await pool.query(query, [months]);
        return rows;
    },

    /**
     * Get harga range lapangan
     */
    async getPriceRange() {
        const query = `
            SELECT 
                MIN(harga_sewa) as min_price,
                MAX(harga_sewa) as max_price,
                AVG(harga_sewa) as avg_price
            FROM lapangan_futsal
        `;

        const [rows] = await pool.query(query);
        return rows[0];
    },

    /**
     * Get recent activities
     */
    async getRecentActivities(limit = 10) {
        const query = `
            SELECT 
                r.id,
                u.username,
                l.nama_lapangan,
                r.rating,
                r.ulasan,
                r.created_at
            FROM rating r
            JOIN users u ON r.user_id = u.id
            JOIN lapangan_futsal l ON r.lapangan_id = l.id
            ORDER BY r.created_at DESC
            LIMIT ?
        `;

        const [rows] = await pool.query(query, [limit]);
        return rows;
    }
};

module.exports = AnalyticsModel;
