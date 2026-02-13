const formatter = require('../../utils/formatter');
const jokes = require('../../data/jokes.json');

module.exports = {
    name: 'joke',
    aliases: ['funny', 'laugh'],
    category: 'fun',
    description: '😂 Get a random joke to brighten your day',
    usage: '!joke',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

        const message = `
🎭 ${formatter.bold('JOKE TIME!')} 😂

${formatter.divider()}

${randomJoke.joke}

${formatter.italic(randomJoke.punchline)}

${formatter.divider()}

😄 ${formatter.italic('Hope that made you smile!')}
        `.trim();

        return message;
    }
};
