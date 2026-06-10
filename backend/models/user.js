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
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
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
  const normalizedRole = this.role ? this.role.toLowerCase() : 'user';
  if (normalizedRole === 'superadmin') {
    this.isSuperAdmin = true;
    this.isAdmin = true;
    this.role = 'superadmin';
  } else if (normalizedRole === 'admin') {
    this.isSuperAdmin = false;
    this.isAdmin = true;
    this.role = 'admin';
  } else {
    this.isSuperAdmin = false;
    this.isAdmin = false;
    this.role = 'user';
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
