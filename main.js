const request = require('request');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function sendMessage(botToken, chatId, message) {
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const stopMessage = "\n\n -> if you want to stop this spam, contact https://t.me/riizeisme <-";
  const fullMessage = message + stopMessage;

  const options = {
    method: 'POST',
    uri: apiUrl,
    json: {
      chat_id: chatId,
      text: fullMessage,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200 && body.ok) {
        resolve(body.result);
      } else {
        reject(body || error);
      }
    });
  });
}

const defaultDelayBetweenMessages = 500; // 0,5 DETIK DELAYNYA BISA DIGANTI SESUKAMU

async function sendMessagesWithDelay(botToken, chatId, messages, loopCount, delayBetweenMessages = defaultDelayBetweenMessages) {
  try {
    for (let i = 0; i < loopCount; i++) {
      const randomMessageIndex = Math.floor(Math.random() * messages.length);
      const randomMessage = messages[randomMessageIndex];

      try {
        const result = await sendMessage(botToken, chatId, randomMessage);
        if (result && result.message_id) {
          const firstName = result.chat.first_name || 'Unknown';
          console.log(`Message "${randomMessage}" successfully sent to ${firstName}`);
        } else {
          console.error('Failed to send message:', result);
        }
      } catch (error) {
        console.error('Error sending message:', error.message || error);
      }

      if (i < loopCount - 1) {
        console.log(`-> Waiting for ${delayBetweenMessages / 1000} seconds before sending the next message...`);
        await delay(delayBetweenMessages);
      }
    }

    console.log('-> All messages successfully sent.');
  } catch (error) {
    console.error('-> Error sending messages:', error.message || error);
  } finally {
    rl.close();
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function inputCustomMessage() {
  return new Promise(resolve => {
    rl.question('Input custom message (separate with commas): ', (inputMessages) => {
      const messages = inputMessages.split(',').map(message => message.trim());
      resolve(messages);
    });
  });
}

async function sendMessagesMenu(botToken, chatId) {
  console.log('1. Input custom message');
  console.log('2. Send message with template');
  console.log('3. Send message with image');

  rl.question('Choose menu (1/2/3): ', async (menuChoice) => {
    switch (menuChoice) {
      case '1':
        const customMessages = await inputCustomMessage();
        rl.question('How many want to spam? ', (loopCount) => {
          sendMessagesWithDelay(botToken, chatId, customMessages, loopCount);
        });
        break;
      case '2':
        rl.question('How many want to spam with the template? ', (loopCount) => {
          sendMessagesWithDelay(botToken, chatId, listAbangkuh, loopCount);
        });
        break;
      case '3':
        rl.question('Enter the URL of the image: ', async (imageUrl) => {
          rl.question('Enter the caption for the image: ', async (caption) => {
            rl.question('How many times do you want to send this image? ', (loopCount) => {
              sendPhotoMessageWithDelay(botToken, chatId, imageUrl, caption, loopCount);
            });
          });
        });
        break;
      default:
        console.error('Invalid menu choice. Please choose 1, 2, or 3.');
        rl.close();
        break;
    }
  });
}

async function sendPhotoMessage(botToken, chatId, imageUrl, caption) {
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

  const options = {
    method: 'POST',
    uri: apiUrl,
    formData: {
      chat_id: chatId,
      photo: imageUrl,
      caption: caption,
      parse_mode: "HTML"
    },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200 && body.ok) {
        resolve(body.result);
      } else {
        reject(body || error);
      }
    });
  });
}

async function sendPhotoMessageWithDelay(botToken, chatId, imageUrl, caption, loopCount, delayBetweenMessages = defaultDelayBetweenMessages) {
  try {
    for (let i = 0; i < loopCount; i++) {
      try {
        const result = await sendPhotoMessage(botToken, chatId, imageUrl, caption);
        if (result && result.ok) {
          console.log(`Image message successfully sent to chat ID: ${chatId}`);
        } else {
          console.error('Failed to send image message:', result);
        }
      } catch (error) {
        console.error(error.message || error);
      }

      if (i < loopCount - 1) {
        console.log(`-> Waiting for ${delayBetweenMessages / 1000} seconds before sending the next message...`);
        await delay(delayBetweenMessages);
      }
    }

    console.log('-> All image messages successfully sent.');
  } catch (error) {
    console.error('-> Error sending image messages:', error.message || error);
  } finally {
    rl.close();
  }
}

