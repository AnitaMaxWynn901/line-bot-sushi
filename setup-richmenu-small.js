const line = require('@line/bot-sdk');
const fs = require('fs');
const https = require('https');

// Replace with your actual Channel Access Token
const channelAccessToken = 'prYaEUH3XjRodzDXB794VDmgNw0s5R/eRajc/EBJkayIAPpNpt1v9ecoWL5HjwmjF4BgMPBS+5+4zljeD54CaBJPS4qYfRivIs4oDU4TAznDzRtcIMYJNRhTzUY20lYSpk/yuVOjqL3wblW8HRahiwdB04t89/1O/w1cDnyilFU=';

// Create LINE client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: channelAccessToken
});

async function uploadRichMenuImage(richMenuId, imagePath) {
  return new Promise((resolve, reject) => {
    const imageData = fs.readFileSync(imagePath);
    
    const options = {
      hostname: 'api-data.line.me',
      path: `/v2/bot/richmenu/${richMenuId}/content`,
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageData.length,
        'Authorization': `Bearer ${channelAccessToken}`
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(imageData);
    req.end();
  });
}

async function deleteOldRichMenus() {
  try {
    console.log('🗑️  Deleting old rich menus...');
    
    // Get list of all rich menus
    const richMenuList = await client.getRichMenuList();
    
    if (richMenuList.richmenus && richMenuList.richmenus.length > 0) {
      for (const menu of richMenuList.richmenus) {
        console.log(`Deleting rich menu: ${menu.richMenuId}`);
        await client.deleteRichMenu(menu.richMenuId);
      }
      console.log('✅ Old rich menus deleted!');
    } else {
      console.log('No old rich menus found.');
    }
  } catch (error) {
    console.error('Error deleting old menus:', error.message);
  }
}

async function createRichMenu() {
  try {
    // Delete old rich menus first
    await deleteOldRichMenus();
    
    console.log('Creating NEW rich menu with Membership button...');

    // Step 1: Create rich menu structure
    const richMenu = {
      size: {
        width: 2500,
        height: 843  // SMALL SIZE
      },
      selected: true,
      name: 'Sushi Menu with Membership',
      chatBarText: 'Menu',
      areas: [
        // Left section - Show Menu
        {
          bounds: {
            x: 0,
            y: 0,
            width: 833,
            height: 843
          },
          action: {
            type: 'message',
            text: 'menu'  // Changed to simple "menu"
          }
        },
        // Middle section - Open LIFF
        {
          bounds: {
            x: 834,
            y: 0,
            width: 833,
            height: 843
          },
          action: {
            type: 'uri',
            uri: 'https://liff.line.me/2008845366-HByFMhkn'
          }
        },
        // Right section - Check Membership (CHANGED FROM HELP!)
        {
          bounds: {
            x: 1667,
            y: 0,
            width: 833,
            height: 843
          },
          action: {
            type: 'message',
            text: 'membership'  // ⭐ CHANGED!
          }
        }
      ]
    };

    // Create the rich menu
    const richMenuResponse = await client.createRichMenu(richMenu);
    const richMenuId = richMenuResponse.richMenuId;
    
    console.log('✅ Rich menu created:', richMenuId);

    // Step 2: Upload image
    console.log('Uploading image...');
    
    const imagePath = 'richmenu-small.png';
    
    // Check if image exists
    if (!fs.existsSync(imagePath)) {
      console.error('❌ Error: richmenu-small.png not found!');
      console.log('Please update your richmenu-small.png image:');
      console.log('- Change "Help" text to "Membership" or "Member Card"');
      console.log('- Size: 2500 x 843 pixels');
      console.log('- Right section should say "Membership" now');
      return;
    }

    await uploadRichMenuImage(richMenuId, imagePath);
    console.log('✅ Image uploaded!');

    // Step 3: Set as default rich menu
    console.log('Setting as default...');
    await client.setDefaultRichMenu(richMenuId);
    
    console.log('✅ Set as default menu!');
    console.log('');
    console.log('🎉 Rich menu updated successfully!');
    console.log('Rich Menu ID:', richMenuId);
    console.log('');
    console.log('Changes:');
    console.log('- Right button now triggers "check membership"');
    console.log('- Bot will show member card when tapped');
    console.log('');
    console.log('⚠️  IMPORTANT: Update your richmenu-small.png image!');
    console.log('   Change the "Help" text to "Membership" in the image.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the function
createRichMenu();