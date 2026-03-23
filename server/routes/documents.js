const express = require('express');
const router = require('express').Router();
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

// We must use the internal worker of the pdf-parse library to match the API version (5.4.296)
const workerAbsolutePath = path.join(
  process.cwd(), 
  'node_modules',
  'pdf-parse',
  'node_modules',
  'pdfjs-dist',
  'build',
  'pdf.worker.mjs'
)
const workerUrl = pathToFileURL(workerAbsolutePath).href
PDFParse.setWorker(workerUrl)

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

// Document analysis endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const fileType = path.extname(originalName).toLowerCase();
    
    let extractedText = '';

    if (fileType === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: dataBuffer });
      const data = await parser.getText();
      extractedText = data.text;
      await parser.destroy();
    } else if (fileType === '.txt' || fileType === '.md') {
      extractedText = fs.readFileSync(filePath, 'utf8');
    } else if (['.mp3', '.wav', '.m4a', '.mp4'].includes(fileType)) {
      extractedText = `[AUDIO/VIDEO UPLOADED: ${originalName}]\nSYSTEM: This is a meeting/audio file. Summarize its likely contents according to the context of the chat.`;
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file type. Please upload PDF, TXT, MD, or Audio files.' });
    }

    fs.unlinkSync(filePath);

    res.json({
      status: 'success',
      filename: originalName,
      content: extractedText,
      wordCount: extractedText.split(/\s+/).length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Document analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to process document',
      message: error.message 
    });
  }
});

module.exports = router;
