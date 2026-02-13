const formatter = require('../../utils/formatter');
const { requireAdmin } = require('../../middleware/auth');

// Store known user numbers
const knownUsers = new Set();

module.exports = {
    name: 'broadcast',
    aliases: ['announce', 'messageall'],
    category: 'admin',
    description: '📢 Broadcast message to all users (Admin only)',
    usage: '!broadcast <password> <message>',
    cooldown: 60000,
    adminOnly: true,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length < 2) {
            return '📢 Broadcast Command\n\nUsage: !broadcast <admin_password> <message>\n\nThis will send a message to all known users.';
        }

        const auth = requireAdmin(args[0]);
        if (!auth.authorized) {
            return auth.message;
        }

        const message = args.slice(1).join(' ');

        // Get all unique users from stats
        const users = Array.from(stats.uniqueUsers || []);

        if (users.length === 0) {
            return '❌ No users found to broadcast to!\n\nThe bot needs to receive at least one message from users first.';
        }

        const broadcastMessage = `
📢 ${formatter.bold('BROADCAST MESSAGE')} 📢

${formatter.divider()}

${message}

${formatter.divider()}

${formatter.italic('This is an official announcement from SPACE-MD Ultra')}
        `.trim();

        let successCount = 0;
        let failCount = 0;

        // Send to all users
        for (const userId of users) {
            try {
                await api.sendText(userId, broadcastMessage);
                successCount++;
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                failCount++;
            }
        }

        const confirmMessage = `
✅ ${formatter.bold('BROADCAST COMPLETE!')}

${formatter.divider()}

📊 ${formatter.bold('Results:')}
✅ Sent successfully: ${successCount}
❌ Failed: ${failCount}
👥 Total users: ${users.length}

${formatter.divider()}

📝 ${formatter.bold('Message:')}
${message}
        `.trim();

        return confirmMessage;
    }
};
