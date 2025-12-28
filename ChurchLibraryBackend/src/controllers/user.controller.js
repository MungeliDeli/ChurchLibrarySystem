const db = require('../../models');
const { Op } = require('sequelize');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { page, limit, role, isActive, search } = req.query;
    
    // Build where clause
    const where = {};
    if (role) {
      where.role = role;
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await db.User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset: offset,
    });

    res.status(200).json({
      data: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error retrieving users.', error: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error retrieving user.', error: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

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
      role: role || 'member',
      isActive: isActive !== undefined ? isActive : true,
    });

    // Return user without password
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully.',
      user: userResponse,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user.', error: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive, password } = req.body;

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use.' });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) updateData.password = password; // Will be hashed by model hook

    const updatedUser = await user.update(updateData);

    // Return user without password
    const userResponse = updatedUser.toJSON();
    delete userResponse.password;

    res.status(200).json({
      message: 'User updated successfully.',
      user: userResponse,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user.', error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (req.user && req.user.id === id) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user.', error: error.message });
  }
};

// Get user activity
exports.getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await db.ActivityLog.findAndCountAll({
      where: { actorId: id },
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset: offset,
    });

    res.status(200).json({
      data: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Error retrieving user activity.', error: error.message });
  }
};

// Reset user password
exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required.' });
    }

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update password (will be hashed by model hook)
    await user.update({ password: newPassword });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password.', error: error.message });
  }
};

