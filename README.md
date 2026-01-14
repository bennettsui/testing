# CafeHK Campaign Research API

Node.js + Express API for generating campaign research using Claude AI.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file with:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   CLAUDE_MODEL=claude-3-5-sonnet-latest
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000`.

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-13T...",
  "port": 3000
}
```

### POST /api/research
Generate campaign research using Claude AI.

**Request Body:**
```json
{
  "brand_config": {
    "brand_name": "string",
    "markets": ["string"],
    "languages": ["string"],
    "platforms": ["string"],
    "cutoff_time": "string",
    "tone_keywords": ["string"],
    "risk_level": "string"
  },
  "campaign_brief": {
    "title": "string",
    "objectives": ["string"],
    "primary_audience": "string",
    "product_description": "string",
    "key_messages_from_client": ["string"],
    "references": ["string"]
  }
}
```

**Response:**
```json
{
  "campaign_research_result": {
    "content_directions": [...],
    "trends": [...],
    "competitors": [...]
  }
}
```

## Example Request

```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{
    "brand_config": {
      "brand_name": "CafeHK",
      "markets": ["HK"],
      "languages": ["zh-HK", "en"],
      "platforms": ["IG", "Threads"],
      "cutoff_time": "08:00",
      "tone_keywords": ["playful", "smart"],
      "risk_level": "moderate"
    },
    "campaign_brief": {
      "title": "CafeHK Launch Campaign",
      "objectives": ["Awareness", "Engagement"],
      "primary_audience": "25-35 HK office workers tired of boring chains",
      "product_description": "Specialty coffee with playful vibe",
      "key_messages_from_client": ["serious coffee, not serious life"],
      "references": ["https://instagram.com/bluebottle"]
    }
  }'
```
