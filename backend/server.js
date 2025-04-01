import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import UserRouter from './routes/userRoutes.js';
import LessonRouter from './routes/lessonRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

// Set security headers
app.use(helmet());

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1', UserRouter);
app.use('/api/v1/lessons', LessonRouter);
// app.use('/api/videos', require('./routes/videoRoutes'));

try {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
  
  try {
    new mongoose.mongo.GridFSBucket(mongoose.connection.db, {bucketName: 'videos'})
      console.log('GridFS Ready');
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
    
  }
   
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});



