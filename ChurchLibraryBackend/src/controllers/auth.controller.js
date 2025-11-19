const db = require('../../models');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Create new user (password will be hashed by the model's hook)
    const newUser = await db.User.create({
      name,
      email,
      password,
      role, // 'member' is the default if not provided
    });

    res.status(201).json({
      message: 'User registered successfully.',
      user: newUser, // newUser.toJSON() is called automatically
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user.', error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
    }

    // User is authenticated, create a JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'a-very-secret-key', // Use a secret from .env in production
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful.',
      user: user, // user.toJSON() is called automatically
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in.', error: error.message });
  }
};