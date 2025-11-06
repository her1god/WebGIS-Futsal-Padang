-- ================================================
-- SEED DATA untuk WebGIS Futsal Padang
-- ================================================
-- File ini berisi data awal untuk testing/development
-- JANGAN gunakan password ini untuk production!
-- ================================================

USE futsal_db;

-- ================================================
-- 1. INSERT USER ADMIN
-- ================================================
-- Default Admin Account
-- Username: admin
-- Password: admin123 (hashed dengan bcrypt)
-- PENTING: Ganti password ini setelah login pertama kali!

INSERT INTO `users` (`username`, `email`, `password`, `role`, `created_at`) VALUES
('admin', 'admin@futsal.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8xJvTPqPeE.Qr/pPQ6bQ3pzSXrKmLG', 'admin', NOW())
ON DUPLICATE KEY UPDATE 
    `password` = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8xJvTPqPeE.Qr/pPQ6bQ3pzSXrKmLG',
    `role` = 'admin';

-- ================================================
-- 2. SAMPLE USER (Optional untuk testing)
-- ================================================
-- Username: user1
-- Password: user123

INSERT INTO `users` (`username`, `email`, `password`, `role`, `created_at`) VALUES
('user1', 'user1@example.com', '$2a$10$YourHashedPasswordHere', 'user', NOW())
ON DUPLICATE KEY UPDATE username = username;

-- ================================================
-- 3. SAMPLE LAPANGAN FUTSAL (Optional)
-- ================================================
-- Contoh data lapangan di Kota Padang
-- Koordinat menggunakan lokasi real di Padang

INSERT INTO `lapangan_futsal` 
(`nama_lapangan`, `alamat`, `latitude`, `longitude`, `harga_sewa`, `deskripsi`, `fasilitas`, `telepon`, `jam_operasional`) 
VALUES
('Lapangan Futsal Universitas Andalas', 
 'Jl. Perintis Kemerdekaan No.77, Jati, Kec. Padang Tim., Kota Padang', 
 -0.914722, 100.462500, 150000,
 'Lapangan futsal dengan rumput sintetis berkualitas, lokasi strategis di kampus Unand',
 'Parkir Luas, Kantin, Toilet, Ruang Ganti, Musholla',
 '0751-71181', '08:00 - 22:00'),

('GOR H. Agus Salim', 
 'Jl. H. Agus Salim, Padang Pasir, Kec. Padang Bar., Kota Padang', 
 -0.954167, 100.352778, 200000,
 'Lapangan futsal indoor dengan fasilitas lengkap',
 'AC, Parkir, Kantin, Toilet, Ruang Ganti, Tribun',
 '0751-7051234', '07:00 - 23:00'),

('Lapangan Imam Bonjol', 
 'Jl. Imam Bonjol, Olo, Kec. Padang Bar., Kota Padang', 
 -0.960278, 100.364167, 120000,
 'Lapangan outdoor dengan pencahayaan bagus untuk main malam',
 'Parkir, Toilet, Ruang Ganti',
 '0812-7654-3210', '06:00 - 22:00')
ON DUPLICATE KEY UPDATE nama_lapangan = nama_lapangan;

-- ================================================
-- 4. SAMPLE RATING (Optional)
-- ================================================
-- Contoh rating dari user ke lapangan

INSERT INTO `rating` (`user_id`, `lapangan_id`, `rating`, `ulasan`, `created_at`)
SELECT 1, 1, 5, 'Lapangan bagus, rumput sintetis masih baru!', NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND EXISTS (SELECT 1 FROM lapangan_futsal WHERE id = 1)
ON DUPLICATE KEY UPDATE rating = rating;

-- ================================================
-- VERIFICATION QUERIES
-- ================================================
-- Uncomment untuk verifikasi data berhasil di-insert

-- SELECT 'Users:' as Info, COUNT(*) as Total FROM users;
-- SELECT 'Lapangan:' as Info, COUNT(*) as Total FROM lapangan_futsal;
-- SELECT 'Ratings:' as Info, COUNT(*) as Total FROM rating;

-- ================================================
-- NOTES
-- ================================================
-- 1. Password admin123 sudah di-hash dengan bcrypt
-- 2. Untuk generate password baru, jalankan:
--    node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"
-- 3. Data sample lapangan bisa dihapus setelah input data real
-- 4. WAJIB ganti password admin setelah deploy production!
-- ================================================
