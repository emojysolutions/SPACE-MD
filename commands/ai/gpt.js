const aiManager = require('../../utils/aiManager');
const fs = require('fs');
const path = require('path');

/**
 * GPT Command - Chat with ChatGPT (GPT-4o)
 * Usage: !gpt <message> or !gpt clear
 */
module.exports = {
  name: 'gpt',
  description: 'Chat with ChatGPT (GPT-4o)',
  usage: '!gpt <message> or !gpt clear',
  category: 'AI',

  async execute(sock, msg, args) {
    const userId = msg.key.remoteJid;
    const senderNumber = msg.key.participant || msg.key.remoteJid;

    // Check if provider is available
    if (!aiManager.isProviderAvailable('gpt')) {
      await sock.sendMessage(userId, {
        text: '❌ *ChatGPT is not configured*\n\nAsk the bot admin to add `OPENAI_API_KEY` to the .env file.'
      });
      return;
    }

    // Handle clear command
    if (args.length === 1 && args[0].toLowerCase() === 'clear') {
      aiManager.clearHistory(senderNumber, 'gpt');
      await sock.sendMessage(userId, {
        text: '✅ *GPT conversation history cleared!*\n\nStart a fresh conversation with !gpt <message>'
      });
      return;
    }

    // Check if message is provided
    if (args.length === 0) {
      await sock.sendMessage(userId, {
        text: '❌ *Please include a message!*\n\nExample: `!gpt explain quantum computing in simple terms`'
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

      // Get response from GPT
      const response = await aiManager.chat('gpt', senderNumber, message, systemPrompt);

      // Format response
      const provider = aiManager.getProvider('gpt');
      const personaEmoji = personaName !== 'default' ? getPersonaEmoji(personaName) : '';
      
      let formattedResponse = `🤖 *${provider.name}* ${personaEmoji}\n`;
      formattedResponse += '━'.repeat(24) + '\n\n';
      formattedResponse += response + '\n\n';
      formattedResponse += '━'.repeat(24) + '\n';
      formattedResponse += '💬 _Reply with !gpt to continue the conversation_\n';
      formattedResponse += '🗑️ _Use !gpt clear to reset chat history_';

      // Split message if too long (WhatsApp limit ~4096 chars)
      if (formattedResponse.length > 4000) {
        const chunks = splitMessage(formattedResponse, 3800);
        for (const chunk of chunks) {
          await sock.sendMessage(userId, { text: chunk });
          await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between chunks
        }
      } else {
        await sock.sendMessage(userId, { text: formattedResponse });
      }
    } catch (error) {
      console.error('GPT Error:', error);
      await sock.sendMessage(userId, {
        text: `❌ *Oops! The AI service is having issues.*\n\n${error.message}\n\nTry again later or use a different model with !ai models`
      });
    } finally {
      await sock.sendPresenceUpdate('paused', userId);
    }
  }
};

/**
 * Helper function to get persona emoji
 */
function getPersonaEmoji(personaName) {
  const personasPath = path.join(__dirname, '../../data/personas.json');
  try {
    const personas = JSON.parse(fs.readFileSync(personasPath, 'utf8'));
    return personas[personaName]?.emoji || '';
  } catch (error) {
    return '';
  }
}

/**
 * Helper function to split long messages
 */
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
      // If a single line is longer than maxLength, split it
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
