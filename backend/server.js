import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRouter.js';
import projectRouter from './routes/projectRouter.js';
import versionRouter from './routes/versionRouter.js';
import adminRouter from './routes/adminRouter.js';
import superAdminRouter from './routes/SuperAdminRouter.js';

dotenv.config();

const app = express();


connectDB();

app.use(cors({
  origin: ["http://localhost:5173", process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use('/api', userRouter);
app.use('/api', projectRouter);
app.use('/api', versionRouter);
app.use('/api', adminRouter);
app.use('/api', superAdminRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({ success: false, error: message });
  }

  if (err.code === 11000) {
    return res.status(400).json({ success: false, error: 'User with this email already exists' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running in development mode on port ${PORT}`);
  console.log(` Health Check URL: http://localhost:${PORT}/`);
});

export default app;
