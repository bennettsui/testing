require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Research API endpoint
app.post('/api/research', async (req, res) => {
  try {
    const { brand_config, campaign_brief } = req.body;

    // Validate request body
    if (!brand_config || !campaign_brief) {
      return res.status(400).json({
        error: 'Missing required fields: brand_config and campaign_brief'
      });
    }

    // Create prompt for Claude
    const systemPrompt = `You are an expert brand strategist and campaign researcher specializing in digital marketing and social media. Your task is to analyze brand and campaign information and produce comprehensive campaign research with actionable content directions.

You must respond with ONLY valid JSON matching this exact schema:
{
  "campaign_research_result": {
    "campaign_id": "string",
    "brand_name": "string",
    "campaign_title": "string",
    "markets": ["HK"],
    "platforms": ["IG", "FB", "TikTok", "Threads"],
    "summary": {
      "one_liner": "string",
      "key_bullets": ["string"]
    },
    "trends": [
      {
        "id": "string",
        "label": "string",
        "description": "string",
        "market": "HK or GLOBAL or other",
        "relevance_to_brand": "string"
      }
    ],
    "competitors": [
      {
        "name": "string",
        "summary": "string",
        "observed_behaviors": ["string"],
        "platform_highlights": [
          {
            "platform": "IG | FB | TikTok | Threads | Other",
            "notes": "string"
          }
        ]
      }
    ],
    "audience_insights": {
      "persona_summary": "string",
      "pains": ["string"],
      "desires": ["string"],
      "objections": ["string"],
      "triggers": ["string"]
    },
    "content_directions": [
      {
        "id": "string",
        "direction_name": "string",
        "strategic_rationale": "string",
        "key_messages": ["string"],
        "recommended_platforms": ["IG Feed", "Reels", "Threads"],
        "example_content": {
          "posts": [
            {
              "title": "string",
              "hook": "string",
              "copy": "string",
              "platform": "string"
            }
          ],
          "short_videos": [
            {
              "title": "string",
              "hook": "string",
              "beats_outline": ["string"],
              "platform": "string"
            }
          ],
          "threads_examples": [
            {
              "thread_title": "string",
              "opening_line": "string",
              "follow_up_ideas": ["string"]
            }
          ]
        }
      }
    ],
    "brand_director_review": {
      "overall_comment": "string",
      "directions": [
        {
          "direction_id": "string",
          "decision": "APPROVE | REVISE | REJECT",
          "comment": "string"
        }
      ]
    }
  }
}`;

    const userPrompt = `Generate comprehensive campaign research for the following brand and campaign:

BRAND CONFIGURATION:
${JSON.stringify(brand_config, null, 2)}

CAMPAIGN BRIEF:
${JSON.stringify(campaign_brief, null, 2)}

Based on this information, create a detailed campaign research report that includes:
1. Market trends relevant to ${brand_config.brand_name} in ${brand_config.markets.join(', ')}
2. Competitor analysis for similar brands in the coffee/beverage industry
3. Deep audience insights for the target demographic
4. 3-4 creative content directions with platform-specific examples
5. Brand director review with assessments of each direction

Generate at least 3 relevant trends, 3-4 competitors, and 3-4 content directions. Each content direction should include multiple example posts, videos, and threads.

The tone should align with these keywords: ${brand_config.tone_keywords.join(', ')}.
Risk level: ${brand_config.risk_level}.

Respond with ONLY the JSON object, no additional text.`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
      max_tokens: 16000,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      system: systemPrompt
    });

    // Parse the response
    const responseText = message.content[0].text;
    const jsonResponse = JSON.parse(responseText);

    // Return the campaign research result
    res.json(jsonResponse);

  } catch (error) {
    console.error('Error processing research request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Research API: http://localhost:${PORT}/api/research`);
});
