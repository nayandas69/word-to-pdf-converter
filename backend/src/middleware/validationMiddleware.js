/**
 * Validation Middleware
 * 
 * This middleware provides additional validation for uploaded files
 * beyond the basic Multer file filtering.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

const fs = require('fs');
const path = require('path');

/**
 * Validate uploaded file
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateFile = (req, res, next) => {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a Word document.',
        error: 'NO_FILE'
      });
    }

    const { originalname, mimetype, size, path: filePath } = req.file;

    // Validate file extension
    const allowedExtensions = ['.doc', '.docx'];
    const fileExtension = path.extname(originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      // Remove uploaded file if validation fails
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only .doc and .docx files are allowed.',
        error: 'INVALID_FILE_TYPE'
      });
    }

    // Validate MIME type
    const allowedMimeTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedMimeTypes.includes(mimetype)) {
      // Remove uploaded file if validation fails
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Please upload a valid Word document.',
        error: 'INVALID_MIME_TYPE'
      });
    }

    // Validate file size (additional check)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
    if (size > maxSize) {
      // Remove uploaded file if validation fails
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: `File size too large. Maximum size allowed is ${Math.round(maxSize / (1024 * 1024))}MB.`,
        error: 'FILE_TOO_LARGE'
      });
    }

    // Check if file actually exists on disk
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        message: 'File upload failed. Please try again.',
        error: 'FILE_NOT_FOUND'
      });
    }

    // Validate file is not empty
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Uploaded file is empty. Please select a valid Word document.',
        error: 'EMPTY_FILE'
      });
    }

    console.log(`✅ File validation passed: ${originalname} (${Math.round(size / 1024)}KB)`);
    
    // All validations passed, proceed to next middleware
    next();

  } catch (error) {
    console.error('❌ File validation error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'File validation failed. Please try again.',
      error: 'VALIDATION_ERROR'
    });
  }
};

module.exports = {
  validateFile
};