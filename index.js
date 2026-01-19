const express = require("express");
const line = require("@line/bot-sdk");
const { createClient } = require("@supabase/supabase-js");
const { getMemberDashboardFlex } = require("./flexMessages"); // Import Flex Messages

// Configuration
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

// Supabase configuration
const supabaseUrl = "https://rrppsqmcunaeouijzrly.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycHBzcW1jdW5hZW91aWp6cmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNzYzMTEsImV4cCI6MjA4Mzc1MjMxMX0.oOh5Dox4S4k9nRjDGMYi1iFUbGSjsnx8_Fgd7n1EE-8";
const supabase = createClient(supabaseUrl, supabaseKey);

// SERVER URL - CHANGE THIS TO YOUR RENDER SERVER URL
// This is where your dashboard.html is hosted
// Example: "https://your-app-name.onrender.com"
const SERVER_URL = "https://line-bot-sushi.onrender.com";

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

  console.log("===========================================");
  console.log("📨 RAW MESSAGE:", userMessage);
  console.log("📨 LOWERCASE:", userMessageLower);
  console.log("===========================================");

  let replyText;

  // Check if this is an order message
  if (userMessage.includes("🍣 NEW ORDER")) {
    console.log("✅ ORDER DETECTED");
    return handleOrder(event, userMessage);
  }

  // NEW: Check for DASHBOARD command
  if (
    userMessageLower === "dashboard" ||
    userMessageLower === "member" ||
    userMessageLower === "my dashboard" ||
    userMessageLower === "member card"
  ) {
    console.log("✅ DASHBOARD COMMAND DETECTED");
    return sendMemberDashboard(event);
  }

  // Check membership status (for longer queries)
  if (
    userMessageLower.includes("membership") ||
    userMessageLower.includes("my points") ||
    userMessageLower.includes("check points")
  ) {
    console.log("✅ MEMBERSHIP CHECK DETECTED");
    return handleMembershipCheck(event);
  }

  // Then check hello/hi
  if (userMessageLower.includes("hello") || userMessageLower.includes("hi")) {
    console.log("✅ HELLO/HI DETECTED");
    replyText =
      "Hello! 👋 Welcome to Sushi Bot!\n\nType 'dashboard' to see your member card! 📊";
  } else if (userMessageLower.includes("menu")) {
    console.log("✅ MENU DETECTED");
    replyText =
      "🍣 Our menu:\n- Salmon Sushi\n- Tuna Sushi\n- Unagi Sushi\n\nTap the LIFF button below to order!";
  } else {
    console.log("✅ DEFAULT MESSAGE");
    replyText =
      `You said: "${event.message.text}"\n\n` +
      `💡 Try these commands:\n` +
      `• Type "dashboard" - See your member card\n` +
      `• Type "menu" - View our menu\n` +
      `• Tap the LIFF button to order! 🍣`;
  }

  console.log("📤 REPLYING WITH:", replyText);

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

// NEW FUNCTION: Send Member Dashboard Flex Message
async function sendMemberDashboard(event) {
  try {
    const userId = event.source.userId;

    console.log("📊 Sending Member Dashboard to:", userId);

    // Get the Flex Message
    const flexMessage = await getMemberDashboardFlex(userId, SERVER_URL);

    if (!flexMessage) {
      // User is not a member
      const notMemberMessage = {
        type: "text",
        text:
          "❌ You are not a member yet.\n\n" +
          "Tap the LIFF button below to register and start earning points! 🌟\n\n" +
          "Benefits:\n" +
          "✅ Earn points on every order\n" +
          "✅ Special member discounts\n" +
          "✅ Exclusive promotions",
      };

      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [notMemberMessage],
      });
    }

    // Send the Flex Message
    console.log("✅ Sending Member Dashboard Flex Message");

    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [flexMessage],
    });
  } catch (error) {
    console.error("❌ Error sending Member Dashboard:", error);

    const errorMessage = {
      type: "text",
      text: "❌ Sorry, there was an error loading your dashboard.\nPlease try again later.",
    };

    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [errorMessage],
    });
  }
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
    await updateMemberPoints(userId, parseInt(points));
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

// Update member points in database
async function updateMemberPoints(lineUserId, pointsToAdd) {
  try {
    console.log(
      `💰 Updating points for user: ${lineUserId}, adding ${pointsToAdd} points`
    );

    // Check if user is a member
    const { data: member, error: fetchError } = await supabase
      .from("members")
      .select("*")
      .eq("line_user_id", lineUserId)
      .single();

    if (fetchError || !member) {
      console.log("❌ User is not a member, skipping points update");
      return;
    }

    // Calculate new points total
    const currentPoints = member.points || 0;
    const newPoints = currentPoints + pointsToAdd;

    console.log(
      `Current points: ${currentPoints}, Adding: ${pointsToAdd}, New total: ${newPoints}`
    );

    // Update points in database
    const { data, error: updateError } = await supabase
      .from("members")
      .update({ points: newPoints })
      .eq("line_user_id", lineUserId)
      .select();

    if (updateError) {
      console.error("❌ Error updating points:", updateError);
      return;
    }

    console.log("✅ Points updated successfully!", data);

    // Send notification to user about points update
    await client.pushMessage({
      to: lineUserId,
      messages: [
        {
          type: "text",
          text: `🎉 Points Updated!\n\nYou earned ${pointsToAdd} points!\n💎 Total points: ${newPoints} pts\n\nType "dashboard" to see your member card!`,
        },
      ],
    });
  } catch (error) {
    console.error("❌ Error in updateMemberPoints:", error);
  }
}

// Check membership status (text-based response)
async function handleMembershipCheck(event) {
  try {
    const userId = event.source.userId;

    console.log("🔍 Checking membership for:", userId);

    // Get member data from database
    const { data: member, error } = await supabase
      .from("members")
      .select("*")
      .eq("line_user_id", userId)
      .single();

    let replyMessage;

    if (error || !member) {
      // User is not a member
      console.log("❌ User is not a member");
      replyMessage = {
        type: "text",
        text:
          "❌ You are not a member yet.\n\n" +
          "Tap the LIFF button below to register and start earning points! 🌟\n\n" +
          "Benefits:\n" +
          "✅ Earn points on every order\n" +
          "✅ Special member discounts\n" +
          "✅ Exclusive promotions",
      };
    } else {
      // User is a member - show their info
      console.log("✅ Member found:", member);

      const memberSince = new Date(member.created_at).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      replyMessage = {
        type: "text",
        text:
          "⭐ MEMBER CARD ⭐\n\n" +
          `👤 Name: ${member.display_name}\n` +
          `📱 Phone: ${member.phone}\n` +
          `💎 Points: ${member.points} pts\n\n` +
          `📅 Member since: ${memberSince}\n\n` +
          "💡 Type 'dashboard' to see a beautiful member card!\n\n" +
          "Keep ordering to earn more points! 🍣",
      };
    }

    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [replyMessage],
    });
  } catch (error) {
    console.error("❌ Error checking membership:", error);

    const errorMessage = {
      type: "text",
      text: "❌ Sorry, there was an error checking your membership.\nPlease try again later.",
    };

    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [errorMessage],
    });
  }
}

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Webhook URL: /webhook`);
  console.log(`LIFF URL: ${LIFF_URL}`);
});
