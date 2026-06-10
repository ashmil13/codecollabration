import mongoose from 'mongoose';
import User from '../models/user.js';


export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codecollabration');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const email = 'super@gmail.com';
    const superadmin = await User.findOne({ email });
    if (!superadmin) {
      await User.create({
        name: 'SuperAdmin',
        email,
        password: 'ashmil',
        role: 'superadmin',
        isAdmin: true,
        isSuperAdmin: true,
        profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
      });
      console.log('SuperAdmin user seeded successfully!');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

