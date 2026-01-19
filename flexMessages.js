const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://rrppsqmcunaeouijzrly.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycHBzcW1jdW5hZW91aWp6cmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNzYzMTEsImV4cCI6MjA4Mzc1MjMxMX0.oOh5Dox4S4k9nRjDGMYi1iFUbGSjsnx8_Fgd7n1EE-8";
const supabase = createClient(supabaseUrl, supabaseKey);

// Member Dashboard Flex Message
async function getMemberDashboardFlex(userId, liffUrl) {
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

    // Format the member since date
    const memberSince = new Date(member.created_at).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    return {
      type: "flex",
      altText: `⭐ Member Card - ${member.display_name}`,
      contents: {
        type: "bubble",
        hero: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "⭐ MEMBER CARD",
              weight: "bold",
              size: "xl",
              color: "#ffffff",
              align: "center",
            },
            {
              type: "text",
              text: "Sushi Restaurant",
              color: "#ffffff",
              size: "sm",
              align: "center",
              margin: "md",
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
              color: "#333333",
            },
            {
              type: "separator",
              margin: "lg",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                // Phone
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "📱 Phone:",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 3,
                    },
                    {
                      type: "text",
                      text: member.phone,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 5,
                      weight: "bold",
                    },
                  ],
                },
                // Email (if exists)
                ...(member.email
                  ? [
                      {
                        type: "box",
                        layout: "baseline",
                        spacing: "sm",
                        contents: [
                          {
                            type: "text",
                            text: "📧 Email:",
                            color: "#aaaaaa",
                            size: "sm",
                            flex: 3,
                          },
                          {
                            type: "text",
                            text: member.email,
                            wrap: true,
                            color: "#666666",
                            size: "sm",
                            flex: 5,
                          },
                        ],
                      },
                    ]
                  : []),
                // Points
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "💎 Points:",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 3,
                    },
                    {
                      type: "text",
                      text: `${member.points} pts`,
                      wrap: true,
                      color: "#667eea",
                      size: "lg",
                      flex: 5,
                      weight: "bold",
                    },
                  ],
                },
                // Member since
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "📅 Member since:",
                      color: "#aaaaaa",
                      size: "sm",
                      flex: 3,
                    },
                    {
                      type: "text",
                      text: memberSince,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 5,
                    },
                  ],
                },
              ],
            },
            {
              type: "separator",
              margin: "lg",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              contents: [
                {
                  type: "text",
                  text: "🎉 Keep ordering to earn more points!",
                  size: "sm",
                  color: "#999999",
                  align: "center",
                  wrap: true,
                },
              ],
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "primary",
              height: "sm",
              color: "#667eea",
              action: {
                type: "uri",
                label: "View Full Dashboard 📊",
                uri: `${liffUrl}/dashboard.html`,
              },
            },
            {
              type: "button",
              style: "link",
              height: "sm",
              action: {
                type: "uri",
                label: "Order Now 🍣",
                uri: liffUrl,
              },
            },
          ],
          flex: 0,
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
};
