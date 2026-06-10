import User from '../models/user.js';
import Project from '../models/project.js';
import Version from '../models/version.js';


export const getAdminStats = async (req, res, next) => {
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


export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};


export const deleteProjectByAdmin = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await project.deleteOne();
    await Version.deleteMany({ projectId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully by Admin'
    });
  } catch (error) {
    next(error);
  }
};


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};


export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot delete your own admin account' });
    }

    
    const projects = await Project.find({ user: user._id });
    const projectIds = projects.map(p => p._id);

    await Version.deleteMany({ projectId: { $in: projectIds } });
    await Project.deleteMany({ user: user._id });

   
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully by Admin'
    });
  } catch (error) {
    next(error);
  }
};


export const getAllVersionsByAdmin = async (req, res, next) => {
  try {
    const versions = await Version.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: versions.length,
      data: versions
    });
  } catch (error) {
    next(error);
  }
};


export const deleteVersionByAdmin = async (req, res, next) => {
  try {
    const versionObj = await Version.findById(req.params.id);
    if (!versionObj) {
      return res.status(404).json({ success: false, error: 'Version not found' });
    }

    const projectId = versionObj.projectId;

  
    const totalVersions = await Version.countDocuments({ projectId });
    if (totalVersions <= 1) {
      return res.status(400).json({ success: false, error: 'Cannot delete the only remaining version of a project' });
    }


    await versionObj.deleteOne();


    const remainingVersions = await Version.find({ projectId }).sort({ versionNumber: 1 });
    for (let i = 0; i < remainingVersions.length; i++) {
      remainingVersions[i].versionNumber = i + 1;
      await remainingVersions[i].save();
    }

 
    const project = await Project.findById(projectId);
    if (project && remainingVersions.length > 0) {
      project.code = remainingVersions[remainingVersions.length - 1].code;
      await project.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Version deleted successfully by Admin'
    });
  } catch (error) {
    next(error);
  }
};


