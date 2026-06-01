import Project from '../models/project.js';
import Version from '../models/version.js';


export const addProjectVersion = async (req, res, next) => {
  try {
    const { code } = req.body;
    const { id } = req.params;


    if (!code) {
      return res.status(400).json({ success: false, error: 'Please provide code content for the new version' });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to edit this project' });
    }
    const lastVersion = await Version.findOne({ projectId: id }).sort({ versionNumber: -1 });
    const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    await Version.create({
      projectId: id,
      user: req.user.id,
      userName: req.user.name,
      projectName: project.projectName,
      versionNumber: nextVersionNumber,
      code
    });


    project.code = code;
    await project.save();

    const versions = await Version.find({ projectId: id }).sort({ versionNumber: 1 });
    
    const projectObj = project.toObject();
    projectObj.versions = versions;

    return res.status(200).json({
      success: true,
      message: `Version ${nextVersionNumber} saved successfully`,
      data: projectObj
    });
  } catch (error) {
    next(error);
  }
};


export const updateProjectVersion = async (req, res, next) => {
  try {
    const { code } = req.body;
    const { id, versionNumber } = req.params;


    if (!code) {
      return res.status(400).json({ success: false, error: 'Please provide code content' });
    }
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to edit this project' });
    }
    const versionObj = await Version.findOne({ projectId: id, versionNumber: parseInt(versionNumber) });
    if (!versionObj) {
      return res.status(404).json({ success: false, error: `Version ${versionNumber} not found` });
    }
    versionObj.code = code;
    if (!versionObj.user) versionObj.user = req.user.id;
    if (!versionObj.userName) versionObj.userName = req.user.name;
    if (!versionObj.projectName) versionObj.projectName = project.projectName;

    await versionObj.save();
    const lastVersion = await Version.findOne({ projectId: id }).sort({ versionNumber: -1 });
    if (lastVersion && lastVersion.versionNumber === parseInt(versionNumber)) {
      project.code = code;
      await project.save();
    }

    const versions = await Version.find({ projectId: id }).sort({ versionNumber: 1 });
    
    const projectObj = project.toObject();
    projectObj.versions = versions;

    return res.status(200).json({
      success: true,
      message: `Version ${versionNumber} updated successfully`,
      data: projectObj
    });
  } catch (error) {
    next(error);
  }
};


export const deleteProjectVersion = async (req, res, next) => {
  try {
    const { id, versionNumber } = req.params;


    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to edit this project' });
    }

    const totalVersions = await Version.countDocuments({ projectId: id });
    if (totalVersions <= 1) {
      return res.status(400).json({ success: false, error: 'Cannot delete the only remaining version of a project' });
    }

    
    const deleteResult = await Version.deleteOne({ projectId: id, versionNumber: parseInt(versionNumber) });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ success: false, error: `Version ${versionNumber} not found` });
    }

    
    const remainingVersions = await Version.find({ projectId: id }).sort({ versionNumber: 1 });
    
    for (let i = 0; i < remainingVersions.length; i++) {
      remainingVersions[i].versionNumber = i + 1;
      
    
      if (!remainingVersions[i].user) remainingVersions[i].user = req.user.id;
      if (!remainingVersions[i].userName) remainingVersions[i].userName = req.user.name;
      if (!remainingVersions[i].projectName) remainingVersions[i].projectName = project.projectName;

      await remainingVersions[i].save();
    }

    project.code = remainingVersions[remainingVersions.length - 1].code;
    await project.save();

    const projectObj = project.toObject();
    projectObj.versions = remainingVersions;

    return res.status(200).json({
      success: true,
      message: `Version ${versionNumber} deleted successfully`,
      data: projectObj
    });
  } catch (error) {
    next(error);
  }
};
