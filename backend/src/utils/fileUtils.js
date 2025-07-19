/**
 * File Utilities
 * 
 * This module provides utility functions for file operations
 * including directory creation, file cleanup, and filename generation.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

const fs = require('fs');
const path = require('path');

/**
 * Create necessary directories for the application
 */
const createDirectories = () => {
  const directories = [
    path.join(__dirname, '../../uploads'),
    path.join(__dirname, '../../converted')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

/**
 * Generate a unique filename with timestamp
 * 
 * @param {string} originalName - Original filename
 * @param {string} newExtension - New file extension (optional)
 * @returns {string} Unique filename
 */
const generateUniqueFilename = (originalName, newExtension = null) => {
  const timestamp = Date.now();
  const randomSuffix = Math.round(Math.random() * 1E9);
  const baseName = path.basename(originalName, path.extname(originalName));
  const extension = newExtension || path.extname(originalName);
  
  // Clean filename of special characters
  const cleanBaseName = baseName.replace(/[^a-zA-Z0-9\-_]/g, '_');
  
  return `${cleanBaseName}_${timestamp}_${randomSuffix}${extension}`;
};

/**
 * Safely delete a file
 * 
 * @param {string} filePath - Path to the file to delete
 */
const cleanupFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Cleaned up file: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error cleaning up file ${filePath}:`, error.message);
  }
};

/**
 * Clean up old files in a directory (older than specified hours)
 * 
 * @param {string} directoryPath - Path to the directory
 * @param {number} maxAgeHours - Maximum age in hours (default: 24)
 */
const cleanupOldFiles = (directoryPath, maxAgeHours = 24) => {
  try {
    if (!fs.existsSync(directoryPath)) {
      return;
    }

    const files = fs.readdirSync(directoryPath);
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    const now = Date.now();

    files.forEach(file => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAgeMs) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Cleaned up old file: ${file}`);
      }
    });
  } catch (error) {
    console.error(`❌ Error cleaning up old files in ${directoryPath}:`, error.message);
  }
};

/**
 * Get file size in human readable format
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Schedule cleanup of old files every hour
setInterval(() => {
  cleanupOldFiles(path.join(__dirname, '../../uploads'));
  cleanupOldFiles(path.join(__dirname, '../../converted'));
}, 60 * 60 * 1000); // 1 hour

module.exports = {
  createDirectories,
  generateUniqueFilename,
  cleanupFile,
  cleanupOldFiles,
  formatFileSize
};