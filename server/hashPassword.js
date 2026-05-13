/**
 * hashPassword.js — one-time utility to generate a bcrypt hash.
 *
 * Usage:
 *   node hashPassword.js mySecretPassword
 *
 * Copy the printed hash into ADMIN_PASS_HASH in your .env file.
 */

const bcrypt = require('bcryptjs');

const plain = process.argv[2];

if (!plain) {
  console.error('Usage: node hashPassword.js <password>');
  process.exit(1);
}

bcrypt.hash(plain, 12).then((hash) => {
  console.log('\nBcrypt hash (paste into .env as ADMIN_PASS_HASH):\n');
  console.log(hash);
  console.log();
});
