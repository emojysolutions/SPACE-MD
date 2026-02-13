const formatter = require('../../utils/formatter');
const config = require('../../config');

module.exports = {
    name: 'about',
    aliases: ['info', 'botinfo'],
    category: 'general',
    description: '🤖 Information about SPACE-MD Ultra',
    usage: '!about',
    cooldown: 5000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const uptime = Date.now() - config.START_TIME;
        const uptimeFormatted = formatter.formatDuration(uptime);
        
        const commandCount = stats.commandCount || 0;
        const totalMessages = stats.totalMessages || 0;
        const uniqueUsers = stats.uniqueUsers || 0;

        const message = `
${formatter.header('SPACE-MD Ultra')}

${formatter.divider()}

🚀 ${formatter.bold('Bot Name:')} ${config.BOT_NAME}
📦 ${formatter.bold('Version:')} ${config.BOT_VERSION}
👨‍💻 ${formatter.bold('Creator:')} Tylor
🌌 ${formatter.bold('Theme:')} Space Explorer

${formatter.divider()}

📊 ${formatter.bold('STATISTICS')}

⏰ ${formatter.bold('Uptime:')} ${uptimeFormatted}
🎮 ${formatter.bold('Commands:')} ${commandCount} available
💬 ${formatter.bold('Messages Processed:')} ${formatter.cleanNumber(totalMessages)}
👥 ${formatter.bold('Users:')} ${formatter.cleanNumber(uniqueUsers)}

${formatter.divider()}

✨ ${formatter.italic('A feature-rich WhatsApp bot built for the stars!')}

Type ${formatter.mono('!menu')} to see all available commands!
        `.trim();

        return message;
    }
};
