const express = require('express');
const router = express.Router();
const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const CODE_MODEL = process.env.DEFAULT_CODE_MODEL || 'qwen2.5-coder:7b';

// Code generation/analysis endpoint
router.post('/', async (req, res) => {
  try {
    const { code, task, language } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    const prompt = buildCodePrompt(task, code, language);

    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: CODE_MODEL,
      prompt: prompt,
      stream: false
    });

    res.json({
      response: response.data.response,
      model: CODE_MODEL,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Code error:', error.message);
    res.status(500).json({ 
      error: 'Failed to process code',
      message: error.message 
    });
  }
});

function buildCodePrompt(task, code, language) {
  let prompt = '';
  
  if (task === 'explain') {
    prompt = `Explain the following ${language || 'code'}:\n\n${code}`;
  } else if (task === 'refactor') {
    prompt = `Refactor and improve the following ${language || 'code'}:\n\n${code}\n\nProvide the refactored code with explanations.`;
  } else if (task === 'debug') {
    prompt = `Debug and fix issues in the following ${language || 'code'}:\n\n${code}\n\nProvide the fixed code with explanations.`;
  } else if (task === 'generate') {
    prompt = `Generate ${language || ''} code for: ${code}`;
  } else {
    prompt = `${task}\n\n${code || ''}`;
  }
  
  return prompt;
}

module.exports = router;
