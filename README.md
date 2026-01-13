# HK Coffee Brand Campaign Research API

Express API that uses Claude AI to generate comprehensive brand campaign research and content directions.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
CLAUDE_MODEL=claude-3-opus-20240229
PORT=3000
```

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check

Check if the server is running:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-13T17:30:00.000Z",
  "port": 3000
}
```

### Campaign Research

Generate campaign research for a brand:

```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{
  "brand_config": {
    "brand_name": "CafeHK",
    "markets": ["HK"],
    "languages": ["zh-HK", "en"],
    "platforms": ["IG", "FB", "TikTok", "Threads"],
    "cutoff_time": "08:00",
    "tone_keywords": ["playful", "smart", "human"],
    "risk_level": "moderate"
  },
  "campaign_brief": {
    "title": "CafeHK Campaign Research & Content Direction v1",
    "objectives": ["Awareness", "Engagement"],
    "primary_audience": "Young professionals and coffee enthusiasts aged 25-40 in Hong Kong who appreciate quality coffee and local culture",
    "product_description": "Premium specialty coffee roasted locally in Hong Kong, featuring single-origin beans and signature Hong Kong-inspired blends. We combine traditional coffee craftsmanship with Hong Kong'\''s vibrant culture.",
    "key_messages_from_client": [
      "Locally roasted with pride",
      "Supporting local coffee culture",
      "Quality meets Hong Kong spirit",
      "Every cup tells a story"
    ],
    "references": [
      "https://www.instagram.com/bluebottlecoffee",
      "https://www.instagram.com/starbuckshk"
    ]
  }
}'
```

Response includes:
- Campaign summary and key insights
- Market trends relevant to the brand
- Competitor analysis
- Audience insights (pains, desires, objections, triggers)
- Content directions with platform-specific examples
- Brand director review and recommendations

## Request Schema

### brand_config
- `brand_name`: Brand name
- `markets`: Array of market codes (e.g., ["HK"])
- `languages`: Array of language codes (e.g., ["zh-HK", "en"])
- `platforms`: Array of social platforms (e.g., ["IG", "FB", "TikTok", "Threads"])
- `cutoff_time`: Time cutoff (e.g., "08:00")
- `tone_keywords`: Array of tone descriptors
- `risk_level`: "conservative", "moderate", or "bold"

### campaign_brief
- `title`: Campaign title
- `objectives`: Array of campaign objectives
- `primary_audience`: Description of target audience
- `product_description`: Product/service description
- `key_messages_from_client`: Array of key messages
- `references`: Array of reference URLs

## Response Schema

The API returns a comprehensive `campaign_research_result` object containing:
- Campaign ID and metadata
- Executive summary with key bullets
- Trend analysis
- Competitor insights
- Audience persona and insights
- Multiple content directions with examples
- Brand director review and decisions

## Technologies

- Node.js
- Express.js
- Anthropic Claude API
- dotenv for environment configuration
