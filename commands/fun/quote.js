const formatter = require('../../utils/formatter');
const quotes = require('../../data/quotes.json');

module.exports = {
    name: 'quote',
    aliases: ['inspire', 'inspiration'],
    category: 'fun',
    description: '💭 Get an inspirational quote',
    usage: '!quote',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        const message = `
✨ ${formatter.bold('INSPIRATIONAL QUOTE')} ✨

${formatter.divider()}

${formatter.italic(`"${randomQuote.quote}"`)}

— ${formatter.bold(randomQuote.author)}

${formatter.divider()}

🌟 ${formatter.italic('Stay inspired, space traveler!')}
        `.trim();

        return message;
    }
};
