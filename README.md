# Express + Claude API - Campaign Research Server

A Node.js Express server that integrates with the Anthropic Claude API to provide campaign research insights based on brand configurations and campaign briefs.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and add your Anthropic API key:

```bash
cp .env.example .env
```

Edit `.env` and replace `your_api_key_here` with your actual Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
CLAUDE_MODEL=claude-3-opus-20240229
```

### 3. Start the Server

```bash
npm start
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

## API Endpoints

### Health Check

**GET** `/health`

Returns the server health status.

**Example:**

```bash
curl http://localhost:3000/health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-13T12:34:56.789Z",
  "port": 3000
}
```

### Campaign Research

**POST** `/api/research`

Generates campaign research insights based on brand configuration and campaign brief.

**Request Body:**

```json
{
  "brand_config": {
    "name": "TechCorp",
    "industry": "Technology",
    "values": ["Innovation", "Sustainability", "Customer-First"],
    "target_audience": "Tech-savvy professionals aged 25-45"
  },
  "campaign_brief": {
    "objective": "Launch new eco-friendly product line",
    "goals": ["Increase brand awareness", "Drive 20% sales growth"],
    "timeline": "Q1 2024",
    "budget": "$500,000"
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{
    "brand_config": {
      "name": "TechCorp",
      "industry": "Technology",
      "values": ["Innovation", "Sustainability", "Customer-First"],
      "target_audience": "Tech-savvy professionals aged 25-45"
    },
    "campaign_brief": {
      "objective": "Launch new eco-friendly product line",
      "goals": ["Increase brand awareness", "Drive 20% sales growth"],
      "timeline": "Q1 2024",
      "budget": "$500,000"
    }
  }'
```

**Response:**

```json
{
  "campaign_research_result": "Comprehensive campaign research analysis with market insights, audience analysis, competitive landscape, messaging strategies, and KPIs..."
}
```

## Project Structure

```
.
├── server.js         # Express server with API endpoints
├── package.json      # Node.js dependencies and scripts
├── .env             # Environment variables (not in git)
├── .env.example     # Example environment variables
├── .gitignore       # Git ignore file
└── README.md        # This file
```

## Environment Variables

- `ANTHROPIC_API_KEY` (required): Your Anthropic API key
- `CLAUDE_MODEL` (optional): The Claude model to use (default: claude-3-opus-20240229)
- `PORT` (optional): Server port (default: 3000)

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (missing required fields)
- `500`: Internal Server Error (API call failure)