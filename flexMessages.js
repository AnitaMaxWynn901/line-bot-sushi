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

    // FIXED: Button URL now includes /dashboard.html path
    // This tells LIFF to open the dashboard.html page specifically
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
};
