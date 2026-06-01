import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    (req.headers.authorization.startsWith('Bearer') || req.headers.authorization.startsWith('Bearer '))
  ) {
    try {
      token = req.headers.authorization.split(' ')[1] || req.headers.authorization;

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');

      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  } else {
    token = req.headers.authorization;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
        req.user = await User.findById(decoded.id);
        if (req.user) {
          return next();
        }
      } catch (err) {}
    }
    
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'SuperAdmin' || req.user.isAdmin || req.user.isSuperAdmin)) {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Access denied: Admins only' });
  }
};

export const superAdminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'SuperAdmin' || req.user.isSuperAdmin)) {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Access denied: SuperAdmins only' });
  }
};

export default protect;
