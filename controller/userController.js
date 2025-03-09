const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // Validate password length (at least 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password_hash: passwordHash,
      role: role || 1, // Default role is 1 if not provided
    });

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Validate the password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return success response with token and user details
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the request parameters

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    await user.destroy();

    // Return success response
    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the request parameters
    const { currentPassword, newPassword, username, role } = req.body; // Get updated fields from the request body

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the current password
    if (currentPassword) {
      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
    }

    // Update the user's details
    if (username) user.username = username;
    if (role) user.role = role;

    // Update the password if a new one is provided
    if (newPassword) {
      // Validate new password length (you can adjust this as per your requirements)
      if (newPassword.length < 8) {
        return res.status(400).json({ error: "New password must be at least 8 characters long" });
      }

      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      user.password_hash = passwordHash;
    }

    // Save the updated user
    await user.save();

    // Return success response
    res.json({
      message: "User updated successfully",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    // Return the list of users
    res.json({
      message: "All users fetched successfully",
      users,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};