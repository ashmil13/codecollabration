import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d'
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, isAdmin, isSuperAdmin } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    let initialRole = role || 'User';
    if (isSuperAdmin || role === 'SuperAdmin') {
      initialRole = 'SuperAdmin';
    } else if (isAdmin || role === 'Admin') {
      initialRole = 'Admin';
    }

    const user = await User.create({
      name,
      email,
      password,
      role: initialRole,
      isAdmin: initialRole === 'Admin' || initialRole === 'SuperAdmin',
      isSuperAdmin: initialRole === 'SuperAdmin',
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
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

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
