'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email already exists',
        },
        validate: {
          isEmail: {
            msg: 'Please provide a valid email address',
          },
          notEmpty: {
            msg: 'Email is required',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password is required',
          },
          len: {
            args: [6, 255],
            msg: 'Password must be at least 6 characters long',
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Name is required',
          },
          len: {
            args: [2, 100],
            msg: 'Name must be between 2 and 100 characters',
          },
        },
      },
      role: {
        type: DataTypes.ENUM('admin', 'librarian', 'member'),
        allowNull: false,
        defaultValue: 'member',
        validate: {
          isIn: {
            args: [['admin', 'librarian', 'member']],
            msg: 'Role must be admin, librarian, or member',
          },
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: false,
      hooks: {
        // Hash password before creating user
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        // Hash password before updating if it changed
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  // Instance method to compare password
  User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Instance method to get user without password
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  // Instance method to update last login
  User.prototype.updateLastLogin = async function () {
    this.lastLogin = new Date();
    return await this.save();
  };

  // Static method to find user by email
  User.findByEmail = async function (email) {
    return await this.findOne({ where: { email } });
  };

  // Static method to find active user by email
  User.findActiveByEmail = async function (email) {
    return await this.findOne({
      where: {
        email,
        isActive: true,
      },
    });
  };

  User.associate = function (models) {
    // Define associations here if needed
    // Example: User.hasMany(models.Borrowing, { foreignKey: 'userId' });
  };

  return User;
};

