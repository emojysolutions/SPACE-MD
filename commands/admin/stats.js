const formatter = require('../../utils/formatter');
const config = require('../../config');
const { requireAdmin } = require('../../middleware/auth');
const os = require('os');

module.exports = {
    name: 'stats',
    aliases: ['statistics', 'botstats'],
    category: 'admin',
    description: '📊 View bot statistics (Admin only)',
    usage: '!stats <admin_password>',
    cooldown: 10000,
    adminOnly: true,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length === 0) {
            return '🚫 Admin password required!\n\nUsage: !stats <admin_password>';
        }

        const auth = requireAdmin(args[0]);
        if (!auth.authorized) {
            return auth.message;
        }

        const uptime = Date.now() - config.START_TIME;
        const uptimeFormatted = formatter.formatDuration(uptime);

        const memUsage = process.memoryUsage();
        const memUsageMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
        const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);

        const totalMessages = stats.totalMessages || 0;
        const uniqueUsers = stats.uniqueUsers || 0;
        const commandCount = stats.commandCount || 0;

        const topCommands = stats.commandUsage || {};
        const topCommandsList = Object.entries(topCommands)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([cmd, count]) => `  • ${cmd}: ${count} times`)
            .join('\n') || '  No data yet';

        const message = `
${formatter.header('BOT STATISTICS')}

${formatter.divider()}

⏰ ${formatter.bold('Uptime:')} ${uptimeFormatted}
💾 ${formatter.bold('Memory:')} ${memUsageMB} MB / ${memTotalMB} MB
🖥️ ${formatter.bold('Platform:')} ${os.platform()} ${os.arch()}
📍 ${formatter.bold('Node Version:')} ${process.version}

${formatter.divider()}

📊 ${formatter.bold('USAGE STATISTICS')}

💬 ${formatter.bold('Total Messages:')} ${formatter.cleanNumber(totalMessages)}
👥 ${formatter.bold('Unique Users:')} ${formatter.cleanNumber(uniqueUsers)}
🎮 ${formatter.bold('Total Commands:')} ${commandCount}
⚡ ${formatter.bold('Active Sessions:')} ${sessionManager.getSessionCount()}

${formatter.divider()}

🏆 ${formatter.bold('TOP COMMANDS')}

${topCommandsList}

${formatter.divider()}

✅ ${formatter.italic('All systems operational!')}
        `.trim();

        return message;
    }
};
