import User from '../models/user.js';
import Project from '../models/project.js';


export const getSuperAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $nin: ['admin', 'Admin', 'superadmin', 'SuperAdmin'] } });
    const totalProjects = await Project.countDocuments();
    const totalAdmins = await User.countDocuments({ role: { $in: ['admin', 'Admin'] } });
    const totalSuperAdmins = await User.countDocuments({ role: { $in: ['superadmin', 'SuperAdmin'] } });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProjects,
        totalAdmins,
        totalSuperAdmins
      }
    });
  } catch (error) {
    next(error);
  }
};


export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    const validRoles = ['user', 'admin', 'superadmin'];
    const normalizedRole = role ? role.toLowerCase() : '';
    if (!role || !validRoles.includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role. Allowed roles are: ${validRoles.join(', ')}`
      });
    }


    let isAdmin = normalizedRole === 'admin' || normalizedRole === 'superadmin';
    let isSuperAdmin = normalizedRole === 'superadmin';

    const user = await User.findByIdAndUpdate(
      userId,
      { role: normalizedRole, isAdmin, isSuperAdmin },
      { new: true, runValidators: false }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin
      }
    });
  } catch (error) {
    next(error);
  }
};


