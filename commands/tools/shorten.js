const formatter = require('../../utils/formatter');

module.exports = {
    name: 'shorten',
    aliases: ['shorturl', 'tinyurl'],
    category: 'tools',
    description: '🔗 URL shortener (requires API integration)',
    usage: '!shorten <url>',
    cooldown: 5000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length === 0) {
            return `🔗 Please provide a URL to shorten!\n\nUsage: ${formatter.mono('!shorten https://example.com/very/long/url')}`;
        }

        const url = args[0];

        // Validate URL format
        try {
            new URL(url);
        } catch (error) {
            return '❌ Invalid URL format!\n\nPlease provide a valid URL starting with http:// or https://';
        }

        // Placeholder response with integration instructions
        const message = `
🔗 ${formatter.bold('URL SHORTENER')} 🔗

${formatter.divider()}

⚠️ ${formatter.bold('API Integration Required')}

To use this feature, integrate a URL shortening service:

${formatter.bold('Popular Options:')}

1️⃣ ${formatter.bold('TinyURL API')}
   → Free, no API key needed
   → https://tinyurl.com/app/dev

2️⃣ ${formatter.bold('Bitly API')}
   → Free tier available
   → https://dev.bitly.com/

3️⃣ ${formatter.bold('Is.gd API')}
   → Free, simple API
   → https://is.gd/developers.php

${formatter.divider()}

📝 ${formatter.bold('Your URL:')}
${url}

${formatter.bold('Sample shortened URL:')}
https://tiny.url/abc123

${formatter.divider()}

✨ ${formatter.italic('Configure your API to enable URL shortening!')}
        `.trim();

        return message;
    }
};
