import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d'
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }
    // Enforce minimum password length of 8 characters
    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    let initialRole = role || 'user';
    const normalizedRole = initialRole.toLowerCase();

    try {
      const user = await User.create({
        name,
        email,
        password,
        role: normalizedRole,
        isAdmin: normalizedRole === 'admin' || normalizedRole === 'superadmin',
        isSuperAdmin: normalizedRole === 'superadmin',
        profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        accessToken: generateToken(user._id),
        userId: user._id,
        name: user.name,
        role: user.role,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        profileImage: user.profileImage
      });
    } catch (createError) {
      console.error('Error creating user:', createError);
      // Mongoose duplicate key error
      if (createError.code === 11000) {
        return res.status(400).json({ success: false, error: 'User with this email already exists' });
      }
      // Validation errors
      if (createError.name === 'ValidationError') {
        const messages = Object.values(createError.errors).map(val => val.message).join(', ');
        return res.status(400).json({ success: false, error: messages });
      }
      // Fallback
      return res.status(500).json({ success: false, error: 'Server error while creating user' });
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(401).json({
        success: false,
        error: "The selected role does not match your account's assigned role"
      });
    }

    return res.status(200).json({
      success: true,
      accessToken: generateToken(user._id),
      userId: user._id,
      name: user.name,
      role: user.role,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      profileImage: user.profileImage
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
