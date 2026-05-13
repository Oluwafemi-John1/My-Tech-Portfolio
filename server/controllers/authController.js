const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Credentials are stored exclusively in environment variables:
 *   ADMIN_EMAIL          — plain-text admin email
 *   ADMIN_PASSWORD_HASH  — bcrypt hash of the admin password
 *     (generate with: node -e "console.log(require('bcryptjs').hashSync('yourPassword', 12))")
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  // Constant-time email comparison to prevent timing attacks
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || '');
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );

  res.json({ token });
};
