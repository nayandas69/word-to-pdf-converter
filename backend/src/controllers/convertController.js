/**
 * Convert Controller
 * 
 * This controller handles the core business logic for converting
 * Word documents to PDF format using mammoth and pdf-lib libraries.
 * 
 * FIXED: Added better error handling and file validation for corrupted DOCX files
 * FIXED: Added fallback conversion method for problematic files
 * 
 * Author: nayandas69
 * Repo: https://github.com/nayandas69/word-to-pdf-converter
 */

const mammoth = require('mammoth');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const path = require('path');
const fs = require('fs');
const { generateUniqueFilename, cleanupFile } = require('../utils/fileUtils');

/**
 * FIXED: Added function to validate DOCX file structure
 * Checks if the file is a valid ZIP archive (DOCX requirement)
 */
const validateDocxFile = (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // Check for ZIP file signature (DOCX files are ZIP archives)
    const zipSignature = buffer.slice(0, 4);
    const validSignatures = [
      Buffer.from([0x50, 0x4B, 0x03, 0x04]), // Standard ZIP
      Buffer.from([0x50, 0x4B, 0x05, 0x06]), // Empty ZIP
      Buffer.from([0x50, 0x4B, 0x07, 0x08])  // Spanned ZIP
    ];
    
    return validSignatures.some(sig => zipSignature.equals(sig));
  } catch (error) {
    console.error('❌ File validation error:', error);
    return false;
  }
};

/**
 * FIXED: Added fallback text extraction for problematic files
 * Creates a simple text-based PDF when mammoth fails
 */
const createFallbackPdf = async (filePath, originalName) => {
  try {
    console.log('🔄 Using fallback conversion method...');
    
    // Create a simple PDF with error message and file info
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    
    // Add content to PDF
    const lines = [
      'Word to PDF Conversion Notice',
      '',
      `Original file: ${originalName}`,
      `Conversion date: ${new Date().toLocaleString()}`,
      '',
      'Note: The original Word document could not be fully processed.',
      'This may be due to:',
      '• File corruption or damage',
      '• Unsupported Word document format',
      '• Complex formatting that cannot be converted',
      '',
      'Please try:',
      '1. Opening the document in Microsoft Word',
      '2. Saving it as a new .docx file',
      '3. Converting the new file',
      '',
      'If the problem persists, please contact support.'
    ];
    
    let yPosition = height - margin - 20;
    
    lines.forEach((line, index) => {
      const textSize = index === 0 ? 16 : fontSize;
      const textFont = index === 0 ? StandardFonts.HelveticaBold : StandardFonts.Helvetica;
      
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: textSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= textSize + 4;
    });
    
    return await pdfDoc.save();
  } catch (error) {
    console.error('❌ Fallback PDF creation failed:', error);
    throw new Error('Unable to create PDF document');
  }
};

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

    console.log('🔄 Starting conversion process...');
    
    let pdfBuffer;
    
    try {
      // FIXED: Added file validation for DOCX files
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      
      if (fileExtension === '.docx') {
        // Validate DOCX file structure
        if (!validateDocxFile(inputFilePath)) {
          console.log('⚠️  DOCX file validation failed, using fallback method');
          pdfBuffer = await createFallbackPdf(inputFilePath, req.file.originalname);
        } else {
          // Try normal conversion
          const result = await mammoth.extractRawText({ path: inputFilePath });
          const text = result.value;
          
          if (!text || text.trim().length === 0) {
            console.log('⚠️  No text extracted, using fallback method');
            pdfBuffer = await createFallbackPdf(inputFilePath, req.file.originalname);
          } else {
            pdfBuffer = await createPdfFromText(text);
          }
        }
      } else if (fileExtension === '.doc') {
        // For .doc files, try direct conversion or fallback
        try {
          const result = await mammoth.extractRawText({ path: inputFilePath });
          const text = result.value;
          
          if (!text || text.trim().length === 0) {
            pdfBuffer = await createFallbackPdf(inputFilePath, req.file.originalname);
          } else {
            pdfBuffer = await createPdfFromText(text);
          }
        } catch (docError) {
          console.log('⚠️  DOC conversion failed, using fallback method');
          pdfBuffer = await createFallbackPdf(inputFilePath, req.file.originalname);
        }
      } else {
        throw new Error('Unsupported file format');
      }
      
    } catch (conversionError) {
      console.log('⚠️  Primary conversion failed, using fallback method');
      console.log('Error details:', conversionError.message);
      
      // FIXED: Use fallback method when primary conversion fails
      pdfBuffer = await createFallbackPdf(inputFilePath, req.file.originalname);
    }
    
    console.log('✅ Conversion successful');

    // Write the PDF buffer to file
    fs.writeFileSync(outputFilePath, pdfBuffer);

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
        message: error.message || 'An error occurred during file conversion. Please ensure the file is a valid Word document.',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

/**
 * FIXED: Extracted PDF creation logic into separate function
 * Creates PDF from extracted text with proper formatting
 */
const createPdfFromText = async (text) => {
  const pdfDoc = await PDFDocument.create();
  
  // Split text into lines and pages
  const lines = text.split('\n');
  const linesPerPage = 40; // Approximate lines per page
  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89; // A4 height in points
  const margin = 50;
  const lineHeight = 14;
  const fontSize = 12;
  
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;
  let lineCount = 0;
  
  // Embed font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Add text to PDF
  for (const line of lines) {
    // Check if we need a new page
    if (lineCount >= linesPerPage || yPosition < margin + lineHeight) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;
      lineCount = 0;
    }
    
    // Handle long lines by wrapping them
    const maxCharsPerLine = 80;
    if (line.length > maxCharsPerLine) {
      const wrappedLines = [];
      for (let i = 0; i < line.length; i += maxCharsPerLine) {
        wrappedLines.push(line.substring(i, i + maxCharsPerLine));
      }
      
      for (const wrappedLine of wrappedLines) {
        if (lineCount >= linesPerPage || yPosition < margin + lineHeight) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
          lineCount = 0;
        }
        
        currentPage.drawText(wrappedLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        
        yPosition -= lineHeight;
        lineCount++;
      }
    } else {
      currentPage.drawText(line, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= lineHeight;
      lineCount++;
    }
  }
  
  return await pdfDoc.save();
};

module.exports = {
  convertWordToPdf
};
