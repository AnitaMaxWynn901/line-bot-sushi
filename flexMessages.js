const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://rrppsqmcunaeouijzrly.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycHBzcW1jdW5hZW91aWp6cmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNzYzMTEsImV4cCI6MjA4Mzc1MjMxMX0.oOh5Dox4S4k9nRjDGMYi1iFUbGSjsnx8_Fgd7n1EE-8";
const supabase = createClient(supabaseUrl, supabaseKey);

// Member Dashboard Flex Message
async function getMemberDashboardFlex(userId) {
  try {
    console.log("📊 Creating Member Dashboard Flex Message for:", userId);

    // Fetch member data from Supabase
    const { data: member, error } = await supabase
      .from("members")
      .select("*")
      .eq("line_user_id", userId)
      .single();

    if (error || !member) {
      console.log("❌ Member not found");
      return null;
    }

    console.log("✅ Member found:", member.display_name);

    // Button URL - opens the LIFF app base URL
    const liffUrl = "https://liff.line.me/2008845366-m8PxiFt0";

    return {
      type: "flex",
      altText: `📊 Member Dashboard - ${member.display_name}`,
      contents: {
        type: "bubble",
        size: "kilo",
        hero: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "📊 MEMBER DASHBOARD",
              weight: "bold",
              size: "xl",
              color: "#ffffff",
              align: "center",
            },
            {
              type: "text",
              text: "Sushi Restaurant",
              size: "sm",
              color: "#ffffff",
              align: "center",
              margin: "sm",
            },
          ],
          backgroundColor: "#667eea",
          paddingAll: "20px",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `Hello, ${member.display_name}! 👋`,
              weight: "bold",
              size: "xl",
              wrap: true,
              align: "center",
              color: "#333333",
            },
            {
              type: "separator",
              margin: "lg",
            },
            {
              type: "box",
              layout: "horizontal",
              margin: "lg",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "💎",
                      size: "xxl",
                      align: "center",
                    },
                    {
                      type: "text",
                      text: `${member.points}`,
                      size: "xxl",
                      weight: "bold",
                      align: "center",
                      color: "#667eea",
                    },
                    {
                      type: "text",
                      text: "Points",
                      size: "sm",
                      color: "#999999",
                      align: "center",
                      margin: "sm",
                    },
                  ],
                  flex: 1,
                },
              ],
            },
            {
              type: "separator",
              margin: "lg",
            },
            {
              type: "text",
              text: "Tap below for complete details",
              size: "sm",
              color: "#999999",
              align: "center",
              margin: "lg",
              wrap: true,
            },
          ],
          paddingAll: "20px",
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "primary",
              height: "sm",
              color: "#667eea",
              action: {
                type: "uri",
                label: "View Full Dashboard 📊",
                uri: liffUrl,
              },
            },
          ],
          paddingAll: "15px",
        },
      },
    };
  } catch (error) {
    console.error("❌ Error creating Member Dashboard Flex:", error);
    return null;
  }
}

module.exports = {
  getMemberDashboardFlex,
  getPromotionsFlex,
  getMenuFlex,
};

// Menu Carousel Flex Message
function getMenuFlex() {
  return {
    type: "flex",
    altText: "🍣 Sushi Menu - Swipe to see all items!",
    contents: {
      type: "carousel",
      contents: [
        // Card 1: Salmon Sushi
        {
          type: "bubble",
          size: "micro",
          hero: {
            type: "image",
            url: "https://i.ibb.co/s9mZKZ4t/salmon-sushi.jpg",
            size: "full",
            aspectRatio: "1:1",
            aspectMode: "cover",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "Salmon Sushi",
                weight: "bold",
                size: "md",
              },
              {
                type: "text",
                text: "$12",
                size: "xl",
                color: "#000000",
                weight: "bold",
                margin: "xs",
              },
            ],
            paddingAll: "13px",
          },
        },

        // Card 2: Tuna Sushi
        {
          type: "bubble",
          size: "micro",
          hero: {
            type: "image",
            url: "https://i.ibb.co/PdXMqRq/tuna-sushi.png",
            size: "full",
            aspectRatio: "1:1",
            aspectMode: "cover",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "Tuna Sushi",
                weight: "bold",
                size: "md",
              },
              {
                type: "text",
                text: "$15",
                size: "xl",
                color: "#000000",
                weight: "bold",
                margin: "xs",
              },
            ],
            paddingAll: "13px",
          },
        },

        // Card 3: Unagi Sushi
        {
          type: "bubble",
          size: "micro",
          hero: {
            type: "image",
            url: "https://i.ibb.co/rRPnH4dT/unagi-sushi.png",
            size: "full",
            aspectRatio: "1:1",
            aspectMode: "cover",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "Unagi Sushi",
                weight: "bold",
                size: "md",
              },
              {
                type: "text",
                text: "$18",
                size: "xl",
                color: "#000000",
                weight: "bold",
                margin: "xs",
              },
            ],
            paddingAll: "13px",
          },
        },
      ],
    },
  };
}

