import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage'
import crypto from 'crypto';
import path from 'path';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']; // Specific video types
const BUCKET_NAME = 'videos'; // GridFS bucket name

// Create storage engine with improved error handling and configuration
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  
  // MongoDB connection options (updated to current recommended settings)
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true, // Enable retryable writes
    w: 'majority' // Write concern
  },
  
  // File configuration with enhanced metadata and validation
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Generate cryptographically secure random bytes for filename
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.error('Error generating random filename:', err);
          return reject(new Error('Failed to generate secure filename'));
        }
        
        // Create a unique filename with original extension
        const fileExt = path.extname(file.originalname).toLowerCase();
        const filename = `${buf.toString('hex')}${fileExt}`;
        
        // Construct file metadata object
        const fileInfo = {
          filename: filename,
          bucketName: BUCKET_NAME,
          metadata: {
            originalName: file.originalname,
            uploadedBy: req.user?._id || 'anonymous', // More concise null check
            contentType: file.mimetype,
            uploadDate: new Date(), // Track when file was uploaded
            size: file.size, // Store original file size
            ipAddress: req.ip // Track upload source IP
          }
        };
        
        resolve(fileInfo);
      });
    });
  }
});

const fileFilter = (req, file, cb) => {
  try {
    // Check if file is one of the allowed video types
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    }
    
    const error = new Error(`Unsupported file type. Only ${ALLOWED_MIME_TYPES.join(', ')} are allowed.`);
    error.code = 'LIMIT_FILE_TYPE'; // Add error code for client handling
    cb(error, false);
  } catch (err) {
      console.error('File filter error:', err);
    cb(new Error('File validation failed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { 
    fileSize: MAX_FILE_SIZE,
    files: 1 // Limit to single file uploads
  },
  // Enable detailed error messages
  onError: (err, next) => {
    console.error('Upload error:', err);
    next(err);
  }
});

upload.errorHandler = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_TYPE') {
    return res.status(415).json({ 
      error: err.message 
    });
  }
  res.status(500).json({ 
    error: 'File upload failed',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = upload;