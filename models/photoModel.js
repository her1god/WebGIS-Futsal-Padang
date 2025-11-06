/**
 * Model untuk Foto Lapangan
 */

const { pool } = require('./db');

const LapanganPhotoModel = {
    /**
     * Upload multiple photos untuk lapangan
     */
    async uploadPhotos(lapanganId, photos) {
        const values = photos.map(photo => [
            lapanganId,
            photo.url,
            photo.isPrimary || false,
            photo.caption || null
        ]);

        const query = `
            INSERT INTO lapangan_photos (lapangan_id, photo_url, is_primary, caption)
            VALUES ?
        `;

        const [result] = await pool.query(query, [values]);
        return result;
    },

    /**
     * Get all photos untuk lapangan tertentu
     */
    async getPhotosByLapanganId(lapanganId) {
        const query = `
            SELECT * FROM lapangan_photos
            WHERE lapangan_id = ?
            ORDER BY is_primary DESC, created_at ASC
        `;

        const [rows] = await pool.query(query, [lapanganId]);
        return rows;
    },

    /**
     * Set primary photo
     */
    async setPrimaryPhoto(photoId, lapanganId) {
        // Reset semua foto jadi bukan primary
        await pool.query(
            'UPDATE lapangan_photos SET is_primary = FALSE WHERE lapangan_id = ?',
            [lapanganId]
        );

        // Set foto terpilih jadi primary
        const query = 'UPDATE lapangan_photos SET is_primary = TRUE WHERE id = ?';
        const [result] = await pool.query(query, [photoId]);
        return result;
    },

    /**
     * Delete photo
     */
    async deletePhoto(photoId) {
        const query = 'DELETE FROM lapangan_photos WHERE id = ?';
        const [result] = await pool.query(query, [photoId]);
        return result;
    },

    /**
     * Get primary photo
     */
    async getPrimaryPhoto(lapanganId) {
        const query = `
            SELECT * FROM lapangan_photos
            WHERE lapangan_id = ? AND is_primary = TRUE
            LIMIT 1
        `;

        const [rows] = await pool.query(query, [lapanganId]);
        return rows[0] || null;
    }
};

module.exports = LapanganPhotoModel;
