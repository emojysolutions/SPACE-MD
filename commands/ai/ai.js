const aiManager = require('../../utils/aiManager');
const fs = require('fs');
const path = require('path');

/**
 * AI Command - Smart Auto-Router
 * Automatically picks the best available model
 * Priority: GPT-5 > Claude Opus > Gemini > DeepSeek
 * Usage: !ai <message> or !ai clear or !ai models
 */
module.exports = {
  name: 'ai',
  description: 'Smart AI - Auto-picks the best available model',
  usage: '!ai <message> or !ai clear or !ai models',
  category: 'AI',

  async execute(sock, msg, args) {
    const userId = msg.key.remoteJid;
    const senderNumber = msg.key.participant || msg.key.remoteJid;

    // Handle models/list command
    if (args.length === 1 && (args[0].toLowerCase() === 'models' || args[0].toLowerCase() === 'list')) {
      await showModelsList(sock, userId);
      return;
    }

    // Handle clear command
    if (args.length === 1 && args[0].toLowerCase() === 'clear') {
      aiManager.clearHistory(senderNumber);
      await sock.sendMessage(userId, {
        text: '✅ *All AI conversation histories cleared!*\n\nStart fresh conversations with any AI model.'
      });
      return;
    }

    // Check if message is provided
    if (args.length === 0) {
      await sock.sendMessage(userId, {
        text: '❌ *Please include a message!*\n\nExample: `!ai tell me a joke`\n\nOther commands:\n• `!ai models` - Show available AI models\n• `!ai clear` - Clear all conversation histories'
      });
      return;
    }

    const message = args.join(' ');

    // Check message length
    if (message.length > 2000) {
      await sock.sendMessage(userId, {
        text: '❌ *Message too long!*\n\nPlease keep your message under 2000 characters.'
      });
      return;
    }

    // Send typing indicator
    await sock.sendPresenceUpdate('composing', userId);

    try {
      // Get user's persona
      const personaName = aiManager.getPersona(senderNumber);
      let systemPrompt = null;
      
      if (personaName !== 'default') {
        const personasPath = path.join(__dirname, '../../data/personas.json');
        const personas = JSON.parse(fs.readFileSync(personasPath, 'utf8'));
        const persona = personas[personaName];
        if (persona) {
          systemPrompt = persona.prompt;
        }
      }

      // Use smart routing to get the best available model
      const { response, provider } = await aiManager.smartChat(senderNumber, message, systemPrompt);

      // Format response
      const personaEmoji = personaName !== 'default' ? getPersonaEmoji(personaName) : '';
      
      let formattedResponse = `🧠 *SPACE-MD AI* (powered by ${provider.name}) ${personaEmoji}\n`;
      formattedResponse += '━'.repeat(24) + '\n\n';
      formattedResponse += response + '\n\n';
      formattedResponse += '━'.repeat(24) + '\n';
      formattedResponse += '💡 _Type !ai models to see all available AI models_';

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
      console.error('AI Error:', error);
      await sock.sendMessage(userId, {
        text: `❌ *Error:* ${error.message}\n\nUse \`!ai models\` to see available AI models.`
      });
    } finally {
      await sock.sendPresenceUpdate('paused', userId);
    }
  }
};

/**
 * Show available AI models
 */
async function showModelsList(sock, userId) {
  const available = aiManager.getAvailableProviders();
  
  let message = '🤖 *Available AI Models* 🤖\n';
  message += '━'.repeat(30) + '\n\n';

  // Chat Models
  const gptAvailable = aiManager.isProviderAvailable('gpt');
  const gpt4Available = aiManager.isProviderAvailable('gpt4');
  const claudeAvailable = aiManager.isProviderAvailable('claude');
  const sonnetAvailable = aiManager.isProviderAvailable('sonnet');
  const geminiAvailable = aiManager.isProviderAvailable('gemini');
  const deepseekAvailable = aiManager.isProviderAvailable('deepseek');
  const imagineAvailable = aiManager.isProviderAvailable('imagine');
  const visionAvailable = aiManager.isProviderAvailable('vision');

  message += `${gptAvailable ? '✅' : '❌'} *ChatGPT GPT-5*     → \`!gpt <message>\`\n`;
  message += `${gpt4Available ? '✅' : '❌'} *ChatGPT GPT-4o*    → \`!gpt4 <message>\`\n`;
  message += `${claudeAvailable ? '✅' : '❌'} *Claude Opus*        → \`!claude <message>\`\n`;
  message += `${sonnetAvailable ? '✅' : '❌'} *Claude Sonnet*      → \`!sonnet <message>\`\n`;
  message += `${geminiAvailable ? '✅' : '❌'} *Google Gemini*      → \`!gemini <message>\`\n`;
  message += `${deepseekAvailable ? '✅' : '❌'} *DeepSeek*           → \`!deepseek <message>\`\n`;
  message += `${imagineAvailable ? '✅' : '❌'} *DALL-E 3*           → \`!imagine <prompt>\`\n`;
  message += `${visionAvailable ? '✅' : '❌'} *AI Vision*          → \`!vision\` (send with image)\n\n`;

  message += '━'.repeat(30) + '\n';
  message += '🧠 *Smart AI*          → \`!ai <message>\`\n';
  message += '   _Auto-picks the best available model_\n\n';
  
  message += '🎭 *Personas*          → \`!persona <name>\`\n';
  message += '🗑️ *Clear History*     → \`!gpt clear\` / \`!ai clear\`\n\n';

  // Show configuration status
  if (!gptAvailable && !claudeAvailable && !geminiAvailable && !deepseekAvailable) {
    message += '⚠️ *No AI models configured!*\n';
    message += 'Ask the bot admin to add API keys to the .env file.';
  }

  await sock.sendMessage(userId, { text: message });
}

function getPersonaEmoji(personaName) {
  const personasPath = path.join(__dirname, '../../data/personas.json');
  try {
    const personas = JSON.parse(fs.readFileSync(personasPath, 'utf8'));
    return personas[personaName]?.emoji || '';
  } catch (error) {
    return '';
  }
}

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
