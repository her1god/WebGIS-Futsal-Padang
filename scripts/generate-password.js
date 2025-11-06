/**
 * Script untuk generate password hash
 * Jalankan: node scripts/generate-password.js your_password
 */

const bcrypt = require('bcryptjs');

// Get password from command line argument
const password = process.argv[2];

if (!password) {
    console.log('\n========================================');
    console.log('🔐 Generate Password Hash');
    console.log('========================================\n');
    console.log('Usage: node scripts/generate-password.js <password>');
    console.log('Example: node scripts/generate-password.js mySecurePassword123\n');
    process.exit(1);
}

// Generate hash
const hash = bcrypt.hashSync(password, 10);

console.log('\n========================================');
console.log('✅ Password Hash Generated');
console.log('========================================\n');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nGunakan hash ini untuk insert ke database:');
console.log('\nINSERT INTO users (username, email, password, role)');
console.log(`VALUES ('username', 'email@example.com', '${hash}', 'user');\n`);
