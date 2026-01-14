const express = require("express");
const line = require("@line/bot-sdk");

// Configuration
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

// Create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken,
});

// Create Express app
const app = express();

app.use(express.static("public"));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("LINE Bot is running! 🤖");
});

// Webhook endpoint - handle POST requests from LINE
app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;

    // Process all events
    await Promise.all(events.map(handleEvent));

    res.status(200).end();
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).end();
  }
});

// Handle each event
async function handleEvent(event) {
  // Only handle message events
  if (event.type !== "message" || event.message.type !== "text") {
    return null;
  }

  // Get user's message
  const userMessage = event.message.text;
  const userMessageLower = userMessage.toLowerCase();

  let replyText;

  // Check if this is an order message
  if (userMessage.includes("🍣 NEW ORDER")) {
    return handleOrder(event, userMessage);
  }

  // Simple bot responses for regular messages
  if (userMessageLower.includes("hello") || userMessageLower.includes("hi")) {
    replyText = "Hello! 👋 Welcome to Sushi Bot! How can I help you today?";
  } else if (userMessageLower.includes("menu")) {
    replyText =
      "🍣 Our menu:\n- Salmon Sushi\n- Tuna Sushi\n- Unagi Sushi\n\nTap the LIFF button below to order!";
  } else if (userMessageLower.includes("help")) {
    replyText =
      "I can help you with:\n✅ View menu\n✅ Place orders\n✅ Earn points\n\nTap the LIFF button to get started!";
  } else {
    replyText = `You said: "${event.message.text}"\n\nTap the LIFF button below to view our menu! 🍣`;
  }

  // Reply to user
  const echo = {
    type: "text",
    text: replyText,
  };

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
}

// Handle order messages
async function handleOrder(event, orderMessage) {
  try {
    console.log("📦 Order received from user:", event.source.userId);
    console.log("Order details:", orderMessage);

    // Parse the order
    const lines = orderMessage.split("\n");

    // Extract total and points
    const totalLine = lines.find((line) => line.includes("Total:"));
    const pointsLine = lines.find((line) => line.includes("Points earned:"));

    const totalMatch = totalLine ? totalLine.match(/\$(\d+)/) : null;
    const pointsMatch = pointsLine ? pointsLine.match(/(\d+)/) : null;

    const total = totalMatch ? totalMatch[1] : "0";
    const points = pointsMatch ? pointsMatch[1] : "0";

    // Get user ID
    const userId = event.source.userId;

    console.log("Parsed order:", {
      userId: userId,
      total: total,
      points: points,
    });

    // Send confirmation
    const confirmationMessage = {
      type: "text",
      text:
        `✅ Order Confirmed!\n\n` +
        `Thank you for your order! 🎉\n\n` +
        `💰 Total: $${total}\n` +
        `⭐ Points earned: ${points}\n\n` +
        `Your delicious sushi will be ready soon!\n` +
        `We'll notify you when it's done. 🍣`,
    };

    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [confirmationMessage],
    });

    console.log("✅ Order confirmation sent successfully");

    //  Phase 3 - Save order to database and update member points
  } catch (error) {
    console.error("❌ Error handling order:", error);

    // Send error message to user
    const errorMessage = {
      type: "text",
      text: "❌ Sorry, there was an error processing your order.\nPlease try again or contact support.",
    };

    try {
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [errorMessage],
      });
    } catch (replyError) {
      console.error("Failed to send error message:", replyError);
    }
  }
}

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Webhook URL: /webhook`);
});
