# Campaign Research API

Express backend for the `/api/research` endpoint that uses Claude AI to generate campaign research and content directions for social media marketing.

## Features

- POST endpoint for campaign research generation
- Integration with Claude API (Anthropic)
- Structured JSON response following CampaignResearchResult schema
- Multi-agent orchestration (Research, Content Direction, Brand Director)
- Support for HK market and multiple platforms (IG, FB, TikTok, Threads)

## Prerequisites

- Node.js 18+ installed
- Anthropic API key (get it from [https://console.anthropic.com/](https://console.anthropic.com/))

## Setup

1. Clone or navigate to this directory

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the template:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

## Running the Server

### Development mode (with auto-reload on Node 18+):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on port 3000 (or the PORT specified in your .env file).

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-13T10:00:00.000Z"
}
```

### Campaign Research
```
POST /api/research
Content-Type: application/json
```

Request body:
```json
{
  "brand_config": {
    "brand_name": "Coffee Chill",
    "markets": ["HK"],
    "languages": ["zh-HK", "en"],
    "platforms": ["IG", "Threads"],
    "cutoff_time": "08:00",
    "tone_keywords": ["playful", "smart", "human"],
    "risk_level": "conservative"
  },
  "campaign_brief": {
    "title": "Coffee Chill Campaign Research & Content Direction v1",
    "objectives": ["Awareness", "Engagement"],
    "primary_audience": "25-35 office workers in Hong Kong who are bored with typical coffee chains.",
    "product_description": "A new specialty coffee brand with a playful, relaxing vibe and light snacks.",
    "key_messages_from_client": [
      "serious about coffee, not about life"
    ],
    "references": [
      "https://www.instagram.com/bluebottle",
      "https://www.instagram.com/arabica"
    ]
  }
}
```

Response:
```json
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
    "trends": [...],
    "competitors": [...],
    "audience_insights": {...},
    "content_directions": [...],
    "brand_director_review": {...}
  }
}
```

## Testing with cURL

```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{
    "brand_config": {
      "brand_name": "Coffee Chill",
      "markets": ["HK"],
      "languages": ["zh-HK", "en"],
      "platforms": ["IG", "Threads"],
      "cutoff_time": "08:00",
      "tone_keywords": ["playful", "smart", "human"],
      "risk_level": "conservative"
    },
    "campaign_brief": {
      "title": "Coffee Chill Campaign Research & Content Direction v1",
      "objectives": ["Awareness", "Engagement"],
      "primary_audience": "25-35 office workers in Hong Kong who are bored with typical coffee chains.",
      "product_description": "A new specialty coffee brand with a playful, relaxing vibe and light snacks.",
      "key_messages_from_client": ["serious about coffee, not about life"],
      "references": [
        "https://www.instagram.com/bluebottle",
        "https://www.instagram.com/arabica"
      ]
    }
  }'
```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY` (required): Your Anthropic API key
- `CLAUDE_MODEL` (optional): Claude model to use (default: `claude-opus-4-5-20251101`)
  - Options: `claude-opus-4-5-20251101`, `claude-sonnet-4-5-20250929`
- `PORT` (optional): Server port (default: 3000)

## Deployment to Fly.io

1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/

2. Login to Fly:
```bash
fly auth login
```

3. Launch the app:
```bash
fly launch
```

4. Set your API key as a secret:
```bash
fly secrets set ANTHROPIC_API_KEY=your_api_key_here
```

5. Deploy:
```bash
fly deploy
```

Your API will be available at `https://<app-name>.fly.dev/api/research`

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing required fields)
- `429`: Rate limit exceeded
- `500`: Internal server error (including Claude API errors)

## Project Structure

```
.
├── server.js           # Main Express server and endpoint logic
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## License

ISC