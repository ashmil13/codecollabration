import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Please add code content']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Project = mongoose.model('Project', ProjectSchema);
export default Project;
