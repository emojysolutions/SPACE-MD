const formatter = require('../../utils/formatter');
const commandLoader = require('../index');
const config = require('../../config');

module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    category: 'general',
    description: '❓ Get help about commands',
    usage: '!help [command]',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const prefix = config.BOT_PREFIX;

        // If no argument, show general help
        if (args.length === 0) {
            const categories = commandLoader.getCategories();
            let message = `
${formatter.header('Help Center')}

${formatter.divider()}

💡 ${formatter.bold('How to use:')}
Type ${formatter.mono(prefix + 'help <command>')} to get detailed info about a specific command.

Example: ${formatter.mono(prefix + 'help joke')}

${formatter.divider()}

📚 ${formatter.bold('Command Categories:')}

`;

            const categoryEmojis = {
                'general': '📋',
                'fun': '🎉',
                'tools': '🛠️',
                'games': '🎮',
                'admin': '👑'
            };

            for (const [category, commands] of categories.entries()) {
                const emoji = categoryEmojis[category] || '📦';
                message += `${emoji} ${formatter.bold(category.toUpperCase())} - ${commands.length} commands\n`;
            }

            message += `
${formatter.divider()}

🎯 ${formatter.italic('Quick Access:')}
• ${formatter.mono(prefix + 'menu')} - View all commands
• ${formatter.mono(prefix + 'about')} - Bot information
• ${formatter.mono(prefix + 'ping')} - Check bot status

✨ ${formatter.italic('Explore the cosmos of features!')} 🌌
            `.trim();

            return message;
        }

        // Show help for specific command
        const commandName = args[0].toLowerCase();
        const command = commandLoader.getCommand(commandName);

        if (!command) {
            return `❌ Command ${formatter.mono(commandName)} not found!\n\nUse ${formatter.mono(prefix + 'help')} to see all available commands.`;
        }

        const aliases = command.aliases ? command.aliases.join(', ') : 'None';
        const cooldown = command.cooldown ? `${command.cooldown / 1000}s` : '3s';

        const message = `
${formatter.header(command.name.toUpperCase())}

${formatter.divider()}

📝 ${formatter.bold('Description:')}
${command.description}

🎯 ${formatter.bold('Usage:')}
${formatter.mono(command.usage)}

🔤 ${formatter.bold('Aliases:')}
${aliases}

⏱️ ${formatter.bold('Cooldown:')}
${cooldown}

📂 ${formatter.bold('Category:')}
${command.category}

${command.adminOnly ? '👑 ' + formatter.bold('Admin Only') : ''}

${formatter.divider()}

💡 ${formatter.italic('Tip:')} Type ${formatter.mono(prefix + 'menu')} to see all commands!
        `.trim();

        return message;
    }
};
