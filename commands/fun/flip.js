const formatter = require('../../utils/formatter');

module.exports = {
    name: 'flip',
    aliases: ['coin', 'coinflip'],
    category: 'fun',
    description: '🪙 Flip a coin',
    usage: '!flip',
    cooldown: 2000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const result = Math.random() < 0.5 ? 'HEADS' : 'TAILS';
        const emoji = result === 'HEADS' ? '👑' : '🦅';

        const message = `
🪙 ${formatter.bold('COIN FLIP')} 🪙

${formatter.divider()}

_Flipping the coin..._
_*spins in the air*..._
_*clink*..._

${formatter.divider()}

${emoji} ${formatter.bold(result)}! ${emoji}

${formatter.divider()}

🎲 ${formatter.italic('Lady Luck has decided!')}
        `.trim();

        return message;
    }
};
