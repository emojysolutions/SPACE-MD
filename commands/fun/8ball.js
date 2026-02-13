const formatter = require('../../utils/formatter');
const responses = require('../../data/8ball.json');

module.exports = {
    name: '8ball',
    aliases: ['eightball', 'ask'],
    category: 'fun',
    description: '🔮 Ask the magic 8-ball a yes/no question',
    usage: '!8ball <question>',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length === 0) {
            return `❓ Please ask a question!\n\nUsage: ${formatter.mono('!8ball Will I be successful?')}`;
        }

        const question = args.join(' ');
        const response = responses[Math.floor(Math.random() * responses.length)];

        const message = `
🔮 ${formatter.bold('MAGIC 8-BALL')} 🔮

${formatter.divider()}

❓ ${formatter.bold('Question:')}
${question}

🎱 ${formatter.bold('Answer:')}
${formatter.italic(response)}

${formatter.divider()}

✨ ${formatter.italic('The cosmos has spoken!')}
        `.trim();

        return message;
    }
};
