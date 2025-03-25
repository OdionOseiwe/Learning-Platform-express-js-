import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import {connectDB} from './config/db.js';
import UserRouter from './routes/userRoutes.js';
import path from "path";

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

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    connectDB();
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
