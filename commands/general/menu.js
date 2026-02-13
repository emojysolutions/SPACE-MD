const formatter = require('../../utils/formatter');
const commandLoader = require('../index');
const config = require('../../config');

module.exports = {
    name: 'menu',
    aliases: ['commands', 'cmds'],
    category: 'general',
    description: '📋 Display a beautiful categorized menu of all commands',
    usage: '!menu',
    cooldown: 5000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const categories = commandLoader.getCategories();
        const prefix = config.BOT_PREFIX;

        let message = `
${formatter.header('SPACE-MD Ultra Command Menu')}

${formatter.divider()}
`;

        const categoryEmojis = {
            'general': '📋',
            'fun': '🎉',
            'tools': '🛠️',
            'games': '🎮',
            'admin': '👑'
        };

        const categoryOrder = ['general', 'fun', 'tools', 'games', 'admin'];

        for (const category of categoryOrder) {
            if (!categories.has(category)) continue;

            const commands = commandLoader.getCommandsByCategory(category);
            if (commands.length === 0) continue;

            const emoji = categoryEmojis[category] || '📦';
            message += `\n${emoji} ${formatter.bold(category.toUpperCase())}\n`;

            commands.forEach(cmd => {
                message += `  ${prefix}${cmd.name} - ${cmd.description}\n`;
            });
        }

        message += `
${formatter.divider()}

💡 ${formatter.italic('Tip:')} Use ${formatter.mono('!help <command>')} for detailed info about a specific command!

✨ ${formatter.italic('Have a stellar experience!')} 🚀
        `.trim();

        return message;
    }
};
