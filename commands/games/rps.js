const formatter = require('../../utils/formatter');

module.exports = {
    name: 'rps',
    aliases: ['rockpaperscissors'],
    category: 'games',
    description: '✊ Play Rock Paper Scissors against the bot',
    usage: '!rps <rock/paper/scissors>',
    cooldown: 2000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        if (args.length === 0) {
            return `✊ Let's play Rock Paper Scissors!\n\nUsage: ${formatter.mono('!rps rock')}\n\nChoices: rock, paper, scissors`;
        }

        const choices = ['rock', 'paper', 'scissors'];
        const userChoice = args[0].toLowerCase();

        if (!choices.includes(userChoice)) {
            return `❌ Invalid choice!\n\nPlease choose: rock, paper, or scissors`;
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        const emojis = {
            rock: '✊',
            paper: '✋',
            scissors: '✌️'
        };

        let result;
        let resultEmoji;

        if (userChoice === botChoice) {
            result = "It's a TIE!";
            resultEmoji = '🤝';
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = 'You WIN!';
            resultEmoji = '🎉';
        } else {
            result = 'You LOSE!';
            resultEmoji = '😔';
        }

        const message = `
✊ ${formatter.bold('ROCK PAPER SCISSORS')} ✋

${formatter.divider()}

_Rock..._
_Paper..._
_Scissors..._
_SHOOT!_

${formatter.divider()}

👤 ${formatter.bold('You:')} ${emojis[userChoice]} ${userChoice}
🤖 ${formatter.bold('Bot:')} ${emojis[botChoice]} ${botChoice}

${resultEmoji} ${formatter.bold(result)} ${resultEmoji}

${formatter.divider()}

🎮 ${formatter.italic('Challenge me again!')}
        `.trim();

        return message;
    }
};
