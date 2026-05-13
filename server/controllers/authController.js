const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

/**
 * POST /api/auth/login
 * Body: { username, password }
 *
 * Credentials are stored exclusively in environment variables:
 *   ADMIN_USER       — plain-text admin username
 *   ADMIN_PASS_HASH  — bcrypt hash of the admin password
 *     (generate with: node hashPassword.js yourPassword)
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  if (username !== process.env.ADMIN_USER) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASS_HASH || '');
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' },
  );

  res.json({ token });
};