// Promotions Carousel Flex Message
// Using LIFF URL so the close button works properly
function getPromotionsFlex() {
  // LIFF URL for Promotions app
  const baseLiffUrl = "https://liff.line.me/2008845366-bP1BJL4O";

  return {
    type: "flex",
    altText: "🎉 Current Promotions - Swipe to see all deals!",
    contents: {
      type: "carousel",
      contents: [
        // Card 1: Happy Hour Special
        {
          type: "bubble",
          size: "kilo",
          hero: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "🍱",
                size: "4xl",
                align: "center",
              },
              {
                type: "text",
                text: "20% OFF",
                size: "3xl",
                weight: "bold",
                color: "#ffffff",
                align: "center",
                margin: "md",
              },
            ],
            backgroundColor: "#FF6B6B",
            paddingAll: "30px",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "HAPPY HOUR SPECIAL",
                weight: "bold",
                size: "xl",
                wrap: true,
              },
              {
                type: "text",
                text: "20% off all sushi",
                size: "md",
                color: "#FF6B6B",
                margin: "md",
                weight: "bold",
              },
              {
                type: "text",
                text: "⏰ 3:00 PM - 5:00 PM Daily",
                size: "sm",
                color: "#999999",
                margin: "md",
              },
              {
                type: "text",
                text: "Come enjoy our delicious sushi at a special price during happy hour!",
                size: "xs",
                color: "#666666",
                margin: "md",
                wrap: true,
              },
            ],
            paddingAll: "20px",
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                style: "primary",
                height: "sm",
                action: {
                  type: "uri",
                  label: "View Details 📋",
                  uri: `${baseLiffUrl}?promo=happy-hour`,
                },
                color: "#FF6B6B",
              },
            ],
            paddingAll: "15px",
          },
        },

        // Card 2: New Member Bonus
        {
          type: "bubble",
          size: "kilo",
          hero: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "⭐",
                size: "4xl",
                align: "center",
              },
              {
                type: "text",
                text: "10 POINTS",
                size: "3xl",
                weight: "bold",
                color: "#ffffff",
                align: "center",
                margin: "md",
              },
            ],
            backgroundColor: "#4ECDC4",
            paddingAll: "30px",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "NEW MEMBER BONUS",
                weight: "bold",
                size: "xl",
                wrap: true,
              },
              {
                type: "text",
                text: "Get 10 Points Free!",
                size: "md",
                color: "#4ECDC4",
                margin: "md",
                weight: "bold",
              },
              {
                type: "text",
                text: "🎁 For first-time members",
                size: "sm",
                color: "#999999",
                margin: "md",
              },
              {
                type: "text",
                text: "Register now and start earning rewards on every order!",
                size: "xs",
                color: "#666666",
                margin: "md",
                wrap: true,
              },
            ],
            paddingAll: "20px",
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                style: "primary",
                height: "sm",
                action: {
                  type: "uri",
                  label: "View Details 📋",
                  uri: `${baseLiffUrl}?promo=new-member`,
                },
                color: "#4ECDC4",
              },
            ],
            paddingAll: "15px",
          },
        },

        // Card 3: Refer a Friend
        {
          type: "bubble",
          size: "kilo",
          hero: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "👥",
                size: "4xl",
                align: "center",
              },
              {
                type: "text",
                text: "5 POINTS EACH",
                size: "3xl",
                weight: "bold",
                color: "#ffffff",
                align: "center",
                margin: "md",
              },
            ],
            backgroundColor: "#FFB84D",
            paddingAll: "30px",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "REFER A FRIEND",
                weight: "bold",
                size: "xl",
                wrap: true,
              },
              {
                type: "text",
                text: "Both Get 5 Points",
                size: "md",
                color: "#FFB84D",
                margin: "md",
                weight: "bold",
              },
              {
                type: "text",
                text: "🎊 Share the love of sushi!",
                size: "sm",
                color: "#999999",
                margin: "md",
              },
              {
                type: "text",
                text: "Invite your friends and both of you earn bonus points!",
                size: "xs",
                color: "#666666",
                margin: "md",
                wrap: true,
              },
            ],
            paddingAll: "20px",
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                style: "primary",
                height: "sm",
                action: {
                  type: "uri",
                  label: "View Details 📋",
                  uri: `${baseLiffUrl}?promo=refer-friend`,
                },
                color: "#FFB84D",
              },
            ],
            paddingAll: "15px",
          },
        },
      ],
    },
  };
}
