require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// GET /health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// POST /api/research endpoint
app.post('/api/research', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Missing required field: query'
      });
    }

    // Make request to Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Research the following topic and provide a comprehensive summary: ${query}`
        }
      ]
    });

    res.status(200).json({
      query: query,
      response: message.content[0].text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing research request:', error);
    res.status(500).json({
      error: 'Failed to process research request',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Research API: http://localhost:${PORT}/api/research`);
});
