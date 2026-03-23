const express = require('express');
const router = express.Router();
const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.DEFAULT_CHAT_MODEL || 'llama3.1:8b';

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Call Ollama API
    const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: messages,
      stream: false
    });

    res.json({
      response: response.data.message.content,
      model: DEFAULT_MODEL,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Ollama service is not running',
        message: 'Please start Ollama and try again'
      });
    }

    res.status(500).json({ 
      error: 'Failed to process chat',
      message: error.message 
    });
  }
});

// Stream chat endpoint
router.post('/stream', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model: DEFAULT_MODEL,
      messages: messages,
      stream: true
    }, {
      responseType: 'stream'
    });

    response.data.on('data', (chunk) => {
      const text = chunk.toString();
      const lines = text.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            res.write(`data: ${JSON.stringify({ content: json.message.content })}\n\n`);
          }
          if (json.done) {
            res.write(`data: [DONE]\n\n`);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    });

    response.data.on('end', () => {
      res.end();
    });

  } catch (error) {
    console.error('Stream chat error:', error.message);
    res.status(500).json({ 
      error: 'Failed to stream chat',
      message: error.message 
    });
  }
});

module.exports = router;
