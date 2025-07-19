/**
 * Convert Routes
 * 
 * This file defines all the routes related to file conversion functionality.
 * It handles file upload, validation, conversion, and download operations.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

const express = require('express');
const router = express.Router();
const { convertWordToPdf } = require('../controllers/convertController');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');
const { validateFile } = require('../middleware/validationMiddleware');

/**
 * POST /api/convert
 * 
 * Converts a Word document to PDF format
 * 
 * @route POST /api/convert
 * @access Public
 * @param {File} file - Word document file (.doc or .docx)
 * @returns {File} PDF file download
 */
router.post('/convert', 
  uploadMiddleware,     // Handle file upload
  validateFile,         // Validate uploaded file
  convertWordToPdf      // Convert and send PDF
);

module.exports = router;