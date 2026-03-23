const express = require('express');
const router = express.Router();
const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// List available models
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`);
    
    res.json({
      models: response.data.models || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Models list error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Ollama service is not running',
        message: 'Please start Ollama and try again'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch models',
      message: error.message 
    });
  }
});

// Get model info
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    const response = await axios.post(`${OLLAMA_URL}/api/show`, {
      name: name
    });
    
    res.json({
      model: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Model info error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch model info',
      message: error.message 
    });
  }
});

// Pull/download a model
router.post('/pull', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Model name is required' });
    }
    
    const response = await axios.post(`${OLLAMA_URL}/api/pull`, {
      name: name
    });
    
    res.json({
      status: 'pulling',
      model: name,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Model pull error:', error.message);
    res.status(500).json({ 
      error: 'Failed to pull model',
      message: error.message 
    });
  }
});

// Delete a model
router.delete('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    await axios.delete(`${OLLAMA_URL}/api/delete`, {
      data: { name: name }
    });
    
    res.json({
      status: 'deleted',
      model: name,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Model delete error:', error.message);
    res.status(500).json({ 
      error: 'Failed to delete model',
      message: error.message 
    });
  }
});

module.exports = router;
