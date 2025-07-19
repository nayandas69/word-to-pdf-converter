/**
 * Upload Middleware
 * 
 * This middleware handles file upload configuration using Multer.
 * It defines storage settings, file filtering, and upload limits.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Multer storage configuration
 * Defines where and how uploaded files should be stored
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    cb(null, `${baseName}-${uniqueSuffix}${fileExtension}`);
  }
});

/**
 * File filter function
 * Validates file types before upload
 */
const fileFilter = (req, file, cb) => {
  // Check file extension
  const allowedExtensions = ['.doc', '.docx'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only .doc and .docx files are allowed.'), false);
  }
};

/**
 * Multer configuration
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 1 // Only allow one file at a time
  }
});

/**
 * Upload middleware for single file upload
 */
const uploadMiddleware = (req, res, next) => {
  const singleUpload = upload.single('file');
  
  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      let message = 'File upload error';
      
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          message = 'File size too large. Maximum size allowed is 10MB.';
          break;
        case 'LIMIT_FILE_COUNT':
          message = 'Too many files. Only one file is allowed.';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          message = 'Unexpected file field. Please use "file" as the field name.';
          break;
        default:
          message = err.message;
      }
      
      return res.status(400).json({
        success: false,
        message: message,
        error: 'UPLOAD_ERROR'
      });
    } else if (err) {
      // Handle other errors (like file type validation)
      return res.status(400).json({
        success: false,
        message: err.message,
        error: 'VALIDATION_ERROR'
      });
    }
    
    // No error, proceed to next middleware
    next();
  });
};

module.exports = {
  uploadMiddleware
};