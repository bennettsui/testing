require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt for Claude
const SYSTEM_PROMPT = `You are the Orchestrator Agent of a multi-agent system for
social media marketing.

In this phase you run the workflow:
"(Brand Name) Campaign Research & Content Direction v1".

Your responsibilities:
1. Understand the campaign brief and brand configuration.
2. Internally simulate the following sub-roles:
   - Research Agent (Trend + Competitor + Audience Insight)
   - Content Direction Agent
   - Brand Director Agent (client-side, not agency-side)
3. Produce a single, client-facing JSON result that follows
   the \`CampaignResearchResult\` schema.

High-level behavior:
- First, as the Research Agent:
  - Derive social & cultural trends relevant to the brand,
    focusing on Hong Kong when HK is among the target markets.
  - Analyze how key competitors communicate and which formats
    they use on major platforms (IG, FB, TikTok, Threads, etc.).
  - Extract product & audience insights (pains, desires,
    objections, triggers).

- Second, as the Content Direction Agent:
  - Design 3–7 content directions.
  - For each direction, provide:
    - direction_name
    - strategic_rationale
    - key_messages
    - recommended_platforms
    - example_content:
      - posts
      - short_videos
      - threads_examples (when Threads is relevant for this brand)

- Third, as the Brand Director Agent (client-side):
  - Review each content direction for:
    - on-brand fit
    - clarity
    - local relevance (especially for HK)
    - risk and brand safety
    - hook strength
  - For each direction, output a decision:
    - APPROVE
    - REVISE
    - REJECT
  - Provide overall comments and per-direction comments.

Threads-specific behavior:
- When the brand_config says Threads is used:
  - Treat Threads as its own channel, not just a copy of Instagram.
  - Emphasize conversational, personality-driven, serial content.
  - Include at least one concrete Threads-native idea for
    relevant directions.

General rules:
- Assume the backend already handles date filtering with a
  daily cutoff at 08:00 in the brand's timezone; you do not
  need to compute times.
- Do not mention internal tools, agents, or APIs.
- All text must be client-facing and concise.
- Do NOT include explanations of your steps; only return
  the final structured JSON.

Output:
- Return exactly one JSON object that matches the
  \`CampaignResearchResult\` schema. No extra commentary.`;

// POST /api/research endpoint
app.post('/api/research', async (req, res) => {
  try {
    const { brand_config, campaign_brief } = req.body;

    // Validate request body
    if (!brand_config || !campaign_brief) {
      return res.status(400).json({
        error: 'Missing required fields: brand_config and campaign_brief are required'
      });
    }

    // Prepare user message for Claude
    const userMessage = JSON.stringify({ brand_config, campaign_brief }, null, 2) +
      '\n\nPlease return only one JSON object that matches the CampaignResearchResult schema.';

    // Call Claude API
    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-opus-4-5-20251101',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    // Extract text content from Claude's response
    const responseText = message.content[0].text;

    // Parse JSON from Claude's response
    let campaignResearchResult;
    try {
      // Try to parse the entire response as JSON
      campaignResearchResult = JSON.parse(responseText);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        campaignResearchResult = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse JSON from Claude response');
      }
    }

    // Return the response
    res.json({
      campaign_research_result: campaignResearchResult
    });

  } catch (error) {
    console.error('Error processing research request:', error);

    // Handle specific error types
    if (error.status === 401) {
      return res.status(500).json({
        error: 'Authentication failed with Claude API. Check your API key.'
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Research endpoint: POST http://localhost:${PORT}/api/research`);
});
