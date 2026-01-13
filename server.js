require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful research assistant specializing in social research analysis.
Your role is to provide well-researched, accurate, and insightful responses to research queries.
When analyzing social phenomena, consider multiple perspectives, cite relevant methodologies,
and provide balanced, evidence-based conclusions. Structure your responses clearly with
appropriate sections when needed.`;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'social-research-api-v1'
  });
});

// Research endpoint - Spec v0.1
app.post('/api/research', async (req, res) => {
  try {
    const { query, model = 'claude-3-5-sonnet-20241022', max_tokens = 4096 } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Query parameter is required'
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'Server Configuration Error',
        message: 'ANTHROPIC_API_KEY is not configured'
      });
    }

    const message = await anthropic.messages.create({
      model: model,
      max_tokens: max_tokens,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: query
        }
      ]
    });

    res.status(200).json({
      success: true,
      query: query,
      response: message.content[0].text,
      model: model,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens
      }
    });

  } catch (error) {
    console.error('Error processing research request:', error);

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'An error occurred while processing your research request'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Social Research API v1 running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔬 Research endpoint: POST http://localhost:${PORT}/api/research`);
});
