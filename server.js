require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Claude model configuration
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20250514';

async function sendMessage(message) {
  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error sending message to Claude:', error);
    throw error;
  }
}

// Example usage
if (require.main === module) {
  sendMessage('Hello, Claude!')
    .then(response => console.log('Claude response:', response))
    .catch(error => console.error('Error:', error));
}

module.exports = { sendMessage, CLAUDE_MODEL };
