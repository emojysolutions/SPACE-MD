const formatter = require('../../utils/formatter');

const words = [
    { word: 'javascript', hint: 'Programming Language', difficulty: 'easy' },
    { word: 'elephant', hint: 'Large Animal', difficulty: 'easy' },
    { word: 'rainbow', hint: 'Weather Phenomenon', difficulty: 'easy' },
    { word: 'computer', hint: 'Electronic Device', difficulty: 'easy' },
    { word: 'butterfly', hint: 'Flying Insect', difficulty: 'medium' },
    { word: 'chocolate', hint: 'Sweet Treat', difficulty: 'easy' },
    { word: 'mountain', hint: 'Geographical Feature', difficulty: 'easy' },
    { word: 'telescope', hint: 'Astronomy Tool', difficulty: 'medium' },
    { word: 'hurricane', hint: 'Weather Event', difficulty: 'medium' },
    { word: 'pyramid', hint: 'Ancient Structure', difficulty: 'medium' },
    { word: 'symphony', hint: 'Musical Composition', difficulty: 'hard' },
    { word: 'algorithm', hint: 'Computer Science Term', difficulty: 'hard' },
    { word: 'metamorphosis', hint: 'Transformation Process', difficulty: 'hard' },
    { word: 'archaeology', hint: 'Study of History', difficulty: 'hard' },
    { word: 'constellation', hint: 'Star Pattern', difficulty: 'hard' }
];

function scrambleWord(word) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

module.exports = {
    name: 'wordgame',
    aliases: ['unscramble', 'scramble'],
    category: 'games',
    description: '🔤 Unscramble the word',
    usage: '!wordgame [answer]',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        const session = sessionManager.getSession(from);

        // If user is answering
        if (session && session.game === 'wordgame' && args.length > 0) {
            const userAnswer = args.join(' ').toLowerCase();
            const correctAnswer = session.wordAnswer.toLowerCase();

            sessionManager.clearSession(from);

            if (userAnswer === correctAnswer) {
                const message = `
🎉 ${formatter.bold('CORRECT!')} 🎉

${formatter.divider()}

✅ The word was: ${formatter.bold(correctAnswer.toUpperCase())}
💡 ${formatter.bold('Hint:')} ${session.wordHint}
⭐ ${formatter.bold('Difficulty:')} ${session.wordDifficulty}

${formatter.divider()}

🏆 ${formatter.italic('Excellent unscrambling skills!')}
Type ${formatter.mono('!wordgame')} to play again!
                `.trim();

                return message;
            } else {
                const message = `
❌ ${formatter.bold('INCORRECT!')} ❌

${formatter.divider()}

Your answer: ${userAnswer}
Correct answer: ${formatter.bold(correctAnswer.toUpperCase())}
💡 ${formatter.bold('Hint:')} ${session.wordHint}

${formatter.divider()}

💪 ${formatter.italic('Try another word!')}
Type ${formatter.mono('!wordgame')} for a new challenge!
                `.trim();

                return message;
            }
        }

        // Start new word game
        const wordData = words[Math.floor(Math.random() * words.length)];
        let scrambled = scrambleWord(wordData.word);
        
        // Make sure scrambled is different from original
        let attempts = 0;
        while (scrambled === wordData.word && attempts < 10) {
            scrambled = scrambleWord(wordData.word);
            attempts++;
        }

        sessionManager.setSession(from, {
            game: 'wordgame',
            wordAnswer: wordData.word,
            wordHint: wordData.hint,
            wordDifficulty: wordData.difficulty
        });

        const difficultyEmoji = {
            easy: '🟢',
            medium: '🟡',
            hard: '🔴'
        };

        const message = `
🔤 ${formatter.bold('WORD SCRAMBLE!')} 🔤

${formatter.divider()}

${difficultyEmoji[wordData.difficulty]} ${formatter.bold('Difficulty:')} ${wordData.difficulty.toUpperCase()}

🔠 ${formatter.bold('Scrambled Word:')}
${formatter.mono(scrambled.toUpperCase())}

💡 ${formatter.bold('Hint:')} ${wordData.hint}
📏 ${formatter.bold('Length:')} ${wordData.word.length} letters

${formatter.divider()}

💬 Type your answer:
${formatter.mono('!wordgame <your answer>')}

Example: ${formatter.mono('!wordgame elephant')}
        `.trim();

        return message;
    }
};
