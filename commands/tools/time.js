const formatter = require('../../utils/formatter');

const moment = require('moment-timezone');

module.exports = {
    name: 'time',
    aliases: ['clock', 'timezone', 'worldclock'],
    category: 'tools',
    description: '🕐 Show current time in different timezones',
    usage: '!time [city/timezone]',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const timezones = {
            'london': 'Europe/London',
            'paris': 'Europe/Paris',
            'tokyo': 'Asia/Tokyo',
            'sydney': 'Australia/Sydney',
            'new york': 'America/New_York',
            'los angeles': 'America/Los_Angeles',
            'chicago': 'America/Chicago',
            'dubai': 'Asia/Dubai',
            'moscow': 'Europe/Moscow',
            'beijing': 'Asia/Shanghai',
            'mumbai': 'Asia/Kolkata',
            'singapore': 'Asia/Singapore',
            'hong kong': 'Asia/Hong_Kong',
            'toronto': 'America/Toronto',
            'berlin': 'Europe/Berlin'
        };

        if (args.length === 0) {
            const cities = Object.keys(timezones).join(', ');
            return `🕐 Please specify a city!\n\nAvailable cities:\n${cities}\n\nUsage: ${formatter.mono('!time Tokyo')}`;
        }

        const cityInput = args.join(' ').toLowerCase();
        const timezone = timezones[cityInput];

        if (!timezone) {
            return `❌ City not found!\n\nAvailable: ${Object.keys(timezones).join(', ')}`;
        }

        const now = moment().tz(timezone);
        const cityName = args.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        const message = `
🕐 ${formatter.bold('WORLD CLOCK')} 🌍

${formatter.divider()}

📍 ${formatter.bold('Location:')} ${cityName}
⏰ ${formatter.bold('Time:')} ${now.format('HH:mm:ss')}
📅 ${formatter.bold('Date:')} ${now.format('MMMM DD, YYYY')}
🌐 ${formatter.bold('Timezone:')} ${timezone}
🔄 ${formatter.bold('UTC Offset:')} ${now.format('Z')}

${formatter.divider()}

✨ ${formatter.italic('Keeping you in sync with the world!')}
        `.trim();

        return message;
    }
};