const listAbangkuh = [
  "kijang 1, ganti 🦌",
  "kasih paham queen 🤭🔥 MENYALA",
  "jangan kasih kendor ee 🕺🏻🕺🏻",
  "kasih tebal king 🤙🤙",
  "izin abangkuu 🔥",
  "jagoan mama muncul 🔥🔥🔥",
  "kasih paham queen, ilmu baddie 🔥🔥💅💅",
  "giling terus boss 💪",
  "capt idolaa 🔥🙌🏼🔝",
  "manyala panutan abangda 🔥🔥",
  "kasih apa? kasih paham abangkuhh👊👊👊🔥🔥🔥🔥",
  "weees kelas abangku 🔥🔥",
  "top abangku 👍🏼👍🏼",
  "kasi paham wakk 🔥🔥🔥",
  "tetep ilmu padi 🌾🌾",
  "isinya daging semua abangkuu🔥🔥🔛🔝",
  "🔛🔝 selalu idola 🔥",
  "eitsss pondasi bangsa abangkuuhh 🔥🔝🙌🏼",
  "mahkota sedang transit di dc cakung kingg 🔥👑🙇‍♂️",
  "abang idola panutan ini 😘😘",
  "manyala ilmu padi 🌾🔥",
  "kasih jedag jedug dulu abangkuh🤩🥵",
  "ini mahkotamu king 👑",
  "top selalu idola 🔥",
  "kalau diatas jgn lupa merunduk 🌾🙌🏼🙇‍♂️",
  "mantap kali bahh 🔥🔥",
  "sesekali 🙌🏼",
  "top 🔝",
  "beraksi🍻🍻",
  "menyala abangkuhh 🔥🔥🔥",
  "kelas boskuuuh 🔥👍🏼",
  "makasih sharingnya abangkuhh, tetaplah ilmu padi 🌾🙇‍♂️🌾🔝🔝🔝",
  "tetap ilmu oriza sativa 🌾",
  "kasih paham tipis tipis 🤝🏼",
  "starboy vibez🥵😎🥀💥🐙",
  "eihhh mantaapp pedii kaliii 🔥🔥🔥",
  "wanita mana yang berani menyakitimu king 💯💯💪❤‍🔥",
  "kelas abangkuu 🔥🔝",
  "sehat selalu kaka panutan 💪💪🫡",
  "gas kanda 🔥🔥",
  "percaya proses capt 🔥🔥",
  "idola 🙌🏼🙌🏼",
  "eh yg punya setengah indo nih ee 😜😜",
  "kasih paham capt 🔥💯🙌🏼",
  "percaya proses king 💯💯💪❤‍🔥",
  "tetap membumi abangkuh 🔥🙌🏼🌎",
  "kasih keras abangkuhh 🔥👊🏼",
  "manyala capt 🔥🔥",
  "terstill💪💪",
  "bertahap abangkuuuu🔥🤙🪜👟",
  "gokil capt kaki tiga🦵🔥🔥",
  "kasih keras idola 🔥🔥",
  "jangan kasi longgar king 🔥🔥🔥",
  "tipis tipis 🔥🔛🔝",
  "nikmati proses kakandaaa🤙🔥🙇‍♂️",
  "trcium aroma ilmu padi abangkuh🔥🔥🌾🌾",
  "sungkem dulu abangkuuu🙇‍♂️🙇‍♂️",
  "biarkan abangku memasakkk🔥🔥🧑‍🍳🧑‍🍳",
  "kasih tahu abangkuuu🔥🔥🙇‍♂️🙇‍♂️",
  "meroket abangku 🚀🚀🚀",
  "ilmu padi abangkuhh🌾🌾👊🏻💥🔥",
  "kelas banget kanda 🙏🏼🕺🏻",
  "rispeekk 👍🏼🙌🏼",
  "jangan kasih kendor king 🔥🔥🔥",
  "panutan 🔝✊🏼🙌🏼",
  "bercahaya abangkuhh 🔥💡💡",
  "masih memantau 🔭🔭🔭",
  "mahkotamu masih dilas, king 👑",
  "terbaik kandaku 🙌🏼",
  "tipis tipis asal menyala king 👑🔥",
  "kelas abangda 🔥🫡",
  "apotik tutup captain 🔥🔥💯🔝",
  "lanjutkan abangkuuhh 🔥🔝💥"
];

rl.question('Input Token Bot Telegram: ', (botToken) => {
  rl.question('Input UserID: ', (chatId) => {
    sendMessagesMenu(botToken, chatId);
  });
});