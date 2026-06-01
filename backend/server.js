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
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use('/api', userRouter);
app.use('/api', projectRouter);
app.use('/api', versionRouter);
app.use('/api', adminRouter);
app.use('/api', superAdminRouter);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in development mode on port ${PORT}`);
  console.log(`📡 Health Check URL: http://localhost:${PORT}/`);
});
