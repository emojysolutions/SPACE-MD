const formatter = require('../../utils/formatter');
const facts = require('../../data/facts.json');

module.exports = {
    name: 'fact',
    aliases: ['funfact', 'randomfact'],
    category: 'fun',
    description: '🧠 Get a random interesting fact',
    usage: '!fact',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const randomFact = facts[Math.floor(Math.random() * facts.length)];

        const message = `
🧠 ${formatter.bold('DID YOU KNOW?')} 🌟

${formatter.divider()}

${randomFact.fact}

${formatter.divider()}

💡 ${formatter.italic('Knowledge is power!')}
        `.trim();

        return message;
    }
};
