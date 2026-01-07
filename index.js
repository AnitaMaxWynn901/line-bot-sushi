const express = require('express');
const line = require('@line/bot-sdk');

// Configuration
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};

// Create LINE client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

// Create Express app
const app = express();

// Health check endpoint
app.get('/', (req, res) => {
  res.send('LINE Bot is running! 🤖');
});

// Webhook endpoint
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// Event handler
async function handleEvent(event) {
  // Ignore non-message events
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // Get user's message
  const userMessage = event.message.text.toLowerCase();
  let replyMessage;

  // Simple responses based on user input
  if (userMessage.includes('hello') || userMessage.includes('hi')) {
    replyMessage = {
      type: 'text',
      text: 'Hello! 👋 Welcome to Sushi Bot! How can I help you today?'
    };
  } else if (userMessage.includes('menu')) {
    replyMessage = {
      type: 'text',
      text: '🍣 Our menu:\n- Salmon Sushi\n- Tuna Sushi\n- Unagi Sushi\n\nTap the menu button below to see more!'
    };
  } else if (userMessage.includes('help')) {
    replyMessage = {
      type: 'text',
      text: 'I can help you with:\n✅ View menu\n✅ Make reservation\n✅ Check hours\n\nJust ask me anything!'
    };
  } else {
    replyMessage = {
      type: 'text',
      text: `You said: "${event.message.text}"\n\nTry saying "hello", "menu", or "help"! 😊`
    };
  }

  // Send reply
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [replyMessage]
  });
}

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});