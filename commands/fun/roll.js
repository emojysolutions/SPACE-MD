const formatter = require('../../utils/formatter');

module.exports = {
    name: 'roll',
    aliases: ['dice', 'rolldice'],
    category: 'fun',
    description: '🎲 Roll dice (supports D&D notation like 2d6)',
    usage: '!roll [XdY]',
    cooldown: 2000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        let numDice = 1;
        let numSides = 6;

        // Parse dice notation (e.g., "3d6")
        if (args.length > 0) {
            const dicePattern = /^(\d+)d(\d+)$/i;
            const match = args[0].match(dicePattern);

            if (match) {
                numDice = parseInt(match[1]);
                numSides = parseInt(match[2]);

                // Validate
                if (numDice < 1 || numDice > 100) {
                    return '❌ Number of dice must be between 1 and 100!';
                }
                if (numSides < 2 || numSides > 1000) {
                    return '❌ Number of sides must be between 2 and 1000!';
                }
            } else {
                return `❌ Invalid dice notation!\n\nUsage: ${formatter.mono('!roll 3d6')}\nOr just ${formatter.mono('!roll')} for a single d6`;
            }
        }

        const rolls = [];
        let total = 0;

        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * numSides) + 1;
            rolls.push(roll);
            total += roll;
        }

        const message = `
🎲 ${formatter.bold('DICE ROLL')} 🎲

${formatter.divider()}

🎯 ${formatter.bold('Rolling:')} ${numDice}d${numSides}

${rolls.length > 1 ? `🎲 ${formatter.bold('Individual Rolls:')}\n${rolls.join(', ')}\n` : ''}
${formatter.bold('Result:')} ${formatter.mono(total.toString())}

${formatter.divider()}

🎲 ${formatter.italic('May the dice be ever in your favor!')}
        `.trim();

        return message;
    }
};
