const formatter = require('../../utils/formatter');
const config = require('../../config');
const { requireAdmin } = require('../../middleware/auth');

module.exports = {
    name: 'settings',
    aliases: ['config', 'preferences'],
    category: 'admin',
    description: '⚙️ View/modify bot settings (Admin only)',
    usage: '!settings <password> [view/set] [key] [value]',
    cooldown: 10000,
    adminOnly: true,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length === 0) {
            return '⚙️ Settings Manager\n\nUsage:\n• !settings <password> view - View all settings\n• !settings <password> set <key> <value> - Change a setting';
        }

        const auth = requireAdmin(args[0]);
        if (!auth.authorized) {
            return auth.message;
        }

        const action = args[1]?.toLowerCase() || 'view';

        if (action === 'view') {
            const message = `
⚙️ ${formatter.bold('BOT SETTINGS')}

${formatter.divider()}

${formatter.bold('Current Configuration:')}

🤖 ${formatter.bold('Bot Name:')} ${config.BOT_NAME}
📦 ${formatter.bold('Version:')} ${config.BOT_VERSION}
🔤 ${formatter.bold('Prefix:')} ${config.BOT_PREFIX}
🌐 ${formatter.bold('Environment:')} ${config.NODE_ENV}

${formatter.divider()}

${formatter.bold('Rate Limiting:')}

📊 ${formatter.bold('Max Messages:')} ${config.RATE_LIMIT_MAX}
⏱️ ${formatter.bold('Window:')} ${config.RATE_LIMIT_WINDOW / 1000}s

${formatter.divider()}

${formatter.bold('Timing:')}

⏰ ${formatter.bold('Default Cooldown:')} ${config.DEFAULT_COOLDOWN / 1000}s
⏳ ${formatter.bold('Session Timeout:')} ${config.SESSION_TIMEOUT / 1000 / 60}min

${formatter.divider()}

${formatter.bold('Server:')}

🔌 ${formatter.bold('Port:')} ${config.PORT}
🔐 ${formatter.bold('Webhook Token:')} ${config.WEBHOOK_VERIFY_TOKEN}

${formatter.divider()}

ℹ️ ${formatter.italic('Settings are loaded from environment variables')}
💡 Modify .env file and restart to apply changes
            `.trim();

            return message;
        }

        if (action === 'set') {
            return `
⚠️ ${formatter.bold('RUNTIME SETTINGS MODIFICATION')}

${formatter.divider()}

Runtime setting modification is currently not supported for security reasons.

To change settings:
1. Edit the ${formatter.mono('.env')} file
2. Restart the bot

${formatter.divider()}

💡 ${formatter.italic('This ensures settings persist across restarts')}
            `.trim();
        }

        return `❌ Unknown action: ${action}\n\nAvailable: view, set`;
    }
};
