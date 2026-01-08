const line = require('@line/bot-sdk');
const fs = require('fs');

// Replace with your actual Channel Access Token
const channelAccessToken = 'prYaEUH3XjRodzDXB794VDmgNw0s5R/eRajc/EBJkayIAPpNpt1v9ecoWL5HjwmjF4BgMPBS+5+4zljeD54CaBJPS4qYfRivIs4oDU4TAznDzRtcIMYJNRhTzUY20lYSpk/yuVOjqL3wblW8HRahiwdB04t89/1O/w1cDnyilFU=';

// Create LINE client using the new SDK v8+ syntax
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: channelAccessToken
});

async function createRichMenu() {
  try {
    console.log('Creating rich menu...');

    // Step 1: Create rich menu structure
    const richMenu = {
      size: {
        width: 2500,
        height: 1686
      },
      selected: true,
      name: 'Sushi Menu',
      chatBarText: 'Menu',
      areas: [
        // Left section - Show Menu
        {
          bounds: {
            x: 0,
            y: 0,
            width: 833,
            height: 1686
          },
          action: {
            type: 'message',
            text: 'Show me the menu'
          }
        },
        // Middle section - Open LIFF (replace with your LIFF ID)
        {
          bounds: {
            x: 834,
            y: 0,
            width: 833,
            height: 1686
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
            height: 1686
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

    // Step 2: Upload image
    console.log('Uploading image...');
    
    const imagePath = '/richmenu.png';
    
    // Check if image exists
    if (!fs.existsSync(imagePath)) {
      console.error('❌ Error: richmenu.png not found!');
      console.log('Please create a richmenu.png image (2500 x 1686 pixels) in the same folder.');
      return;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    
    // Upload using the correct method for SDK v8+
    await client.setRichMenuImage(
      richMenuId,
      imageBuffer,
      'image/png'
    );

    console.log('✅ Image uploaded!');

    // Step 3: Set as default rich menu
    console.log('Setting as default...');
    await client.setDefaultRichMenu(richMenuId);
    
    console.log('✅ Set as default menu!');
    console.log('');
    console.log('🎉 Rich menu setup complete!');
    console.log('Rich Menu ID:', richMenuId);
    console.log('');
    console.log('Now open your LINE bot and you should see the menu at the bottom!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    
    // Common error tips
    console.log('');
    console.log('💡 Common issues:');
    console.log('1. Make sure your Channel Access Token is correct');
    console.log('2. Make sure richmenu.png exists (2500 x 1686 pixels)');
    console.log('3. Make sure the image is under 1MB');
    console.log('4. Replace YOUR_LIFF_ID_HERE with your actual LIFF ID');
  }
}

// Run the function
createRichMenu();