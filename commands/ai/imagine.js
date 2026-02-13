const aiManager = require('../../utils/aiManager');
const axios = require('axios');

/**
 * Imagine Command - AI Image Generation using DALL-E 3
 * Usage: !imagine <prompt>
 */
module.exports = {
  name: 'imagine',
  description: 'Generate images using DALL-E 3',
  usage: '!imagine <prompt>',
  category: 'AI',

  async execute(sock, msg, args) {
    const userId = msg.key.remoteJid;

    // Check if DALL-E is available
    if (!aiManager.isProviderAvailable('imagine')) {
      await sock.sendMessage(userId, {
        text: '❌ *DALL-E 3 is not configured*\n\nAsk the bot admin to add `OPENAI_API_KEY` to the .env file.'
      });
      return;
    }

    // Check if prompt is provided
    if (args.length === 0) {
      await sock.sendMessage(userId, {
        text: '❌ *Please include an image prompt!*\n\nExample: `!imagine a cat astronaut floating in space`'
      });
      return;
    }

    const prompt = args.join(' ');

    // Check prompt length
    if (prompt.length > 1000) {
      await sock.sendMessage(userId, {
        text: '❌ *Prompt too long!*\n\nPlease keep your prompt under 1000 characters.'
      });
      return;
    }

    // Send initial message
    let initialMessage = '🎨 *DALL-E 3 Image Generator* 🎨\n';
    initialMessage += '━'.repeat(30) + '\n';
    initialMessage += `🖌️ Prompt: "${prompt}"\n`;
    initialMessage += '⏳ _Generating your image..._';

    await sock.sendMessage(userId, { text: initialMessage });

    // Send typing indicator
    await sock.sendPresenceUpdate('composing', userId);

    try {
      // Generate image
      const imageUrl = await aiManager.generateImage(prompt);

      // Download image
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');

      // Send success message with image
      let successMessage = '✅ *Image Generated!*\n';
      successMessage += `📝 Prompt: "${prompt}"\n`;
      successMessage += '_Powered by DALL-E 3_';

      await sock.sendMessage(userId, {
        image: imageBuffer,
        caption: successMessage
      });

    } catch (error) {
      console.error('DALL-E Error:', error);
      await sock.sendMessage(userId, {
        text: `❌ *Image generation failed!*\n\n${error.message}\n\nTips:\n• Make sure your prompt is clear and descriptive\n• Avoid requesting copyrighted or inappropriate content\n• Try a different prompt if this one doesn't work`
      });
    } finally {
      await sock.sendPresenceUpdate('paused', userId);
    }
  }
};
