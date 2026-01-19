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

    // Get the base LIFF URL without /liff-app.html or /dashboard.html
    // If liffUrl is "https://liff.line.me/2008845366-HByFMhkn" we use it directly
    const baseUrl = liffUrl;

    return {
      type: "flex",
      altText: `📊 Member Dashboard - ${member.display_name}`,
      contents: {
        type: "bubble",
        size: "micro",
        hero: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "📊 Member Dashboard",
              weight: "bold",
              size: "lg",
              color: "#ffffff",
              align: "center",
            },
          ],
          backgroundColor: "#667eea",
          paddingAll: "15px",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `Hello, ${member.display_name}! 👋`,
              weight: "bold",
              size: "md",
              wrap: true,
              align: "center",
              color: "#333333",
            },
            {
              type: "text",
              text: `💎 ${member.points} Points`,
              size: "xl",
              weight: "bold",
              align: "center",
              color: "#667eea",
              margin: "md",
            },
            {
              type: "text",
              text: "Tap below to view your complete dashboard",
              size: "xs",
              color: "#999999",
              align: "center",
              wrap: true,
              margin: "md",
            },
          ],
          paddingAll: "15px",
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
                label: "View Dashboard 📊",
                uri: `${baseUrl}/dashboard.html`,
              },
            },
          ],
          paddingAll: "10px",
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
