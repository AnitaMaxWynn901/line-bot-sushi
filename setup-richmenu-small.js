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

async function createRichMenu() {
  try {
    console.log('Creating rich menu (SMALL SIZE for better mobile view)...');

    // Step 1: Create rich menu structure - SMALL SIZE (843px height)
    const richMenu = {
      size: {
        width: 2500,
        height: 843  // ⚡ SMALL SIZE - takes up less screen space!
      },
      selected: true,
      name: 'Sushi Menu Small',
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
            text: 'Show me the menu'
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
        // Right section - Help
        {
          bounds: {
            x: 1667,
            y: 0,
            width: 833,
            height: 843
          },
          action: {
            type: 'message',
            text: 'help'
          }
        }
      ]
    };

    // Create the rich menu
    const richMenuResponse = await client.createRichMenu(richMenu);
    const richMenuId = richMenuResponse.richMenuId;
    
    console.log('✅ Rich menu created:', richMenuId);

    // Step 2: Upload image using direct API call
    console.log('Uploading image...');
    
    const imagePath = './richmenu-small.png';
    
    // Check if image exists
    if (!fs.existsSync(imagePath)) {
      console.error('❌ Error: richmenu-small.png not found!');
      console.log('Please create a richmenu-small.png image (2500 x 843 pixels) in the same folder.');
      console.log('Note: This is HALF the height of the large version!');
      return;
    }

    // Upload image using direct HTTPS request
    await uploadRichMenuImage(richMenuId, imagePath);
    console.log('✅ Image uploaded!');

    // Step 3: Set as default rich menu
    console.log('Setting as default...');
    await client.setDefaultRichMenu(richMenuId);
    
    console.log('✅ Set as default menu!');
    console.log('');
    console.log('🎉 Rich menu setup complete!');
    console.log('Rich Menu ID:', richMenuId);
    console.log('This smaller menu will take up less space on mobile! 📱');
    console.log('');
    console.log('Now open your LINE bot and you should see the compact menu at the bottom!');
    console.log('It might take 1-2 minutes to appear.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the function
createRichMenu();
