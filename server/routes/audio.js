const express = require('express');
const router = express.Router();

// Audio transcription endpoint (placeholder for Whisper integration)
router.post('/transcribe', async (req, res) => {
  try {
    // TODO: Implement Whisper integration
    res.json({
      status: 'coming_soon',
      message: 'Audio transcription will be available soon',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Audio error:', error.message);
    res.status(500).json({ 
      error: 'Failed to process audio',
      message: error.message 
    });
  }
});

module.exports = router;
