const formatter = require('../../utils/formatter');
const config = require('../../config');

module.exports = {
    name: 'ping',
    aliases: ['latency', 'speed'],
    category: 'general',
    description: '🏓 Check bot response time and uptime',
    usage: '!ping',
    cooldown: 5000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const startTime = Date.now();
        
        // Calculate uptime
        const uptime = Date.now() - config.START_TIME;
        const uptimeFormatted = formatter.formatDuration(uptime);

        const responseTime = Date.now() - startTime;

        const message = `
🏓 ${formatter.bold('PONG!')} 🚀

${formatter.divider()}

⚡ ${formatter.bold('Response Time:')} ${responseTime}ms
⏰ ${formatter.bold('Uptime:')} ${uptimeFormatted}
🌌 ${formatter.bold('Status:')} All systems operational!

${formatter.divider()}

💬 _Zooming through space at light speed!_ ✨
        `.trim();

        return message;
    }
};
