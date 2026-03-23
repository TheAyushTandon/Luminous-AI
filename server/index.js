const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const chatRoutes = require('./routes/chat');
const codeRoutes = require('./routes/code');
const audioRoutes = require('./routes/audio');
const documentsRoutes = require('./routes/documents');
const modelsRoutes = require('./routes/models');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    localOnly: process.env.LOCAL_ONLY === 'true',
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/models', modelsRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Luminous AI Server running on port ${PORT}`);
  console.log(`🔒 Privacy Mode: ${process.env.LOCAL_ONLY === 'true' ? 'ENABLED' : 'DISABLED'}`);
  console.log(`📡 Ollama URL: ${process.env.OLLAMA_URL}`);
});
