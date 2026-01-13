# Social Research API v1

A Node.js + Express API for conducting social research queries using Anthropic's Claude AI.

## Features

- 🏥 Health check endpoint
- 🔬 Research API endpoint powered by Claude
- 🔐 Secure API key management with dotenv
- 📦 Simple Express setup

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- An Anthropic API key ([Get one here](https://console.anthropic.com/))

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=3000
```

### 3. Start the Server

```bash
npm start
```

The server will start on port 3000 (or the port specified in your `.env` file).

## API Endpoints

### GET /health

Health check endpoint to verify the service is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-13T12:00:00.000Z",
  "service": "social-research-api-v1"
}
```

### POST /api/research

Submit a research query to be analyzed by Claude.

**Request Body:**
```json
{
  "query": "What are the key factors influencing social media adoption among elderly populations?",
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4096
}
```

**Parameters:**
- `query` (required): Your research question or topic
- `model` (optional): Claude model to use (default: claude-3-5-sonnet-20241022)
- `max_tokens` (optional): Maximum tokens in response (default: 4096)

**Response:**
```json
{
  "success": true,
  "query": "Your research question...",
  "response": "Detailed research analysis...",
  "model": "claude-3-5-sonnet-20241022",
  "usage": {
    "input_tokens": 150,
    "output_tokens": 800
  }
}
```

## Testing

### Using cURL

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

Test the research endpoint:
```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain the social impact of remote work on urban communities."}'
```

### Using Node.js

```javascript
const response = await fetch('http://localhost:3000/api/research', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'What are emerging trends in digital sociology?'
  })
});
const data = await response.json();
console.log(data.response);
```

## Project Structure

```
/home/user/testing/
├── server.js           # Main Express server
├── package.json        # Project dependencies and scripts
├── .env               # Environment variables (not in git)
├── .env.example       # Example environment file
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Development

For development with auto-restart on file changes:

```bash
npm run dev
```

## License

MIT
