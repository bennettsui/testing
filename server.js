require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Research endpoint using Anthropic API
app.post('/api/research', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Query parameter is required',
        example: { query: 'What is artificial intelligence?' }
      });
    }

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Please provide a detailed research response to the following query: ${query}`
      }]
    });

    res.json({
      success: true,
      query: query,
      response: message.content[0].text,
      model: message.model,
      usage: message.usage
    });

  } catch (error) {
    console.error('Research endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your request'
    });
  }
});

// GET version for testing
app.get('/api/research', (req, res) => {
  res.json({
    message: 'Please use POST method to submit a research query',
    example: {
      method: 'POST',
      body: { query: 'What is artificial intelligence?' }
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'API Server is running',
    endpoints: {
      health: '/health',
      research: '/api/research (POST)'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Research API: http://localhost:${PORT}/api/research`);
});
