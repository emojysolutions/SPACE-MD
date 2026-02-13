const formatter = require('../../utils/formatter');

const reminders = new Map();

module.exports = {
    name: 'remind',
    aliases: ['reminder', 'remindme'],
    category: 'tools',
    description: '⏰ Set a reminder (in-memory)',
    usage: '!remind <minutes> <message>',
    cooldown: 5000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length < 2) {
            return `⏰ Please specify minutes and message!\n\nUsage: ${formatter.mono('!remind 5 Take a break')}\n\nThis will remind you after 5 minutes.`;
        }

        const minutes = parseInt(args[0]);
        
        if (isNaN(minutes) || minutes < 1 || minutes > 1440) {
            return '❌ Minutes must be a number between 1 and 1440 (24 hours)!';
        }

        const message = args.slice(1).join(' ');
        const milliseconds = minutes * 60 * 1000;

        // Set reminder
        const timeout = setTimeout(async () => {
            const reminderMessage = `
⏰ ${formatter.bold('REMINDER!')} ⏰

${formatter.divider()}

📝 ${message}

${formatter.divider()}

✅ ${formatter.italic('Hope this helps!')}
            `.trim();

            try {
                await api.sendText(from, reminderMessage);
            } catch (error) {
                console.error('Failed to send reminder:', error);
            }

            reminders.delete(from);
        }, milliseconds);

        // Store reminder
        reminders.set(from, { timeout, message, time: Date.now() + milliseconds });

        const confirmMessage = `
⏰ ${formatter.bold('REMINDER SET!')} ⏰

${formatter.divider()}

⏱️ ${formatter.bold('Duration:')} ${minutes} minute${minutes > 1 ? 's' : ''}
📝 ${formatter.bold('Message:')} ${message}
🕐 ${formatter.bold('Will remind at:')} ${new Date(Date.now() + milliseconds).toLocaleTimeString()}

${formatter.divider()}

✨ ${formatter.italic('I\'ll ping you when it\'s time!')}
        `.trim();

        return confirmMessage;
    }
};
