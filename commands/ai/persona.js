const aiManager = require('../../utils/aiManager');
const fs = require('fs');
const path = require('path');

/**
 * Persona Command - Set AI Personality
 * Usage: !persona <name> or !persona list or !persona reset
 */
module.exports = {
  name: 'persona',
  description: 'Set AI personality/character',
  usage: '!persona <name> or !persona list or !persona reset',
  category: 'AI',

  async execute(sock, msg, args) {
    const userId = msg.key.remoteJid;
    const senderNumber = msg.key.participant || msg.key.remoteJid;

    // Load personas
    const personasPath = path.join(__dirname, '../../data/personas.json');
    let personas;
    try {
      personas = JSON.parse(fs.readFileSync(personasPath, 'utf8'));
    } catch (error) {
      await sock.sendMessage(userId, {
        text: '❌ *Error loading personas!*\n\nPlease contact the bot admin.'
      });
      return;
    }

    // Handle list command
    if (args.length === 0 || (args.length === 1 && args[0].toLowerCase() === 'list')) {
      await showPersonaList(sock, userId, personas);
      return;
    }

    // Handle reset command
    if (args.length === 1 && args[0].toLowerCase() === 'reset') {
      aiManager.clearPersona(senderNumber);
      await sock.sendMessage(userId, {
        text: '🎭 *Persona Reset!* 🎭\n━━━━━━━━━━━━━━━━━━━━\nAI personality reset to: *Default Assistant* 🤖\n\n_Use !persona list to see all available personas_'
      });
      return;
    }

    const personaName = args[0].toLowerCase();

    // Check if persona exists
    if (!personas[personaName]) {
      await sock.sendMessage(userId, {
        text: `❌ *Persona "${personaName}" not found!*\n\nUse \`!persona list\` to see all available personas.`
      });
      return;
    }

    // Set persona
    aiManager.setPersona(senderNumber, personaName);
    const persona = personas[personaName];

    let message = `🎭 *Persona Updated!* 🎭\n`;
    message += '━'.repeat(30) + '\n';
    message += `AI personality set to: *${persona.name}* ${persona.emoji}\n\n`;
    message += `All AI responses will now be in ${persona.name.toLowerCase()} style!\n\n`;
    message += '━'.repeat(30) + '\n';
    message += '_Use !persona reset to go back to normal_';

    await sock.sendMessage(userId, { text: message });
  }
};

/**
 * Show available personas
 */
async function showPersonaList(sock, userId, personas) {
  let message = '🎭 *Available AI Personas* 🎭\n';
  message += '━'.repeat(30) + '\n\n';

  const personaEntries = Object.entries(personas);
  
  for (const [key, persona] of personaEntries) {
    if (key === 'default') continue; // Skip default in the list
    message += `${persona.emoji} *${persona.name}*\n`;
    message += `   → \`!persona ${key}\`\n\n`;
  }

  message += '━'.repeat(30) + '\n';
  message += '🔄 *Reset to Default*\n';
  message += '   → `!persona reset`\n\n';
  message += '💡 _After setting a persona, use any AI command (!gpt, !claude, !ai, etc.) and the AI will respond in that personality!_';

  await sock.sendMessage(userId, { text: message });
}
