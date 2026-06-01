import mongoose from 'mongoose';

const VersionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

VersionSchema.index({ projectId: 1, versionNumber: 1 }, { unique: true });

export const Version = mongoose.model('Version', VersionSchema);
export default Version;
