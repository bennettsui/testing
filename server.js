require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for campaign research
const SYSTEM_PROMPT = `You are an expert marketing and brand research assistant. You analyze brand configurations and campaign briefs to provide comprehensive research insights.

Your task is to:
1. Analyze the provided brand configuration (brand identity, values, target audience, positioning)
2. Review the campaign brief (objectives, goals, messaging requirements)
3. Provide detailed research recommendations including:
   - Market insights relevant to the campaign
   - Target audience analysis and segmentation
   - Competitive landscape considerations
   - Messaging strategies aligned with brand values
   - Channel recommendations
   - Key performance indicators to track

Always structure your response with clear sections and actionable insights.`;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Campaign research endpoint
app.post('/api/research', async (req, res) => {
  try {
    const { brand_config, campaign_brief } = req.body;

    // Validate input
    if (!brand_config || !campaign_brief) {
      return res.status(400).json({
        error: 'Missing required fields: brand_config and campaign_brief'
      });
    }

    // Prepare the user message
    const userMessage = `Brand Configuration:\n${JSON.stringify(brand_config, null, 2)}\n\nCampaign Brief:\n${JSON.stringify(campaign_brief, null, 2)}\n\nPlease provide comprehensive campaign research based on this information.`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    // Extract the response text
    const researchResult = message.content[0].text;

    // Return the result
    res.json({
      campaign_research_result: researchResult
    });

  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({
      error: 'Failed to generate campaign research',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/research`);
});
