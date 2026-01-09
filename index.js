const express = require('express');
const line = require('@line/bot-sdk');

// Configuration
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};

// Create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});


// Create Express app
const app = express();


app.use(express.static('public'));

// Health check endpoint
app.get('/', (req, res) => {
  res.send('LINE Bot is running! 🤖');
});

// Webhook endpoint - handle POST requests from LINE
app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    
    // Process all events
    await Promise.all(events.map(handleEvent));
    
    res.status(200).end();
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).end();
  }
});

// Handle each event
async function handleEvent(event) {
  // Only handle message events
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  }

  // Get user's message
  const userMessage = event.message.text.toLowerCase();
  let replyText;

  // Simple bot responses
  if (userMessage.includes('hello') || userMessage.includes('hi')) {
    replyText = 'Hello! 👋 Welcome to Sushi Bot! How can I help you today?';
  } else if (userMessage.includes('menu')) {
    replyText = '🍣 Our menu:\n- Salmon Sushi\n- Tuna Sushi\n- Unagi Sushi\n\nTap the menu button below to see more!';
  } else if (userMessage.includes('help')) {
    replyText = 'I can help you with:\n✅ View menu\n✅ Make reservation\n✅ Check hours\n\nJust ask me anything!';
  } else {
    replyText = `You said: "${event.message.text}"\n\nTry saying "hello", "menu", or "help"! 😊`;
  }

  // Reply to user
  const echo = {
    type: 'text',
    text: replyText
  };

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo]
  });
}

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Webhook URL: /webhook`);
});