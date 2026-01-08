const line = require('@line/bot-sdk');

// Replace with your actual Channel Access Token
const channelAccessToken = 'prYaEUH3XjRodzDXB794VDmgNw0s5R/eRajc/EBJkayIAPpNpt1v9ecoWL5HjwmjF4BgMPBS+5+4zljeD54CaBJPS4qYfRivIs4oDU4TAznDzRtcIMYJNRhTzUY20lYSpk/yuVOjqL3wblW8HRahiwdB04t89/1O/w1cDnyilFU=';

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: channelAccessToken
});

async function deleteAllRichMenus() {
  try {
    console.log('Fetching all rich menus...');
    
    // Get list of all rich menus
    const richMenus = await client.getRichMenuList();
    
    if (richMenus.richmenus.length === 0) {
      console.log('No rich menus found.');
      return;
    }
    
    console.log(`Found ${richMenus.richmenus.length} rich menu(s):`);
    richMenus.richmenus.forEach((menu, index) => {
      console.log(`${index + 1}. ${menu.name} (${menu.richMenuId})`);
    });
    
    // Delete each rich menu
    for (const menu of richMenus.richmenus) {
      console.log(`\nDeleting: ${menu.name}...`);
      await client.deleteRichMenu(menu.richMenuId);
      console.log(`✅ Deleted: ${menu.richMenuId}`);
    }
    
    console.log('\n🎉 All rich menus deleted successfully!');
    console.log('The menu should disappear from your LINE chat soon.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the function
deleteAllRichMenus();