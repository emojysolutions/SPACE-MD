const formatter = require('../../utils/formatter');
const triviaQuestions = require('../../data/trivia.json');

module.exports = {
    name: 'trivia',
    aliases: ['quiz', 'question'],
    category: 'games',
    description: '🎯 Play a trivia quiz game',
    usage: '!trivia [answer]',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const session = sessionManager.getSession(from);

        // If user is answering
        if (session && session.game === 'trivia' && args.length > 0) {
            const userAnswer = args[0].toUpperCase();
            const correctAnswer = session.triviaAnswer;

            sessionManager.clearSession(from);

            if (userAnswer === correctAnswer) {
                const newScore = (session.triviaScore || 0) + 1;
                
                const message = `
🎉 ${formatter.bold('CORRECT!')} 🎉

${formatter.divider()}

✅ The answer was ${formatter.bold(correctAnswer)}!

🏆 ${formatter.bold('Your Score:')} ${newScore}

${formatter.divider()}

🎯 ${formatter.italic('Great job! Play again?')}
Type ${formatter.mono('!trivia')} for another question!
                `.trim();

                return message;
            } else {
                const message = `
❌ ${formatter.bold('INCORRECT!')} ❌

${formatter.divider()}

The correct answer was ${formatter.bold(correctAnswer)}

🏆 ${formatter.bold('Your Score:')} ${session.triviaScore || 0}

${formatter.divider()}

🎯 ${formatter.italic('Better luck next time!')}
Type ${formatter.mono('!trivia')} to try another question!
                `.trim();

                return message;
            }
        }

        // Start new trivia question
        const question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
        
        sessionManager.setSession(from, {
            game: 'trivia',
            triviaAnswer: question.answer,
            triviaScore: (session && session.triviaScore) || 0
        });

        const message = `
🎯 ${formatter.bold('TRIVIA CHALLENGE!')} 🎯

${formatter.divider()}

📂 ${formatter.bold('Category:')} ${question.category}

❓ ${formatter.bold('Question:')}
${question.question}

${question.options.join('\n')}

${formatter.divider()}

💡 Reply with your answer (A, B, C, or D):
${formatter.mono('!trivia A')}

🏆 ${formatter.bold('Current Score:')} ${(session && session.triviaScore) || 0}
        `.trim();

        return message;
    }
};
