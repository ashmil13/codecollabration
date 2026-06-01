import User from '../models/superAdmin.js';
import Project from '../models/project.js';


export const getSuperAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'Admin' });
    const totalSuperAdmins = await User.countDocuments({ role: 'SuperAdmin' });

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

    const validRoles = ['User', 'Admin', 'SuperAdmin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role. Allowed roles are: ${validRoles.join(', ')}`
      });
    }


    let isAdmin = false;
    let isSuperAdmin = false;
    if (role === 'SuperAdmin') {
      isAdmin = true;
      isSuperAdmin = true;
    } else if (role === 'Admin') {
      isAdmin = true;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role, isAdmin, isSuperAdmin },
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
