import Project from '../models/project.js';
import Version from '../models/version.js';


export const createProject = async (req, res, next) => {
  try {
    const { projectName, code } = req.body;


    if (!projectName || !code) {
      return res.status(400).json({ success: false, error: 'Please provide both project name and code content' });
    }

    
    const project = await Project.create({
      projectName,
      code,
      user: req.user.id
    });


    const firstVersion = await Version.create({
      projectId: project._id,
      user: req.user.id,
      userName: req.user.name,
      projectName,
      versionNumber: 1,
      code
    });

    
    const projectObj = project.toObject();
    projectObj.versions = [firstVersion];

    return res.status(201).json({
      success: true,
      message: 'Project uploaded successfully',
      data: projectObj
    });
  } catch (error) {
    next(error);
  }
};


export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};


export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

 
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }


    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to access this project' });
    }

   
    let versions = await Version.find({ projectId: project._id }).sort({ versionNumber: 1 });


    if (!versions || versions.length === 0) {
      const defaultVersion = await Version.create({
        projectId: project._id,
        user: project.user,
        userName: req.user.name,
        projectName: project.projectName,
        versionNumber: 1,
        code: project.code,
        createdAt: project.createdAt
      });
      versions = [defaultVersion];
    }

    const projectObj = project.toObject();
    projectObj.versions = versions;

    return res.status(200).json({
      success: true,
      data: projectObj
    });
  } catch (error) {
    next(error);
  }
};


export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);


    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

  
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this project' });
    }

    
    await project.deleteOne();

 
    await Version.deleteMany({ projectId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
