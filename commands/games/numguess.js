const formatter = require('../../utils/formatter');

module.exports = {
    name: 'numguess',
    aliases: ['guessnumber', 'guessnum'],
    category: 'games',
    description: '🔢 Guess a number between 1-100',
    usage: '!numguess [number]',
    cooldown: 2000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const session = sessionManager.getSession(from);

        // If game is active and user is guessing
        if (session && session.game === 'numguess' && args.length > 0) {
            const guess = parseInt(args[0]);
            
            if (isNaN(guess) || guess < 1 || guess > 100) {
                return '❌ Please enter a valid number between 1 and 100!';
            }

            session.attempts++;
            const target = session.targetNumber;

            if (guess === target) {
                sessionManager.clearSession(from);
                
                const message = `
🎉 ${formatter.bold('CONGRATULATIONS!')} 🎉

${formatter.divider()}

✅ You guessed the number: ${formatter.bold(target)}
🎯 ${formatter.bold('Attempts:')} ${session.attempts}

${session.attempts <= 5 ? '🏆 Amazing! You\'re a mind reader!' : ''}
${session.attempts <= 10 && session.attempts > 5 ? '👍 Great job!' : ''}
${session.attempts > 10 ? '💪 Good effort!' : ''}

${formatter.divider()}

🎮 ${formatter.italic('Play again?')} Type ${formatter.mono('!numguess')}
                `.trim();

                return message;
            }

            const hint = guess < target ? '📈 Too LOW!' : '📉 Too HIGH!';
            const distance = Math.abs(guess - target);
            let temperature;

            if (distance <= 5) temperature = '🔥 BURNING HOT!';
            else if (distance <= 10) temperature = '♨️ Very Warm';
            else if (distance <= 20) temperature = '🌡️ Warm';
            else if (distance <= 30) temperature = '❄️ Cool';
            else temperature = '🧊 Ice Cold!';

            sessionManager.setSession(from, session);

            const message = `
🔢 ${formatter.bold('NUMBER GUESSING GAME')} 🔢

${formatter.divider()}

Your guess: ${formatter.bold(guess)}

${hint}
${temperature}

🎯 ${formatter.bold('Attempts:')} ${session.attempts}

${formatter.divider()}

💡 Keep guessing! Type ${formatter.mono('!numguess <number>')}
            `.trim();

            return message;
        }

        // Start new game
        const targetNumber = Math.floor(Math.random() * 100) + 1;
        
        sessionManager.setSession(from, {
            game: 'numguess',
            targetNumber: targetNumber,
            attempts: 0
        });

        const message = `
🔢 ${formatter.bold('NUMBER GUESSING GAME')} 🔢

${formatter.divider()}

🎯 ${formatter.bold('Challenge:')}
I'm thinking of a number between 1 and 100!

Can you guess it?

${formatter.divider()}

💡 ${formatter.bold('How to play:')}
Type ${formatter.mono('!numguess <number>')} to make a guess

I'll give you hints:
• 🔥 HOT - Very close!
• 🌡️ WARM - Getting there
• ❄️ COLD - Far away

${formatter.divider()}

🎮 ${formatter.italic('Good luck!')}
        `.trim();

        return message;
    }
};
