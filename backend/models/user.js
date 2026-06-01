import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: function () {
      return this.isNew;
    },
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['User', 'Admin', 'SuperAdmin'],
    default: 'User'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

UserSchema.pre('save', async function (next) {
  if (this.role === 'SuperAdmin') {
    this.isSuperAdmin = true;
    this.isAdmin = true;
  } else if (this.role === 'Admin') {
    this.isSuperAdmin = false;
    this.isAdmin = true;
  } else if (this.role === 'User') {
    this.isSuperAdmin = false;
    this.isAdmin = false;
  } else {
    if (this.isSuperAdmin) {
      this.role = 'SuperAdmin';
      this.isAdmin = true;
    } else if (this.isAdmin) {
      this.role = 'Admin';
      this.isSuperAdmin = false;
    } else {
      this.role = 'User';
      this.isAdmin = false;
      this.isSuperAdmin = false;
    }
  }

  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', UserSchema);
export default User;
