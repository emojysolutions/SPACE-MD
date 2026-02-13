const aiManager = require('../../utils/aiManager');
const axios = require('axios');
const FormData = require('form-data');

/**
 * Vision Command - AI Image Analysis using GPT-4o Vision
 * Usage: Send an image with caption !vision <optional question>
 */
module.exports = {
  name: 'vision',
  description: 'Analyze images using AI Vision',
  usage: '!vision <optional question> (send with image)',
  category: 'AI',

  async execute(sock, msg, args) {
    const userId = msg.key.remoteJid;

    // Check if Vision is available
    if (!aiManager.isProviderAvailable('vision')) {
      await sock.sendMessage(userId, {
        text: '❌ *AI Vision is not configured*\n\nAsk the bot admin to add `OPENAI_API_KEY` to the .env file.'
      });
      return;
    }

    // Check if message has an image
    const messageType = Object.keys(msg.message || {})[0];
    if (!msg.message?.imageMessage) {
      await sock.sendMessage(userId, {
        text: '❌ *Please send an image with this command!*\n\nExample: Send a photo and add caption `!vision what breed is this dog?`'
      });
      return;
    }

    const question = args.length > 0 ? args.join(' ') : 'What is in this image? Describe it in detail.';

    // Send initial message
    let initialMessage = '👁️ *AI Vision* 👁️\n';
    initialMessage += '━'.repeat(30) + '\n';
    initialMessage += `📷 Question: "${question}"\n`;
    initialMessage += '⏳ _Analyzing your image..._';

    await sock.sendMessage(userId, { text: initialMessage });

    // Send typing indicator
    await sock.sendPresenceUpdate('composing', userId);

    try {
      // Download the image
      const buffer = await sock.downloadMediaMessage(msg);
      
      // Convert image to base64
      const base64Image = buffer.toString('base64');
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;

      // Analyze image
      const analysis = await aiManager.analyzeImage(imageUrl, question);

      // Format response
      let formattedResponse = '👁️ *AI Vision* 👁️\n';
      formattedResponse += '━'.repeat(30) + '\n\n';
      formattedResponse += analysis + '\n\n';
      formattedResponse += '━'.repeat(30) + '\n';
      formattedResponse += '_Powered by GPT-4o Vision_';

      // Split message if too long
      if (formattedResponse.length > 4000) {
        const chunks = splitMessage(formattedResponse, 3800);
        for (const chunk of chunks) {
          await sock.sendMessage(userId, { text: chunk });
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else {
        await sock.sendMessage(userId, { text: formattedResponse });
      }

    } catch (error) {
      console.error('Vision Error:', error);
      await sock.sendMessage(userId, {
        text: `❌ *Image analysis failed!*\n\n${error.message}\n\nTips:\n• Make sure the image is clear and not corrupted\n• Try a different image if this one doesn't work\n• Ask a more specific question about the image`
      });
    } finally {
      await sock.sendPresenceUpdate('paused', userId);
    }
  }
};

function splitMessage(text, maxLength = 3800) {
  const chunks = [];
  let currentChunk = '';
  const lines = text.split('\n');

  for (const line of lines) {
    if ((currentChunk + line + '\n').length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      if (line.length > maxLength) {
        const words = line.split(' ');
        for (const word of words) {
          if ((currentChunk + word + ' ').length > maxLength) {
            chunks.push(currentChunk.trim());
            currentChunk = word + ' ';
          } else {
            currentChunk += word + ' ';
          }
        }
      } else {
        currentChunk = line + '\n';
      }
    } else {
      currentChunk += line + '\n';
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
