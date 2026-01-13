# Social Research API v1

A Node.js + Express backend service that provides AI-powered social media campaign research and content direction using Claude (Anthropic AI).

## Features

- **Health Check Endpoint**: Monitor service availability
- **Campaign Research Endpoint**: Generate comprehensive campaign research including:
  - Social and cultural trends analysis
  - Competitor analysis across multiple platforms
  - Audience insights (pains, desires, objections, triggers)
  - 3-7 content directions with strategic rationale
  - Platform-specific content examples (Posts, Short Videos, Threads)
  - Brand Director review and recommendations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Anthropic API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd testing
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

## Running the Server

Start the server:
```bash
npm start
```

The server will start on port 3000 (or the port specified in your `.env` file).

You should see:
```
Social Research API v1 running on port 3000
Health check: http://localhost:3000/health
Research endpoint: http://localhost:3000/api/research
```

## API Endpoints

### GET /health

Health check endpoint to verify service is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-13T14:15:00.000Z"
}
```

### POST /api/research

Generate campaign research and content directions using Claude AI.

**Request Body:**
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

**Response:**
```json
{
  "campaign_research_result": {
    "campaign_id": "string",
    "brand_name": "string",
    "campaign_title": "string",
    "markets": ["HK"],
    "platforms": ["IG", "FB", "TikTok", "Threads"],
    "summary": { ... },
    "trends": [ ... ],
    "competitors": [ ... ],
    "audience_insights": { ... },
    "content_directions": [ ... ],
    "brand_director_review": { ... }
  }
}
```

## Example Usage

Using curl:
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
      "primary_audience": "25-35 office workers in Hong Kong",
      "product_description": "A specialty coffee brand with a playful vibe",
      "key_messages_from_client": ["serious about coffee, not about life"],
      "references": []
    }
  }'
```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY` (required): Your Anthropic API key
- `CLAUDE_MODEL` (optional): Claude model to use (default: `claude-opus-4-5-20251101`)
- `PORT` (optional): Server port (default: `3000`)

### Available Claude Models

- `claude-opus-4-5-20251101` (default, most capable)
- `claude-sonnet-4-5-20250929` (faster, cost-effective)

## Project Structure

```
.
├── server.js           # Main Express server and API endpoints
├── package.json        # Node.js dependencies and scripts
├── .env                # Environment variables (not in git)
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Development

The API uses a sophisticated system prompt that simulates a multi-agent workflow:
1. **Research Agent**: Analyzes trends, competitors, and audience insights
2. **Content Direction Agent**: Creates 3-7 strategic content directions
3. **Brand Director Agent**: Reviews and provides feedback on each direction

## Deployment

This API is designed to be deployed on Fly.io or similar platforms. Ensure you set the `ANTHROPIC_API_KEY` environment variable in your deployment environment.

## License

ISC
