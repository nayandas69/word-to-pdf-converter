/**
 * Convert Controller
 * 
 * This controller handles the core business logic for converting
 * Word documents to PDF format using the docx-pdf library.
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

const docxToPDF = require('docx-pdf');
const path = require('path');
const fs = require('fs');
const { generateUniqueFilename, cleanupFile } = require('../utils/fileUtils');

/**
 * Convert Word document to PDF
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const convertWordToPdf = async (req, res, next) => {
  let inputFilePath = null;
  let outputFilePath = null;

  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a Word document.'
      });
    }

    console.log(`📄 Converting file: ${req.file.originalname}`);
    
    // Set file paths
    inputFilePath = req.file.path;
    const outputFileName = generateUniqueFilename(req.file.originalname, '.pdf');
    outputFilePath = path.join(__dirname, '../../converted', outputFileName);

    // Convert Word document to PDF
    await new Promise((resolve, reject) => {
      docxToPDF(inputFilePath, outputFilePath, (err, result) => {
        if (err) {
          console.error('❌ Conversion error:', err);
          reject(new Error('Failed to convert document. Please ensure the file is a valid Word document.'));
        } else {
          console.log('✅ Conversion successful');
          resolve(result);
        }
      });
    });

    // Check if output file was created
    if (!fs.existsSync(outputFilePath)) {
      throw new Error('PDF file was not generated successfully');
    }

    // Get file stats for response headers
    const stats = fs.statSync(outputFilePath);
    const outputFileName_clean = path.basename(outputFilePath);

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${outputFileName_clean}"`);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'no-cache');

    // Send file as download
    res.download(outputFilePath, outputFileName_clean, (downloadErr) => {
      if (downloadErr) {
        console.error('❌ Download error:', downloadErr);
        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message: 'Error occurred while downloading the converted file'
          });
        }
      } else {
        console.log('📥 File downloaded successfully');
      }

      // Cleanup files after download (or error)
      setTimeout(() => {
        cleanupFile(inputFilePath);
        cleanupFile(outputFilePath);
      }, 5000); // Wait 5 seconds before cleanup to ensure download completes
    });

  } catch (error) {
    console.error('❌ Conversion process error:', error);

    // Cleanup files on error
    if (inputFilePath) cleanupFile(inputFilePath);
    if (outputFilePath) cleanupFile(outputFilePath);

    // Send error response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message || 'An error occurred during file conversion',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

module.exports = {
  convertWordToPdf
};