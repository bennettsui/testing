require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = 3000;

app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a campaign strategist. Analyze the brand and campaign brief provided, then output a COMPACT research result in JSON format with these exact fields:

{
  "content_directions": [
    {
      "direction_title": "string",
      "rationale": "string",
      "examples": {
        "post": { "caption": "string", "visual_concept": "string" },
        "video": { "hook": "string", "script": "string", "visual_notes": "string" },
        "threads": { "first_thread": "string", "subsequent_threads": ["string", "string"] }
      }
    }
  ],
  "trends": [
    { "trend_name": "string", "relevance": "string" }
  ],
  "competitors": [
    { "name": "string", "approach": "string" }
  ]
}

CONSTRAINTS:
- Exactly 2 content directions
- Maximum 3 trends
- Maximum 3 competitors
- 1 post + 1 video + 1 threads example per direction

Output ONLY valid JSON, no markdown code blocks.`;

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.post('/api/research', async (req, res) => {
  try {
    const { brand_config, campaign_brief } = req.body;

    if (!brand_config || !campaign_brief) {
      return res.status(400).json({
        error: 'Missing brand_config or campaign_brief in request body'
      });
    }

    const userMessage = `BRAND CONFIG:
${JSON.stringify(brand_config, null, 2)}

CAMPAIGN BRIEF:
${JSON.stringify(campaign_brief, null, 2)}

Generate the campaign research result.`;

    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    const responseText = message.content[0].text;

    let campaign_research_result;
    try {
      campaign_research_result = JSON.parse(responseText);
    } catch (parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        campaign_research_result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse Claude response as JSON');
      }
    }

    res.json({
      campaign_research_result
    });

  } catch (error) {
    console.error('Error processing research request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
